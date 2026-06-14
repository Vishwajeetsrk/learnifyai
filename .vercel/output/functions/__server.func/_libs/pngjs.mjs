import require$$1$1 from "zlib";
import require$$0$1 from "assert";
import require$$3 from "buffer";
import require$$0 from "util";
import require$$1 from "stream";
var png = {};
var parserAsync = { exports: {} };
var chunkstream = { exports: {} };
var hasRequiredChunkstream;
function requireChunkstream() {
  if (hasRequiredChunkstream) return chunkstream.exports;
  hasRequiredChunkstream = 1;
  let util = require$$0;
  let Stream = require$$1;
  let ChunkStream = chunkstream.exports = function() {
    Stream.call(this);
    this._buffers = [];
    this._buffered = 0;
    this._reads = [];
    this._paused = false;
    this._encoding = "utf8";
    this.writable = true;
  };
  util.inherits(ChunkStream, Stream);
  ChunkStream.prototype.read = function(length, callback) {
    this._reads.push({
      length: Math.abs(length),
      // if length < 0 then at most this length
      allowLess: length < 0,
      func: callback
    });
    process.nextTick(
      (function() {
        this._process();
        if (this._paused && this._reads && this._reads.length > 0) {
          this._paused = false;
          this.emit("drain");
        }
      }).bind(this)
    );
  };
  ChunkStream.prototype.write = function(data, encoding) {
    if (!this.writable) {
      this.emit("error", new Error("Stream not writable"));
      return false;
    }
    let dataBuffer;
    if (Buffer.isBuffer(data)) {
      dataBuffer = data;
    } else {
      dataBuffer = Buffer.from(data, encoding || this._encoding);
    }
    this._buffers.push(dataBuffer);
    this._buffered += dataBuffer.length;
    this._process();
    if (this._reads && this._reads.length === 0) {
      this._paused = true;
    }
    return this.writable && !this._paused;
  };
  ChunkStream.prototype.end = function(data, encoding) {
    if (data) {
      this.write(data, encoding);
    }
    this.writable = false;
    if (!this._buffers) {
      return;
    }
    if (this._buffers.length === 0) {
      this._end();
    } else {
      this._buffers.push(null);
      this._process();
    }
  };
  ChunkStream.prototype.destroySoon = ChunkStream.prototype.end;
  ChunkStream.prototype._end = function() {
    if (this._reads.length > 0) {
      this.emit("error", new Error("Unexpected end of input"));
    }
    this.destroy();
  };
  ChunkStream.prototype.destroy = function() {
    if (!this._buffers) {
      return;
    }
    this.writable = false;
    this._reads = null;
    this._buffers = null;
    this.emit("close");
  };
  ChunkStream.prototype._processReadAllowingLess = function(read) {
    this._reads.shift();
    let smallerBuf = this._buffers[0];
    if (smallerBuf.length > read.length) {
      this._buffered -= read.length;
      this._buffers[0] = smallerBuf.slice(read.length);
      read.func.call(this, smallerBuf.slice(0, read.length));
    } else {
      this._buffered -= smallerBuf.length;
      this._buffers.shift();
      read.func.call(this, smallerBuf);
    }
  };
  ChunkStream.prototype._processRead = function(read) {
    this._reads.shift();
    let pos = 0;
    let count = 0;
    let data = Buffer.alloc(read.length);
    while (pos < read.length) {
      let buf = this._buffers[count++];
      let len = Math.min(buf.length, read.length - pos);
      buf.copy(data, pos, 0, len);
      pos += len;
      if (len !== buf.length) {
        this._buffers[--count] = buf.slice(len);
      }
    }
    if (count > 0) {
      this._buffers.splice(0, count);
    }
    this._buffered -= read.length;
    read.func.call(this, data);
  };
  ChunkStream.prototype._process = function() {
    try {
      while (this._buffered > 0 && this._reads && this._reads.length > 0) {
        let read = this._reads[0];
        if (read.allowLess) {
          this._processReadAllowingLess(read);
        } else if (this._buffered >= read.length) {
          this._processRead(read);
        } else {
          break;
        }
      }
      if (this._buffers && !this.writable) {
        this._end();
      }
    } catch (ex) {
      this.emit("error", ex);
    }
  };
  return chunkstream.exports;
}
var filterParseAsync = { exports: {} };
var filterParse = { exports: {} };
var interlace = {};
var hasRequiredInterlace;
function requireInterlace() {
  if (hasRequiredInterlace) return interlace;
  hasRequiredInterlace = 1;
  let imagePasses = [
    {
      // pass 1 - 1px
      x: [0],
      y: [0]
    },
    {
      // pass 2 - 1px
      x: [4],
      y: [0]
    },
    {
      // pass 3 - 2px
      x: [0, 4],
      y: [4]
    },
    {
      // pass 4 - 4px
      x: [2, 6],
      y: [0, 4]
    },
    {
      // pass 5 - 8px
      x: [0, 2, 4, 6],
      y: [2, 6]
    },
    {
      // pass 6 - 16px
      x: [1, 3, 5, 7],
      y: [0, 2, 4, 6]
    },
    {
      // pass 7 - 32px
      x: [0, 1, 2, 3, 4, 5, 6, 7],
      y: [1, 3, 5, 7]
    }
  ];
  interlace.getImagePasses = function(width, height) {
    let images = [];
    let xLeftOver = width % 8;
    let yLeftOver = height % 8;
    let xRepeats = (width - xLeftOver) / 8;
    let yRepeats = (height - yLeftOver) / 8;
    for (let i = 0; i < imagePasses.length; i++) {
      let pass = imagePasses[i];
      let passWidth = xRepeats * pass.x.length;
      let passHeight = yRepeats * pass.y.length;
      for (let j = 0; j < pass.x.length; j++) {
        if (pass.x[j] < xLeftOver) {
          passWidth++;
        } else {
          break;
        }
      }
      for (let j = 0; j < pass.y.length; j++) {
        if (pass.y[j] < yLeftOver) {
          passHeight++;
        } else {
          break;
        }
      }
      if (passWidth > 0 && passHeight > 0) {
        images.push({ width: passWidth, height: passHeight, index: i });
      }
    }
    return images;
  };
  interlace.getInterlaceIterator = function(width) {
    return function(x, y, pass) {
      let outerXLeftOver = x % imagePasses[pass].x.length;
      let outerX = (x - outerXLeftOver) / imagePasses[pass].x.length * 8 + imagePasses[pass].x[outerXLeftOver];
      let outerYLeftOver = y % imagePasses[pass].y.length;
      let outerY = (y - outerYLeftOver) / imagePasses[pass].y.length * 8 + imagePasses[pass].y[outerYLeftOver];
      return outerX * 4 + outerY * width * 4;
    };
  };
  return interlace;
}
var paethPredictor;
var hasRequiredPaethPredictor;
function requirePaethPredictor() {
  if (hasRequiredPaethPredictor) return paethPredictor;
  hasRequiredPaethPredictor = 1;
  paethPredictor = function paethPredictor2(left, above, upLeft) {
    let paeth = left + above - upLeft;
    let pLeft = Math.abs(paeth - left);
    let pAbove = Math.abs(paeth - above);
    let pUpLeft = Math.abs(paeth - upLeft);
    if (pLeft <= pAbove && pLeft <= pUpLeft) {
      return left;
    }
    if (pAbove <= pUpLeft) {
      return above;
    }
    return upLeft;
  };
  return paethPredictor;
}
var hasRequiredFilterParse;
function requireFilterParse() {
  if (hasRequiredFilterParse) return filterParse.exports;
  hasRequiredFilterParse = 1;
  let interlaceUtils = requireInterlace();
  let paethPredictor2 = requirePaethPredictor();
  function getByteWidth(width, bpp, depth) {
    let byteWidth = width * bpp;
    if (depth !== 8) {
      byteWidth = Math.ceil(byteWidth / (8 / depth));
    }
    return byteWidth;
  }
  let Filter = filterParse.exports = function(bitmapInfo, dependencies) {
    let width = bitmapInfo.width;
    let height = bitmapInfo.height;
    let interlace2 = bitmapInfo.interlace;
    let bpp = bitmapInfo.bpp;
    let depth = bitmapInfo.depth;
    this.read = dependencies.read;
    this.write = dependencies.write;
    this.complete = dependencies.complete;
    this._imageIndex = 0;
    this._images = [];
    if (interlace2) {
      let passes = interlaceUtils.getImagePasses(width, height);
      for (let i = 0; i < passes.length; i++) {
        this._images.push({
          byteWidth: getByteWidth(passes[i].width, bpp, depth),
          height: passes[i].height,
          lineIndex: 0
        });
      }
    } else {
      this._images.push({
        byteWidth: getByteWidth(width, bpp, depth),
        height,
        lineIndex: 0
      });
    }
    if (depth === 8) {
      this._xComparison = bpp;
    } else if (depth === 16) {
      this._xComparison = bpp * 2;
    } else {
      this._xComparison = 1;
    }
  };
  Filter.prototype.start = function() {
    this.read(
      this._images[this._imageIndex].byteWidth + 1,
      this._reverseFilterLine.bind(this)
    );
  };
  Filter.prototype._unFilterType1 = function(rawData, unfilteredLine, byteWidth) {
    let xComparison = this._xComparison;
    let xBiggerThan = xComparison - 1;
    for (let x = 0; x < byteWidth; x++) {
      let rawByte = rawData[1 + x];
      let f1Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
      unfilteredLine[x] = rawByte + f1Left;
    }
  };
  Filter.prototype._unFilterType2 = function(rawData, unfilteredLine, byteWidth) {
    let lastLine = this._lastLine;
    for (let x = 0; x < byteWidth; x++) {
      let rawByte = rawData[1 + x];
      let f2Up = lastLine ? lastLine[x] : 0;
      unfilteredLine[x] = rawByte + f2Up;
    }
  };
  Filter.prototype._unFilterType3 = function(rawData, unfilteredLine, byteWidth) {
    let xComparison = this._xComparison;
    let xBiggerThan = xComparison - 1;
    let lastLine = this._lastLine;
    for (let x = 0; x < byteWidth; x++) {
      let rawByte = rawData[1 + x];
      let f3Up = lastLine ? lastLine[x] : 0;
      let f3Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
      let f3Add = Math.floor((f3Left + f3Up) / 2);
      unfilteredLine[x] = rawByte + f3Add;
    }
  };
  Filter.prototype._unFilterType4 = function(rawData, unfilteredLine, byteWidth) {
    let xComparison = this._xComparison;
    let xBiggerThan = xComparison - 1;
    let lastLine = this._lastLine;
    for (let x = 0; x < byteWidth; x++) {
      let rawByte = rawData[1 + x];
      let f4Up = lastLine ? lastLine[x] : 0;
      let f4Left = x > xBiggerThan ? unfilteredLine[x - xComparison] : 0;
      let f4UpLeft = x > xBiggerThan && lastLine ? lastLine[x - xComparison] : 0;
      let f4Add = paethPredictor2(f4Left, f4Up, f4UpLeft);
      unfilteredLine[x] = rawByte + f4Add;
    }
  };
  Filter.prototype._reverseFilterLine = function(rawData) {
    let filter = rawData[0];
    let unfilteredLine;
    let currentImage = this._images[this._imageIndex];
    let byteWidth = currentImage.byteWidth;
    if (filter === 0) {
      unfilteredLine = rawData.slice(1, byteWidth + 1);
    } else {
      unfilteredLine = Buffer.alloc(byteWidth);
      switch (filter) {
        case 1:
          this._unFilterType1(rawData, unfilteredLine, byteWidth);
          break;
        case 2:
          this._unFilterType2(rawData, unfilteredLine, byteWidth);
          break;
        case 3:
          this._unFilterType3(rawData, unfilteredLine, byteWidth);
          break;
        case 4:
          this._unFilterType4(rawData, unfilteredLine, byteWidth);
          break;
        default:
          throw new Error("Unrecognised filter type - " + filter);
      }
    }
    this.write(unfilteredLine);
    currentImage.lineIndex++;
    if (currentImage.lineIndex >= currentImage.height) {
      this._lastLine = null;
      this._imageIndex++;
      currentImage = this._images[this._imageIndex];
    } else {
      this._lastLine = unfilteredLine;
    }
    if (currentImage) {
      this.read(currentImage.byteWidth + 1, this._reverseFilterLine.bind(this));
    } else {
      this._lastLine = null;
      this.complete();
    }
  };
  return filterParse.exports;
}
var hasRequiredFilterParseAsync;
function requireFilterParseAsync() {
  if (hasRequiredFilterParseAsync) return filterParseAsync.exports;
  hasRequiredFilterParseAsync = 1;
  let util = require$$0;
  let ChunkStream = requireChunkstream();
  let Filter = requireFilterParse();
  let FilterAsync = filterParseAsync.exports = function(bitmapInfo) {
    ChunkStream.call(this);
    let buffers = [];
    let that = this;
    this._filter = new Filter(bitmapInfo, {
      read: this.read.bind(this),
      write: function(buffer) {
        buffers.push(buffer);
      },
      complete: function() {
        that.emit("complete", Buffer.concat(buffers));
      }
    });
    this._filter.start();
  };
  util.inherits(FilterAsync, ChunkStream);
  return filterParseAsync.exports;
}
var parser = { exports: {} };
var constants;
var hasRequiredConstants;
function requireConstants() {
  if (hasRequiredConstants) return constants;
  hasRequiredConstants = 1;
  constants = {
    PNG_SIGNATURE: [137, 80, 78, 71, 13, 10, 26, 10],
    TYPE_IHDR: 1229472850,
    TYPE_IEND: 1229278788,
    TYPE_IDAT: 1229209940,
    TYPE_PLTE: 1347179589,
    TYPE_tRNS: 1951551059,
    // eslint-disable-line camelcase
    TYPE_gAMA: 1732332865,
    // eslint-disable-line camelcase
    // color-type bits
    COLORTYPE_GRAYSCALE: 0,
    COLORTYPE_PALETTE: 1,
    COLORTYPE_COLOR: 2,
    COLORTYPE_ALPHA: 4,
    // e.g. grayscale and alpha
    // color-type combinations
    COLORTYPE_PALETTE_COLOR: 3,
    COLORTYPE_COLOR_ALPHA: 6,
    COLORTYPE_TO_BPP_MAP: {
      0: 1,
      2: 3,
      3: 1,
      4: 2,
      6: 4
    },
    GAMMA_DIVISION: 1e5
  };
  return constants;
}
var crc = { exports: {} };
var hasRequiredCrc;
function requireCrc() {
  if (hasRequiredCrc) return crc.exports;
  hasRequiredCrc = 1;
  let crcTable = [];
  (function() {
    for (let i = 0; i < 256; i++) {
      let currentCrc = i;
      for (let j = 0; j < 8; j++) {
        if (currentCrc & 1) {
          currentCrc = 3988292384 ^ currentCrc >>> 1;
        } else {
          currentCrc = currentCrc >>> 1;
        }
      }
      crcTable[i] = currentCrc;
    }
  })();
  let CrcCalculator = crc.exports = function() {
    this._crc = -1;
  };
  CrcCalculator.prototype.write = function(data) {
    for (let i = 0; i < data.length; i++) {
      this._crc = crcTable[(this._crc ^ data[i]) & 255] ^ this._crc >>> 8;
    }
    return true;
  };
  CrcCalculator.prototype.crc32 = function() {
    return this._crc ^ -1;
  };
  CrcCalculator.crc32 = function(buf) {
    let crc2 = -1;
    for (let i = 0; i < buf.length; i++) {
      crc2 = crcTable[(crc2 ^ buf[i]) & 255] ^ crc2 >>> 8;
    }
    return crc2 ^ -1;
  };
  return crc.exports;
}
var hasRequiredParser;
function requireParser() {
  if (hasRequiredParser) return parser.exports;
  hasRequiredParser = 1;
  let constants2 = requireConstants();
  let CrcCalculator = requireCrc();
  let Parser = parser.exports = function(options, dependencies) {
    this._options = options;
    options.checkCRC = options.checkCRC !== false;
    this._hasIHDR = false;
    this._hasIEND = false;
    this._emittedHeadersFinished = false;
    this._palette = [];
    this._colorType = 0;
    this._chunks = {};
    this._chunks[constants2.TYPE_IHDR] = this._handleIHDR.bind(this);
    this._chunks[constants2.TYPE_IEND] = this._handleIEND.bind(this);
    this._chunks[constants2.TYPE_IDAT] = this._handleIDAT.bind(this);
    this._chunks[constants2.TYPE_PLTE] = this._handlePLTE.bind(this);
    this._chunks[constants2.TYPE_tRNS] = this._handleTRNS.bind(this);
    this._chunks[constants2.TYPE_gAMA] = this._handleGAMA.bind(this);
    this.read = dependencies.read;
    this.error = dependencies.error;
    this.metadata = dependencies.metadata;
    this.gamma = dependencies.gamma;
    this.transColor = dependencies.transColor;
    this.palette = dependencies.palette;
    this.parsed = dependencies.parsed;
    this.inflateData = dependencies.inflateData;
    this.finished = dependencies.finished;
    this.simpleTransparency = dependencies.simpleTransparency;
    this.headersFinished = dependencies.headersFinished || function() {
    };
  };
  Parser.prototype.start = function() {
    this.read(constants2.PNG_SIGNATURE.length, this._parseSignature.bind(this));
  };
  Parser.prototype._parseSignature = function(data) {
    let signature = constants2.PNG_SIGNATURE;
    for (let i = 0; i < signature.length; i++) {
      if (data[i] !== signature[i]) {
        this.error(new Error("Invalid file signature"));
        return;
      }
    }
    this.read(8, this._parseChunkBegin.bind(this));
  };
  Parser.prototype._parseChunkBegin = function(data) {
    let length = data.readUInt32BE(0);
    let type = data.readUInt32BE(4);
    let name = "";
    for (let i = 4; i < 8; i++) {
      name += String.fromCharCode(data[i]);
    }
    let ancillary = Boolean(data[4] & 32);
    if (!this._hasIHDR && type !== constants2.TYPE_IHDR) {
      this.error(new Error("Expected IHDR on beggining"));
      return;
    }
    this._crc = new CrcCalculator();
    this._crc.write(Buffer.from(name));
    if (this._chunks[type]) {
      return this._chunks[type](length);
    }
    if (!ancillary) {
      this.error(new Error("Unsupported critical chunk type " + name));
      return;
    }
    this.read(length + 4, this._skipChunk.bind(this));
  };
  Parser.prototype._skipChunk = function() {
    this.read(8, this._parseChunkBegin.bind(this));
  };
  Parser.prototype._handleChunkEnd = function() {
    this.read(4, this._parseChunkEnd.bind(this));
  };
  Parser.prototype._parseChunkEnd = function(data) {
    let fileCrc = data.readInt32BE(0);
    let calcCrc = this._crc.crc32();
    if (this._options.checkCRC && calcCrc !== fileCrc) {
      this.error(new Error("Crc error - " + fileCrc + " - " + calcCrc));
      return;
    }
    if (!this._hasIEND) {
      this.read(8, this._parseChunkBegin.bind(this));
    }
  };
  Parser.prototype._handleIHDR = function(length) {
    this.read(length, this._parseIHDR.bind(this));
  };
  Parser.prototype._parseIHDR = function(data) {
    this._crc.write(data);
    let width = data.readUInt32BE(0);
    let height = data.readUInt32BE(4);
    let depth = data[8];
    let colorType = data[9];
    let compr = data[10];
    let filter = data[11];
    let interlace2 = data[12];
    if (depth !== 8 && depth !== 4 && depth !== 2 && depth !== 1 && depth !== 16) {
      this.error(new Error("Unsupported bit depth " + depth));
      return;
    }
    if (!(colorType in constants2.COLORTYPE_TO_BPP_MAP)) {
      this.error(new Error("Unsupported color type"));
      return;
    }
    if (compr !== 0) {
      this.error(new Error("Unsupported compression method"));
      return;
    }
    if (filter !== 0) {
      this.error(new Error("Unsupported filter method"));
      return;
    }
    if (interlace2 !== 0 && interlace2 !== 1) {
      this.error(new Error("Unsupported interlace method"));
      return;
    }
    this._colorType = colorType;
    let bpp = constants2.COLORTYPE_TO_BPP_MAP[this._colorType];
    this._hasIHDR = true;
    this.metadata({
      width,
      height,
      depth,
      interlace: Boolean(interlace2),
      palette: Boolean(colorType & constants2.COLORTYPE_PALETTE),
      color: Boolean(colorType & constants2.COLORTYPE_COLOR),
      alpha: Boolean(colorType & constants2.COLORTYPE_ALPHA),
      bpp,
      colorType
    });
    this._handleChunkEnd();
  };
  Parser.prototype._handlePLTE = function(length) {
    this.read(length, this._parsePLTE.bind(this));
  };
  Parser.prototype._parsePLTE = function(data) {
    this._crc.write(data);
    let entries = Math.floor(data.length / 3);
    for (let i = 0; i < entries; i++) {
      this._palette.push([data[i * 3], data[i * 3 + 1], data[i * 3 + 2], 255]);
    }
    this.palette(this._palette);
    this._handleChunkEnd();
  };
  Parser.prototype._handleTRNS = function(length) {
    this.simpleTransparency();
    this.read(length, this._parseTRNS.bind(this));
  };
  Parser.prototype._parseTRNS = function(data) {
    this._crc.write(data);
    if (this._colorType === constants2.COLORTYPE_PALETTE_COLOR) {
      if (this._palette.length === 0) {
        this.error(new Error("Transparency chunk must be after palette"));
        return;
      }
      if (data.length > this._palette.length) {
        this.error(new Error("More transparent colors than palette size"));
        return;
      }
      for (let i = 0; i < data.length; i++) {
        this._palette[i][3] = data[i];
      }
      this.palette(this._palette);
    }
    if (this._colorType === constants2.COLORTYPE_GRAYSCALE) {
      this.transColor([data.readUInt16BE(0)]);
    }
    if (this._colorType === constants2.COLORTYPE_COLOR) {
      this.transColor([
        data.readUInt16BE(0),
        data.readUInt16BE(2),
        data.readUInt16BE(4)
      ]);
    }
    this._handleChunkEnd();
  };
  Parser.prototype._handleGAMA = function(length) {
    this.read(length, this._parseGAMA.bind(this));
  };
  Parser.prototype._parseGAMA = function(data) {
    this._crc.write(data);
    this.gamma(data.readUInt32BE(0) / constants2.GAMMA_DIVISION);
    this._handleChunkEnd();
  };
  Parser.prototype._handleIDAT = function(length) {
    if (!this._emittedHeadersFinished) {
      this._emittedHeadersFinished = true;
      this.headersFinished();
    }
    this.read(-length, this._parseIDAT.bind(this, length));
  };
  Parser.prototype._parseIDAT = function(length, data) {
    this._crc.write(data);
    if (this._colorType === constants2.COLORTYPE_PALETTE_COLOR && this._palette.length === 0) {
      throw new Error("Expected palette not found");
    }
    this.inflateData(data);
    let leftOverLength = length - data.length;
    if (leftOverLength > 0) {
      this._handleIDAT(leftOverLength);
    } else {
      this._handleChunkEnd();
    }
  };
  Parser.prototype._handleIEND = function(length) {
    this.read(length, this._parseIEND.bind(this));
  };
  Parser.prototype._parseIEND = function(data) {
    this._crc.write(data);
    this._hasIEND = true;
    this._handleChunkEnd();
    if (this.finished) {
      this.finished();
    }
  };
  return parser.exports;
}
var bitmapper = {};
var hasRequiredBitmapper;
function requireBitmapper() {
  if (hasRequiredBitmapper) return bitmapper;
  hasRequiredBitmapper = 1;
  let interlaceUtils = requireInterlace();
  let pixelBppMapper = [
    // 0 - dummy entry
    function() {
    },
    // 1 - L
    // 0: 0, 1: 0, 2: 0, 3: 0xff
    function(pxData, data, pxPos, rawPos) {
      if (rawPos === data.length) {
        throw new Error("Ran out of data");
      }
      let pixel = data[rawPos];
      pxData[pxPos] = pixel;
      pxData[pxPos + 1] = pixel;
      pxData[pxPos + 2] = pixel;
      pxData[pxPos + 3] = 255;
    },
    // 2 - LA
    // 0: 0, 1: 0, 2: 0, 3: 1
    function(pxData, data, pxPos, rawPos) {
      if (rawPos + 1 >= data.length) {
        throw new Error("Ran out of data");
      }
      let pixel = data[rawPos];
      pxData[pxPos] = pixel;
      pxData[pxPos + 1] = pixel;
      pxData[pxPos + 2] = pixel;
      pxData[pxPos + 3] = data[rawPos + 1];
    },
    // 3 - RGB
    // 0: 0, 1: 1, 2: 2, 3: 0xff
    function(pxData, data, pxPos, rawPos) {
      if (rawPos + 2 >= data.length) {
        throw new Error("Ran out of data");
      }
      pxData[pxPos] = data[rawPos];
      pxData[pxPos + 1] = data[rawPos + 1];
      pxData[pxPos + 2] = data[rawPos + 2];
      pxData[pxPos + 3] = 255;
    },
    // 4 - RGBA
    // 0: 0, 1: 1, 2: 2, 3: 3
    function(pxData, data, pxPos, rawPos) {
      if (rawPos + 3 >= data.length) {
        throw new Error("Ran out of data");
      }
      pxData[pxPos] = data[rawPos];
      pxData[pxPos + 1] = data[rawPos + 1];
      pxData[pxPos + 2] = data[rawPos + 2];
      pxData[pxPos + 3] = data[rawPos + 3];
    }
  ];
  let pixelBppCustomMapper = [
    // 0 - dummy entry
    function() {
    },
    // 1 - L
    // 0: 0, 1: 0, 2: 0, 3: 0xff
    function(pxData, pixelData, pxPos, maxBit) {
      let pixel = pixelData[0];
      pxData[pxPos] = pixel;
      pxData[pxPos + 1] = pixel;
      pxData[pxPos + 2] = pixel;
      pxData[pxPos + 3] = maxBit;
    },
    // 2 - LA
    // 0: 0, 1: 0, 2: 0, 3: 1
    function(pxData, pixelData, pxPos) {
      let pixel = pixelData[0];
      pxData[pxPos] = pixel;
      pxData[pxPos + 1] = pixel;
      pxData[pxPos + 2] = pixel;
      pxData[pxPos + 3] = pixelData[1];
    },
    // 3 - RGB
    // 0: 0, 1: 1, 2: 2, 3: 0xff
    function(pxData, pixelData, pxPos, maxBit) {
      pxData[pxPos] = pixelData[0];
      pxData[pxPos + 1] = pixelData[1];
      pxData[pxPos + 2] = pixelData[2];
      pxData[pxPos + 3] = maxBit;
    },
    // 4 - RGBA
    // 0: 0, 1: 1, 2: 2, 3: 3
    function(pxData, pixelData, pxPos) {
      pxData[pxPos] = pixelData[0];
      pxData[pxPos + 1] = pixelData[1];
      pxData[pxPos + 2] = pixelData[2];
      pxData[pxPos + 3] = pixelData[3];
    }
  ];
  function bitRetriever(data, depth) {
    let leftOver = [];
    let i = 0;
    function split() {
      if (i === data.length) {
        throw new Error("Ran out of data");
      }
      let byte = data[i];
      i++;
      let byte8, byte7, byte6, byte5, byte4, byte3, byte2, byte1;
      switch (depth) {
        default:
          throw new Error("unrecognised depth");
        case 16:
          byte2 = data[i];
          i++;
          leftOver.push((byte << 8) + byte2);
          break;
        case 4:
          byte2 = byte & 15;
          byte1 = byte >> 4;
          leftOver.push(byte1, byte2);
          break;
        case 2:
          byte4 = byte & 3;
          byte3 = byte >> 2 & 3;
          byte2 = byte >> 4 & 3;
          byte1 = byte >> 6 & 3;
          leftOver.push(byte1, byte2, byte3, byte4);
          break;
        case 1:
          byte8 = byte & 1;
          byte7 = byte >> 1 & 1;
          byte6 = byte >> 2 & 1;
          byte5 = byte >> 3 & 1;
          byte4 = byte >> 4 & 1;
          byte3 = byte >> 5 & 1;
          byte2 = byte >> 6 & 1;
          byte1 = byte >> 7 & 1;
          leftOver.push(byte1, byte2, byte3, byte4, byte5, byte6, byte7, byte8);
          break;
      }
    }
    return {
      get: function(count) {
        while (leftOver.length < count) {
          split();
        }
        let returner = leftOver.slice(0, count);
        leftOver = leftOver.slice(count);
        return returner;
      },
      resetAfterLine: function() {
        leftOver.length = 0;
      },
      end: function() {
        if (i !== data.length) {
          throw new Error("extra data found");
        }
      }
    };
  }
  function mapImage8Bit(image, pxData, getPxPos, bpp, data, rawPos) {
    let imageWidth = image.width;
    let imageHeight = image.height;
    let imagePass = image.index;
    for (let y = 0; y < imageHeight; y++) {
      for (let x = 0; x < imageWidth; x++) {
        let pxPos = getPxPos(x, y, imagePass);
        pixelBppMapper[bpp](pxData, data, pxPos, rawPos);
        rawPos += bpp;
      }
    }
    return rawPos;
  }
  function mapImageCustomBit(image, pxData, getPxPos, bpp, bits, maxBit) {
    let imageWidth = image.width;
    let imageHeight = image.height;
    let imagePass = image.index;
    for (let y = 0; y < imageHeight; y++) {
      for (let x = 0; x < imageWidth; x++) {
        let pixelData = bits.get(bpp);
        let pxPos = getPxPos(x, y, imagePass);
        pixelBppCustomMapper[bpp](pxData, pixelData, pxPos, maxBit);
      }
      bits.resetAfterLine();
    }
  }
  bitmapper.dataToBitMap = function(data, bitmapInfo) {
    let width = bitmapInfo.width;
    let height = bitmapInfo.height;
    let depth = bitmapInfo.depth;
    let bpp = bitmapInfo.bpp;
    let interlace2 = bitmapInfo.interlace;
    let bits;
    if (depth !== 8) {
      bits = bitRetriever(data, depth);
    }
    let pxData;
    if (depth <= 8) {
      pxData = Buffer.alloc(width * height * 4);
    } else {
      pxData = new Uint16Array(width * height * 4);
    }
    let maxBit = Math.pow(2, depth) - 1;
    let rawPos = 0;
    let images;
    let getPxPos;
    if (interlace2) {
      images = interlaceUtils.getImagePasses(width, height);
      getPxPos = interlaceUtils.getInterlaceIterator(width, height);
    } else {
      let nonInterlacedPxPos = 0;
      getPxPos = function() {
        let returner = nonInterlacedPxPos;
        nonInterlacedPxPos += 4;
        return returner;
      };
      images = [{ width, height }];
    }
    for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
      if (depth === 8) {
        rawPos = mapImage8Bit(
          images[imageIndex],
          pxData,
          getPxPos,
          bpp,
          data,
          rawPos
        );
      } else {
        mapImageCustomBit(
          images[imageIndex],
          pxData,
          getPxPos,
          bpp,
          bits,
          maxBit
        );
      }
    }
    if (depth === 8) {
      if (rawPos !== data.length) {
        throw new Error("extra data found");
      }
    } else {
      bits.end();
    }
    return pxData;
  };
  return bitmapper;
}
var formatNormaliser;
var hasRequiredFormatNormaliser;
function requireFormatNormaliser() {
  if (hasRequiredFormatNormaliser) return formatNormaliser;
  hasRequiredFormatNormaliser = 1;
  function dePalette(indata, outdata, width, height, palette) {
    let pxPos = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let color = palette[indata[pxPos]];
        if (!color) {
          throw new Error("index " + indata[pxPos] + " not in palette");
        }
        for (let i = 0; i < 4; i++) {
          outdata[pxPos + i] = color[i];
        }
        pxPos += 4;
      }
    }
  }
  function replaceTransparentColor(indata, outdata, width, height, transColor) {
    let pxPos = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let makeTrans = false;
        if (transColor.length === 1) {
          if (transColor[0] === indata[pxPos]) {
            makeTrans = true;
          }
        } else if (transColor[0] === indata[pxPos] && transColor[1] === indata[pxPos + 1] && transColor[2] === indata[pxPos + 2]) {
          makeTrans = true;
        }
        if (makeTrans) {
          for (let i = 0; i < 4; i++) {
            outdata[pxPos + i] = 0;
          }
        }
        pxPos += 4;
      }
    }
  }
  function scaleDepth(indata, outdata, width, height, depth) {
    let maxOutSample = 255;
    let maxInSample = Math.pow(2, depth) - 1;
    let pxPos = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        for (let i = 0; i < 4; i++) {
          outdata[pxPos + i] = Math.floor(
            indata[pxPos + i] * maxOutSample / maxInSample + 0.5
          );
        }
        pxPos += 4;
      }
    }
  }
  formatNormaliser = function(indata, imageData) {
    let depth = imageData.depth;
    let width = imageData.width;
    let height = imageData.height;
    let colorType = imageData.colorType;
    let transColor = imageData.transColor;
    let palette = imageData.palette;
    let outdata = indata;
    if (colorType === 3) {
      dePalette(indata, outdata, width, height, palette);
    } else {
      if (transColor) {
        replaceTransparentColor(indata, outdata, width, height, transColor);
      }
      if (depth !== 8) {
        if (depth === 16) {
          outdata = Buffer.alloc(width * height * 4);
        }
        scaleDepth(indata, outdata, width, height, depth);
      }
    }
    return outdata;
  };
  return formatNormaliser;
}
var hasRequiredParserAsync;
function requireParserAsync() {
  if (hasRequiredParserAsync) return parserAsync.exports;
  hasRequiredParserAsync = 1;
  let util = require$$0;
  let zlib = require$$1$1;
  let ChunkStream = requireChunkstream();
  let FilterAsync = requireFilterParseAsync();
  let Parser = requireParser();
  let bitmapper2 = requireBitmapper();
  let formatNormaliser2 = requireFormatNormaliser();
  let ParserAsync = parserAsync.exports = function(options) {
    ChunkStream.call(this);
    this._parser = new Parser(options, {
      read: this.read.bind(this),
      error: this._handleError.bind(this),
      metadata: this._handleMetaData.bind(this),
      gamma: this.emit.bind(this, "gamma"),
      palette: this._handlePalette.bind(this),
      transColor: this._handleTransColor.bind(this),
      finished: this._finished.bind(this),
      inflateData: this._inflateData.bind(this),
      simpleTransparency: this._simpleTransparency.bind(this),
      headersFinished: this._headersFinished.bind(this)
    });
    this._options = options;
    this.writable = true;
    this._parser.start();
  };
  util.inherits(ParserAsync, ChunkStream);
  ParserAsync.prototype._handleError = function(err) {
    this.emit("error", err);
    this.writable = false;
    this.destroy();
    if (this._inflate && this._inflate.destroy) {
      this._inflate.destroy();
    }
    if (this._filter) {
      this._filter.destroy();
      this._filter.on("error", function() {
      });
    }
    this.errord = true;
  };
  ParserAsync.prototype._inflateData = function(data) {
    if (!this._inflate) {
      if (this._bitmapInfo.interlace) {
        this._inflate = zlib.createInflate();
        this._inflate.on("error", this.emit.bind(this, "error"));
        this._filter.on("complete", this._complete.bind(this));
        this._inflate.pipe(this._filter);
      } else {
        let rowSize = (this._bitmapInfo.width * this._bitmapInfo.bpp * this._bitmapInfo.depth + 7 >> 3) + 1;
        let imageSize = rowSize * this._bitmapInfo.height;
        let chunkSize = Math.max(imageSize, zlib.Z_MIN_CHUNK);
        this._inflate = zlib.createInflate({ chunkSize });
        let leftToInflate = imageSize;
        let emitError = this.emit.bind(this, "error");
        this._inflate.on("error", function(err) {
          if (!leftToInflate) {
            return;
          }
          emitError(err);
        });
        this._filter.on("complete", this._complete.bind(this));
        let filterWrite = this._filter.write.bind(this._filter);
        this._inflate.on("data", function(chunk) {
          if (!leftToInflate) {
            return;
          }
          if (chunk.length > leftToInflate) {
            chunk = chunk.slice(0, leftToInflate);
          }
          leftToInflate -= chunk.length;
          filterWrite(chunk);
        });
        this._inflate.on("end", this._filter.end.bind(this._filter));
      }
    }
    this._inflate.write(data);
  };
  ParserAsync.prototype._handleMetaData = function(metaData) {
    this._metaData = metaData;
    this._bitmapInfo = Object.create(metaData);
    this._filter = new FilterAsync(this._bitmapInfo);
  };
  ParserAsync.prototype._handleTransColor = function(transColor) {
    this._bitmapInfo.transColor = transColor;
  };
  ParserAsync.prototype._handlePalette = function(palette) {
    this._bitmapInfo.palette = palette;
  };
  ParserAsync.prototype._simpleTransparency = function() {
    this._metaData.alpha = true;
  };
  ParserAsync.prototype._headersFinished = function() {
    this.emit("metadata", this._metaData);
  };
  ParserAsync.prototype._finished = function() {
    if (this.errord) {
      return;
    }
    if (!this._inflate) {
      this.emit("error", "No Inflate block");
    } else {
      this._inflate.end();
    }
  };
  ParserAsync.prototype._complete = function(filteredData) {
    if (this.errord) {
      return;
    }
    let normalisedBitmapData;
    try {
      let bitmapData = bitmapper2.dataToBitMap(filteredData, this._bitmapInfo);
      normalisedBitmapData = formatNormaliser2(bitmapData, this._bitmapInfo);
      bitmapData = null;
    } catch (ex) {
      this._handleError(ex);
      return;
    }
    this.emit("parsed", normalisedBitmapData);
  };
  return parserAsync.exports;
}
var packerAsync = { exports: {} };
var packer = { exports: {} };
var bitpacker;
var hasRequiredBitpacker;
function requireBitpacker() {
  if (hasRequiredBitpacker) return bitpacker;
  hasRequiredBitpacker = 1;
  let constants2 = requireConstants();
  bitpacker = function(dataIn, width, height, options) {
    let outHasAlpha = [constants2.COLORTYPE_COLOR_ALPHA, constants2.COLORTYPE_ALPHA].indexOf(
      options.colorType
    ) !== -1;
    if (options.colorType === options.inputColorType) {
      let bigEndian = (function() {
        let buffer = new ArrayBuffer(2);
        new DataView(buffer).setInt16(
          0,
          256,
          true
          /* littleEndian */
        );
        return new Int16Array(buffer)[0] !== 256;
      })();
      if (options.bitDepth === 8 || options.bitDepth === 16 && bigEndian) {
        return dataIn;
      }
    }
    let data = options.bitDepth !== 16 ? dataIn : new Uint16Array(dataIn.buffer);
    let maxValue = 255;
    let inBpp = constants2.COLORTYPE_TO_BPP_MAP[options.inputColorType];
    if (inBpp === 4 && !options.inputHasAlpha) {
      inBpp = 3;
    }
    let outBpp = constants2.COLORTYPE_TO_BPP_MAP[options.colorType];
    if (options.bitDepth === 16) {
      maxValue = 65535;
      outBpp *= 2;
    }
    let outData = Buffer.alloc(width * height * outBpp);
    let inIndex = 0;
    let outIndex = 0;
    let bgColor = options.bgColor || {};
    if (bgColor.red === void 0) {
      bgColor.red = maxValue;
    }
    if (bgColor.green === void 0) {
      bgColor.green = maxValue;
    }
    if (bgColor.blue === void 0) {
      bgColor.blue = maxValue;
    }
    function getRGBA() {
      let red;
      let green;
      let blue;
      let alpha = maxValue;
      switch (options.inputColorType) {
        case constants2.COLORTYPE_COLOR_ALPHA:
          alpha = data[inIndex + 3];
          red = data[inIndex];
          green = data[inIndex + 1];
          blue = data[inIndex + 2];
          break;
        case constants2.COLORTYPE_COLOR:
          red = data[inIndex];
          green = data[inIndex + 1];
          blue = data[inIndex + 2];
          break;
        case constants2.COLORTYPE_ALPHA:
          alpha = data[inIndex + 1];
          red = data[inIndex];
          green = red;
          blue = red;
          break;
        case constants2.COLORTYPE_GRAYSCALE:
          red = data[inIndex];
          green = red;
          blue = red;
          break;
        default:
          throw new Error(
            "input color type:" + options.inputColorType + " is not supported at present"
          );
      }
      if (options.inputHasAlpha) {
        if (!outHasAlpha) {
          alpha /= maxValue;
          red = Math.min(
            Math.max(Math.round((1 - alpha) * bgColor.red + alpha * red), 0),
            maxValue
          );
          green = Math.min(
            Math.max(Math.round((1 - alpha) * bgColor.green + alpha * green), 0),
            maxValue
          );
          blue = Math.min(
            Math.max(Math.round((1 - alpha) * bgColor.blue + alpha * blue), 0),
            maxValue
          );
        }
      }
      return { red, green, blue, alpha };
    }
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let rgba = getRGBA();
        switch (options.colorType) {
          case constants2.COLORTYPE_COLOR_ALPHA:
          case constants2.COLORTYPE_COLOR:
            if (options.bitDepth === 8) {
              outData[outIndex] = rgba.red;
              outData[outIndex + 1] = rgba.green;
              outData[outIndex + 2] = rgba.blue;
              if (outHasAlpha) {
                outData[outIndex + 3] = rgba.alpha;
              }
            } else {
              outData.writeUInt16BE(rgba.red, outIndex);
              outData.writeUInt16BE(rgba.green, outIndex + 2);
              outData.writeUInt16BE(rgba.blue, outIndex + 4);
              if (outHasAlpha) {
                outData.writeUInt16BE(rgba.alpha, outIndex + 6);
              }
            }
            break;
          case constants2.COLORTYPE_ALPHA:
          case constants2.COLORTYPE_GRAYSCALE: {
            let grayscale = (rgba.red + rgba.green + rgba.blue) / 3;
            if (options.bitDepth === 8) {
              outData[outIndex] = grayscale;
              if (outHasAlpha) {
                outData[outIndex + 1] = rgba.alpha;
              }
            } else {
              outData.writeUInt16BE(grayscale, outIndex);
              if (outHasAlpha) {
                outData.writeUInt16BE(rgba.alpha, outIndex + 2);
              }
            }
            break;
          }
          default:
            throw new Error("unrecognised color Type " + options.colorType);
        }
        inIndex += inBpp;
        outIndex += outBpp;
      }
    }
    return outData;
  };
  return bitpacker;
}
var filterPack;
var hasRequiredFilterPack;
function requireFilterPack() {
  if (hasRequiredFilterPack) return filterPack;
  hasRequiredFilterPack = 1;
  let paethPredictor2 = requirePaethPredictor();
  function filterNone(pxData, pxPos, byteWidth, rawData, rawPos) {
    for (let x = 0; x < byteWidth; x++) {
      rawData[rawPos + x] = pxData[pxPos + x];
    }
  }
  function filterSumNone(pxData, pxPos, byteWidth) {
    let sum = 0;
    let length = pxPos + byteWidth;
    for (let i = pxPos; i < length; i++) {
      sum += Math.abs(pxData[i]);
    }
    return sum;
  }
  function filterSub(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
    for (let x = 0; x < byteWidth; x++) {
      let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
      let val = pxData[pxPos + x] - left;
      rawData[rawPos + x] = val;
    }
  }
  function filterSumSub(pxData, pxPos, byteWidth, bpp) {
    let sum = 0;
    for (let x = 0; x < byteWidth; x++) {
      let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
      let val = pxData[pxPos + x] - left;
      sum += Math.abs(val);
    }
    return sum;
  }
  function filterUp(pxData, pxPos, byteWidth, rawData, rawPos) {
    for (let x = 0; x < byteWidth; x++) {
      let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
      let val = pxData[pxPos + x] - up;
      rawData[rawPos + x] = val;
    }
  }
  function filterSumUp(pxData, pxPos, byteWidth) {
    let sum = 0;
    let length = pxPos + byteWidth;
    for (let x = pxPos; x < length; x++) {
      let up = pxPos > 0 ? pxData[x - byteWidth] : 0;
      let val = pxData[x] - up;
      sum += Math.abs(val);
    }
    return sum;
  }
  function filterAvg(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
    for (let x = 0; x < byteWidth; x++) {
      let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
      let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
      let val = pxData[pxPos + x] - (left + up >> 1);
      rawData[rawPos + x] = val;
    }
  }
  function filterSumAvg(pxData, pxPos, byteWidth, bpp) {
    let sum = 0;
    for (let x = 0; x < byteWidth; x++) {
      let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
      let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
      let val = pxData[pxPos + x] - (left + up >> 1);
      sum += Math.abs(val);
    }
    return sum;
  }
  function filterPaeth(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
    for (let x = 0; x < byteWidth; x++) {
      let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
      let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
      let upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
      let val = pxData[pxPos + x] - paethPredictor2(left, up, upleft);
      rawData[rawPos + x] = val;
    }
  }
  function filterSumPaeth(pxData, pxPos, byteWidth, bpp) {
    let sum = 0;
    for (let x = 0; x < byteWidth; x++) {
      let left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
      let up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
      let upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
      let val = pxData[pxPos + x] - paethPredictor2(left, up, upleft);
      sum += Math.abs(val);
    }
    return sum;
  }
  let filters = {
    0: filterNone,
    1: filterSub,
    2: filterUp,
    3: filterAvg,
    4: filterPaeth
  };
  let filterSums = {
    0: filterSumNone,
    1: filterSumSub,
    2: filterSumUp,
    3: filterSumAvg,
    4: filterSumPaeth
  };
  filterPack = function(pxData, width, height, options, bpp) {
    let filterTypes;
    if (!("filterType" in options) || options.filterType === -1) {
      filterTypes = [0, 1, 2, 3, 4];
    } else if (typeof options.filterType === "number") {
      filterTypes = [options.filterType];
    } else {
      throw new Error("unrecognised filter types");
    }
    if (options.bitDepth === 16) {
      bpp *= 2;
    }
    let byteWidth = width * bpp;
    let rawPos = 0;
    let pxPos = 0;
    let rawData = Buffer.alloc((byteWidth + 1) * height);
    let sel = filterTypes[0];
    for (let y = 0; y < height; y++) {
      if (filterTypes.length > 1) {
        let min = Infinity;
        for (let i = 0; i < filterTypes.length; i++) {
          let sum = filterSums[filterTypes[i]](pxData, pxPos, byteWidth, bpp);
          if (sum < min) {
            sel = filterTypes[i];
            min = sum;
          }
        }
      }
      rawData[rawPos] = sel;
      rawPos++;
      filters[sel](pxData, pxPos, byteWidth, rawData, rawPos, bpp);
      rawPos += byteWidth;
      pxPos += byteWidth;
    }
    return rawData;
  };
  return filterPack;
}
var hasRequiredPacker;
function requirePacker() {
  if (hasRequiredPacker) return packer.exports;
  hasRequiredPacker = 1;
  let constants2 = requireConstants();
  let CrcStream = requireCrc();
  let bitPacker = requireBitpacker();
  let filter = requireFilterPack();
  let zlib = require$$1$1;
  let Packer = packer.exports = function(options) {
    this._options = options;
    options.deflateChunkSize = options.deflateChunkSize || 32 * 1024;
    options.deflateLevel = options.deflateLevel != null ? options.deflateLevel : 9;
    options.deflateStrategy = options.deflateStrategy != null ? options.deflateStrategy : 3;
    options.inputHasAlpha = options.inputHasAlpha != null ? options.inputHasAlpha : true;
    options.deflateFactory = options.deflateFactory || zlib.createDeflate;
    options.bitDepth = options.bitDepth || 8;
    options.colorType = typeof options.colorType === "number" ? options.colorType : constants2.COLORTYPE_COLOR_ALPHA;
    options.inputColorType = typeof options.inputColorType === "number" ? options.inputColorType : constants2.COLORTYPE_COLOR_ALPHA;
    if ([
      constants2.COLORTYPE_GRAYSCALE,
      constants2.COLORTYPE_COLOR,
      constants2.COLORTYPE_COLOR_ALPHA,
      constants2.COLORTYPE_ALPHA
    ].indexOf(options.colorType) === -1) {
      throw new Error(
        "option color type:" + options.colorType + " is not supported at present"
      );
    }
    if ([
      constants2.COLORTYPE_GRAYSCALE,
      constants2.COLORTYPE_COLOR,
      constants2.COLORTYPE_COLOR_ALPHA,
      constants2.COLORTYPE_ALPHA
    ].indexOf(options.inputColorType) === -1) {
      throw new Error(
        "option input color type:" + options.inputColorType + " is not supported at present"
      );
    }
    if (options.bitDepth !== 8 && options.bitDepth !== 16) {
      throw new Error(
        "option bit depth:" + options.bitDepth + " is not supported at present"
      );
    }
  };
  Packer.prototype.getDeflateOptions = function() {
    return {
      chunkSize: this._options.deflateChunkSize,
      level: this._options.deflateLevel,
      strategy: this._options.deflateStrategy
    };
  };
  Packer.prototype.createDeflate = function() {
    return this._options.deflateFactory(this.getDeflateOptions());
  };
  Packer.prototype.filterData = function(data, width, height) {
    let packedData = bitPacker(data, width, height, this._options);
    let bpp = constants2.COLORTYPE_TO_BPP_MAP[this._options.colorType];
    let filteredData = filter(packedData, width, height, this._options, bpp);
    return filteredData;
  };
  Packer.prototype._packChunk = function(type, data) {
    let len = data ? data.length : 0;
    let buf = Buffer.alloc(len + 12);
    buf.writeUInt32BE(len, 0);
    buf.writeUInt32BE(type, 4);
    if (data) {
      data.copy(buf, 8);
    }
    buf.writeInt32BE(
      CrcStream.crc32(buf.slice(4, buf.length - 4)),
      buf.length - 4
    );
    return buf;
  };
  Packer.prototype.packGAMA = function(gamma) {
    let buf = Buffer.alloc(4);
    buf.writeUInt32BE(Math.floor(gamma * constants2.GAMMA_DIVISION), 0);
    return this._packChunk(constants2.TYPE_gAMA, buf);
  };
  Packer.prototype.packIHDR = function(width, height) {
    let buf = Buffer.alloc(13);
    buf.writeUInt32BE(width, 0);
    buf.writeUInt32BE(height, 4);
    buf[8] = this._options.bitDepth;
    buf[9] = this._options.colorType;
    buf[10] = 0;
    buf[11] = 0;
    buf[12] = 0;
    return this._packChunk(constants2.TYPE_IHDR, buf);
  };
  Packer.prototype.packIDAT = function(data) {
    return this._packChunk(constants2.TYPE_IDAT, data);
  };
  Packer.prototype.packIEND = function() {
    return this._packChunk(constants2.TYPE_IEND, null);
  };
  return packer.exports;
}
var hasRequiredPackerAsync;
function requirePackerAsync() {
  if (hasRequiredPackerAsync) return packerAsync.exports;
  hasRequiredPackerAsync = 1;
  let util = require$$0;
  let Stream = require$$1;
  let constants2 = requireConstants();
  let Packer = requirePacker();
  let PackerAsync = packerAsync.exports = function(opt) {
    Stream.call(this);
    let options = opt || {};
    this._packer = new Packer(options);
    this._deflate = this._packer.createDeflate();
    this.readable = true;
  };
  util.inherits(PackerAsync, Stream);
  PackerAsync.prototype.pack = function(data, width, height, gamma) {
    this.emit("data", Buffer.from(constants2.PNG_SIGNATURE));
    this.emit("data", this._packer.packIHDR(width, height));
    if (gamma) {
      this.emit("data", this._packer.packGAMA(gamma));
    }
    let filteredData = this._packer.filterData(data, width, height);
    this._deflate.on("error", this.emit.bind(this, "error"));
    this._deflate.on(
      "data",
      (function(compressedData) {
        this.emit("data", this._packer.packIDAT(compressedData));
      }).bind(this)
    );
    this._deflate.on(
      "end",
      (function() {
        this.emit("data", this._packer.packIEND());
        this.emit("end");
      }).bind(this)
    );
    this._deflate.end(filteredData);
  };
  return packerAsync.exports;
}
var pngSync = {};
var syncInflate = { exports: {} };
var hasRequiredSyncInflate;
function requireSyncInflate() {
  if (hasRequiredSyncInflate) return syncInflate.exports;
  hasRequiredSyncInflate = 1;
  (function(module, exports) {
    let assert = require$$0$1.ok;
    let zlib = require$$1$1;
    let util = require$$0;
    let kMaxLength = require$$3.kMaxLength;
    function Inflate(opts) {
      if (!(this instanceof Inflate)) {
        return new Inflate(opts);
      }
      if (opts && opts.chunkSize < zlib.Z_MIN_CHUNK) {
        opts.chunkSize = zlib.Z_MIN_CHUNK;
      }
      zlib.Inflate.call(this, opts);
      this._offset = this._offset === void 0 ? this._outOffset : this._offset;
      this._buffer = this._buffer || this._outBuffer;
      if (opts && opts.maxLength != null) {
        this._maxLength = opts.maxLength;
      }
    }
    function createInflate(opts) {
      return new Inflate(opts);
    }
    function _close(engine, callback) {
      if (!engine._handle) {
        return;
      }
      engine._handle.close();
      engine._handle = null;
    }
    Inflate.prototype._processChunk = function(chunk, flushFlag, asyncCb) {
      if (typeof asyncCb === "function") {
        return zlib.Inflate._processChunk.call(this, chunk, flushFlag, asyncCb);
      }
      let self = this;
      let availInBefore = chunk && chunk.length;
      let availOutBefore = this._chunkSize - this._offset;
      let leftToInflate = this._maxLength;
      let inOff = 0;
      let buffers = [];
      let nread = 0;
      let error;
      this.on("error", function(err) {
        error = err;
      });
      function handleChunk(availInAfter, availOutAfter) {
        if (self._hadError) {
          return;
        }
        let have = availOutBefore - availOutAfter;
        assert(have >= 0, "have should not go down");
        if (have > 0) {
          let out = self._buffer.slice(self._offset, self._offset + have);
          self._offset += have;
          if (out.length > leftToInflate) {
            out = out.slice(0, leftToInflate);
          }
          buffers.push(out);
          nread += out.length;
          leftToInflate -= out.length;
          if (leftToInflate === 0) {
            return false;
          }
        }
        if (availOutAfter === 0 || self._offset >= self._chunkSize) {
          availOutBefore = self._chunkSize;
          self._offset = 0;
          self._buffer = Buffer.allocUnsafe(self._chunkSize);
        }
        if (availOutAfter === 0) {
          inOff += availInBefore - availInAfter;
          availInBefore = availInAfter;
          return true;
        }
        return false;
      }
      assert(this._handle, "zlib binding closed");
      let res;
      do {
        res = this._handle.writeSync(
          flushFlag,
          chunk,
          // in
          inOff,
          // in_off
          availInBefore,
          // in_len
          this._buffer,
          // out
          this._offset,
          //out_off
          availOutBefore
        );
        res = res || this._writeState;
      } while (!this._hadError && handleChunk(res[0], res[1]));
      if (this._hadError) {
        throw error;
      }
      if (nread >= kMaxLength) {
        _close(this);
        throw new RangeError(
          "Cannot create final Buffer. It would be larger than 0x" + kMaxLength.toString(16) + " bytes"
        );
      }
      let buf = Buffer.concat(buffers, nread);
      _close(this);
      return buf;
    };
    util.inherits(Inflate, zlib.Inflate);
    function zlibBufferSync(engine, buffer) {
      if (typeof buffer === "string") {
        buffer = Buffer.from(buffer);
      }
      if (!(buffer instanceof Buffer)) {
        throw new TypeError("Not a string or buffer");
      }
      let flushFlag = engine._finishFlushFlag;
      if (flushFlag == null) {
        flushFlag = zlib.Z_FINISH;
      }
      return engine._processChunk(buffer, flushFlag);
    }
    function inflateSync(buffer, opts) {
      return zlibBufferSync(new Inflate(opts), buffer);
    }
    module.exports = exports = inflateSync;
    exports.Inflate = Inflate;
    exports.createInflate = createInflate;
    exports.inflateSync = inflateSync;
  })(syncInflate, syncInflate.exports);
  return syncInflate.exports;
}
var syncReader = { exports: {} };
var hasRequiredSyncReader;
function requireSyncReader() {
  if (hasRequiredSyncReader) return syncReader.exports;
  hasRequiredSyncReader = 1;
  let SyncReader = syncReader.exports = function(buffer) {
    this._buffer = buffer;
    this._reads = [];
  };
  SyncReader.prototype.read = function(length, callback) {
    this._reads.push({
      length: Math.abs(length),
      // if length < 0 then at most this length
      allowLess: length < 0,
      func: callback
    });
  };
  SyncReader.prototype.process = function() {
    while (this._reads.length > 0 && this._buffer.length) {
      let read = this._reads[0];
      if (this._buffer.length && (this._buffer.length >= read.length || read.allowLess)) {
        this._reads.shift();
        let buf = this._buffer;
        this._buffer = buf.slice(read.length);
        read.func.call(this, buf.slice(0, read.length));
      } else {
        break;
      }
    }
    if (this._reads.length > 0) {
      return new Error("There are some read requests waitng on finished stream");
    }
    if (this._buffer.length > 0) {
      return new Error("unrecognised content at end of stream");
    }
  };
  return syncReader.exports;
}
var filterParseSync = {};
var hasRequiredFilterParseSync;
function requireFilterParseSync() {
  if (hasRequiredFilterParseSync) return filterParseSync;
  hasRequiredFilterParseSync = 1;
  let SyncReader = requireSyncReader();
  let Filter = requireFilterParse();
  filterParseSync.process = function(inBuffer, bitmapInfo) {
    let outBuffers = [];
    let reader = new SyncReader(inBuffer);
    let filter = new Filter(bitmapInfo, {
      read: reader.read.bind(reader),
      write: function(bufferPart) {
        outBuffers.push(bufferPart);
      },
      complete: function() {
      }
    });
    filter.start();
    reader.process();
    return Buffer.concat(outBuffers);
  };
  return filterParseSync;
}
var parserSync;
var hasRequiredParserSync;
function requireParserSync() {
  if (hasRequiredParserSync) return parserSync;
  hasRequiredParserSync = 1;
  let hasSyncZlib = true;
  let zlib = require$$1$1;
  let inflateSync = requireSyncInflate();
  if (!zlib.deflateSync) {
    hasSyncZlib = false;
  }
  let SyncReader = requireSyncReader();
  let FilterSync = requireFilterParseSync();
  let Parser = requireParser();
  let bitmapper2 = requireBitmapper();
  let formatNormaliser2 = requireFormatNormaliser();
  parserSync = function(buffer, options) {
    if (!hasSyncZlib) {
      throw new Error(
        "To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0"
      );
    }
    let err;
    function handleError(_err_) {
      err = _err_;
    }
    let metaData;
    function handleMetaData(_metaData_) {
      metaData = _metaData_;
    }
    function handleTransColor(transColor) {
      metaData.transColor = transColor;
    }
    function handlePalette(palette) {
      metaData.palette = palette;
    }
    function handleSimpleTransparency() {
      metaData.alpha = true;
    }
    let gamma;
    function handleGamma(_gamma_) {
      gamma = _gamma_;
    }
    let inflateDataList = [];
    function handleInflateData(inflatedData2) {
      inflateDataList.push(inflatedData2);
    }
    let reader = new SyncReader(buffer);
    let parser2 = new Parser(options, {
      read: reader.read.bind(reader),
      error: handleError,
      metadata: handleMetaData,
      gamma: handleGamma,
      palette: handlePalette,
      transColor: handleTransColor,
      inflateData: handleInflateData,
      simpleTransparency: handleSimpleTransparency
    });
    parser2.start();
    reader.process();
    if (err) {
      throw err;
    }
    let inflateData = Buffer.concat(inflateDataList);
    inflateDataList.length = 0;
    let inflatedData;
    if (metaData.interlace) {
      inflatedData = zlib.inflateSync(inflateData);
    } else {
      let rowSize = (metaData.width * metaData.bpp * metaData.depth + 7 >> 3) + 1;
      let imageSize = rowSize * metaData.height;
      inflatedData = inflateSync(inflateData, {
        chunkSize: imageSize,
        maxLength: imageSize
      });
    }
    inflateData = null;
    if (!inflatedData || !inflatedData.length) {
      throw new Error("bad png - invalid inflate data response");
    }
    let unfilteredData = FilterSync.process(inflatedData, metaData);
    inflateData = null;
    let bitmapData = bitmapper2.dataToBitMap(unfilteredData, metaData);
    unfilteredData = null;
    let normalisedBitmapData = formatNormaliser2(bitmapData, metaData);
    metaData.data = normalisedBitmapData;
    metaData.gamma = gamma || 0;
    return metaData;
  };
  return parserSync;
}
var packerSync;
var hasRequiredPackerSync;
function requirePackerSync() {
  if (hasRequiredPackerSync) return packerSync;
  hasRequiredPackerSync = 1;
  let hasSyncZlib = true;
  let zlib = require$$1$1;
  if (!zlib.deflateSync) {
    hasSyncZlib = false;
  }
  let constants2 = requireConstants();
  let Packer = requirePacker();
  packerSync = function(metaData, opt) {
    if (!hasSyncZlib) {
      throw new Error(
        "To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0"
      );
    }
    let options = opt || {};
    let packer2 = new Packer(options);
    let chunks = [];
    chunks.push(Buffer.from(constants2.PNG_SIGNATURE));
    chunks.push(packer2.packIHDR(metaData.width, metaData.height));
    if (metaData.gamma) {
      chunks.push(packer2.packGAMA(metaData.gamma));
    }
    let filteredData = packer2.filterData(
      metaData.data,
      metaData.width,
      metaData.height
    );
    let compressedData = zlib.deflateSync(
      filteredData,
      packer2.getDeflateOptions()
    );
    filteredData = null;
    if (!compressedData || !compressedData.length) {
      throw new Error("bad png - invalid compressed data response");
    }
    chunks.push(packer2.packIDAT(compressedData));
    chunks.push(packer2.packIEND());
    return Buffer.concat(chunks);
  };
  return packerSync;
}
var hasRequiredPngSync;
function requirePngSync() {
  if (hasRequiredPngSync) return pngSync;
  hasRequiredPngSync = 1;
  let parse = requireParserSync();
  let pack = requirePackerSync();
  pngSync.read = function(buffer, options) {
    return parse(buffer, options || {});
  };
  pngSync.write = function(png2, options) {
    return pack(png2, options);
  };
  return pngSync;
}
var hasRequiredPng;
function requirePng() {
  if (hasRequiredPng) return png;
  hasRequiredPng = 1;
  let util = require$$0;
  let Stream = require$$1;
  let Parser = requireParserAsync();
  let Packer = requirePackerAsync();
  let PNGSync = requirePngSync();
  let PNG = png.PNG = function(options) {
    Stream.call(this);
    options = options || {};
    this.width = options.width | 0;
    this.height = options.height | 0;
    this.data = this.width > 0 && this.height > 0 ? Buffer.alloc(4 * this.width * this.height) : null;
    if (options.fill && this.data) {
      this.data.fill(0);
    }
    this.gamma = 0;
    this.readable = this.writable = true;
    this._parser = new Parser(options);
    this._parser.on("error", this.emit.bind(this, "error"));
    this._parser.on("close", this._handleClose.bind(this));
    this._parser.on("metadata", this._metadata.bind(this));
    this._parser.on("gamma", this._gamma.bind(this));
    this._parser.on(
      "parsed",
      (function(data) {
        this.data = data;
        this.emit("parsed", data);
      }).bind(this)
    );
    this._packer = new Packer(options);
    this._packer.on("data", this.emit.bind(this, "data"));
    this._packer.on("end", this.emit.bind(this, "end"));
    this._parser.on("close", this._handleClose.bind(this));
    this._packer.on("error", this.emit.bind(this, "error"));
  };
  util.inherits(PNG, Stream);
  PNG.sync = PNGSync;
  PNG.prototype.pack = function() {
    if (!this.data || !this.data.length) {
      this.emit("error", "No data provided");
      return this;
    }
    process.nextTick(
      (function() {
        this._packer.pack(this.data, this.width, this.height, this.gamma);
      }).bind(this)
    );
    return this;
  };
  PNG.prototype.parse = function(data, callback) {
    if (callback) {
      let onParsed, onError;
      onParsed = (function(parsedData) {
        this.removeListener("error", onError);
        this.data = parsedData;
        callback(null, this);
      }).bind(this);
      onError = (function(err) {
        this.removeListener("parsed", onParsed);
        callback(err, null);
      }).bind(this);
      this.once("parsed", onParsed);
      this.once("error", onError);
    }
    this.end(data);
    return this;
  };
  PNG.prototype.write = function(data) {
    this._parser.write(data);
    return true;
  };
  PNG.prototype.end = function(data) {
    this._parser.end(data);
  };
  PNG.prototype._metadata = function(metadata) {
    this.width = metadata.width;
    this.height = metadata.height;
    this.emit("metadata", metadata);
  };
  PNG.prototype._gamma = function(gamma) {
    this.gamma = gamma;
  };
  PNG.prototype._handleClose = function() {
    if (!this._parser.writable && !this._packer.readable) {
      this.emit("close");
    }
  };
  PNG.bitblt = function(src, dst, srcX, srcY, width, height, deltaX, deltaY) {
    srcX |= 0;
    srcY |= 0;
    width |= 0;
    height |= 0;
    deltaX |= 0;
    deltaY |= 0;
    if (srcX > src.width || srcY > src.height || srcX + width > src.width || srcY + height > src.height) {
      throw new Error("bitblt reading outside image");
    }
    if (deltaX > dst.width || deltaY > dst.height || deltaX + width > dst.width || deltaY + height > dst.height) {
      throw new Error("bitblt writing outside image");
    }
    for (let y = 0; y < height; y++) {
      src.data.copy(
        dst.data,
        (deltaY + y) * dst.width + deltaX << 2,
        (srcY + y) * src.width + srcX << 2,
        (srcY + y) * src.width + srcX + width << 2
      );
    }
  };
  PNG.prototype.bitblt = function(dst, srcX, srcY, width, height, deltaX, deltaY) {
    PNG.bitblt(this, dst, srcX, srcY, width, height, deltaX, deltaY);
    return this;
  };
  PNG.adjustGamma = function(src) {
    if (src.gamma) {
      for (let y = 0; y < src.height; y++) {
        for (let x = 0; x < src.width; x++) {
          let idx = src.width * y + x << 2;
          for (let i = 0; i < 3; i++) {
            let sample = src.data[idx + i] / 255;
            sample = Math.pow(sample, 1 / 2.2 / src.gamma);
            src.data[idx + i] = Math.round(sample * 255);
          }
        }
      }
      src.gamma = 0;
    }
  };
  PNG.prototype.adjustGamma = function() {
    PNG.adjustGamma(this);
  };
  return png;
}
export {
  requirePng as r
};

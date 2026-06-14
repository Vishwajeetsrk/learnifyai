const tab = 9;
const space = 32;
function trimLines(value) {
  const source = String(value);
  const search = /\r?\n|\r/g;
  let match = search.exec(source);
  let last = 0;
  const lines = [];
  while (match) {
    lines.push(
      trimLine(source.slice(last, match.index), last > 0, true),
      match[0]
    );
    last = match.index + match[0].length;
    match = search.exec(source);
  }
  lines.push(trimLine(source.slice(last), last > 0, false));
  return lines.join("");
}
function trimLine(value, start, end) {
  let startIndex = 0;
  let endIndex = value.length;
  if (start) {
    let code = value.codePointAt(startIndex);
    while (code === tab || code === space) {
      startIndex++;
      code = value.codePointAt(startIndex);
    }
  }
  if (end) {
    let code = value.codePointAt(endIndex - 1);
    while (code === tab || code === space) {
      endIndex--;
      code = value.codePointAt(endIndex - 1);
    }
  }
  return endIndex > startIndex ? value.slice(startIndex, endIndex) : "";
}
export {
  trimLines as t
};

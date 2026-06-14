var SVGPathData$1 = { exports: {} };
var SVGPathData = SVGPathData$1.exports;
var hasRequiredSVGPathData;
function requireSVGPathData() {
  if (hasRequiredSVGPathData) return SVGPathData$1.exports;
  hasRequiredSVGPathData = 1;
  (function(module, exports) {
    !(function(t, r) {
      r(exports);
    })(SVGPathData, (function(t) {
      var r = function(t2, e2) {
        return (r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t3, r2) {
          t3.__proto__ = r2;
        } || function(t3, r2) {
          for (var e3 in r2) Object.prototype.hasOwnProperty.call(r2, e3) && (t3[e3] = r2[e3]);
        })(t2, e2);
      };
      function e(t2, e2) {
        if ("function" != typeof e2 && null !== e2) throw new TypeError("Class extends value " + String(e2) + " is not a constructor or null");
        function a2() {
          this.constructor = t2;
        }
        r(t2, e2), t2.prototype = null === e2 ? Object.create(e2) : (a2.prototype = e2.prototype, new a2());
      }
      var a = " ";
      function i(t2) {
        var r2 = "";
        Array.isArray(t2) || (t2 = [t2]);
        for (var e2 = 0; e2 < t2.length; e2++) {
          var i2 = t2[e2];
          if (i2.type === N.CLOSE_PATH) r2 += "z";
          else if (i2.type === N.HORIZ_LINE_TO) r2 += (i2.relative ? "h" : "H") + i2.x;
          else if (i2.type === N.VERT_LINE_TO) r2 += (i2.relative ? "v" : "V") + i2.y;
          else if (i2.type === N.MOVE_TO) r2 += (i2.relative ? "m" : "M") + i2.x + a + i2.y;
          else if (i2.type === N.LINE_TO) r2 += (i2.relative ? "l" : "L") + i2.x + a + i2.y;
          else if (i2.type === N.CURVE_TO) r2 += (i2.relative ? "c" : "C") + i2.x1 + a + i2.y1 + a + i2.x2 + a + i2.y2 + a + i2.x + a + i2.y;
          else if (i2.type === N.SMOOTH_CURVE_TO) r2 += (i2.relative ? "s" : "S") + i2.x2 + a + i2.y2 + a + i2.x + a + i2.y;
          else if (i2.type === N.QUAD_TO) r2 += (i2.relative ? "q" : "Q") + i2.x1 + a + i2.y1 + a + i2.x + a + i2.y;
          else if (i2.type === N.SMOOTH_QUAD_TO) r2 += (i2.relative ? "t" : "T") + i2.x + a + i2.y;
          else {
            if (i2.type !== N.ARC) throw new Error('Unexpected command type "' + i2.type + '" at index ' + e2 + ".");
            r2 += (i2.relative ? "a" : "A") + i2.rX + a + i2.rY + a + i2.xRot + a + +i2.lArcFlag + a + +i2.sweepFlag + a + i2.x + a + i2.y;
          }
        }
        return r2;
      }
      function n(t2, r2) {
        var e2 = t2[0], a2 = t2[1];
        return [e2 * Math.cos(r2) - a2 * Math.sin(r2), e2 * Math.sin(r2) + a2 * Math.cos(r2)];
      }
      function o() {
        for (var t2 = [], r2 = 0; r2 < arguments.length; r2++) t2[r2] = arguments[r2];
        for (var e2 = 0; e2 < t2.length; e2++) if ("number" != typeof t2[e2]) throw new Error("assertNumbers arguments[" + e2 + "] is not a number. " + typeof t2[e2] + " == typeof " + t2[e2]);
        return true;
      }
      var s = Math.PI;
      function u(t2, r2, e2) {
        t2.lArcFlag = 0 === t2.lArcFlag ? 0 : 1, t2.sweepFlag = 0 === t2.sweepFlag ? 0 : 1;
        var a2 = t2.rX, i2 = t2.rY, o2 = t2.x, u2 = t2.y;
        a2 = Math.abs(t2.rX), i2 = Math.abs(t2.rY);
        var h2 = n([(r2 - o2) / 2, (e2 - u2) / 2], -t2.xRot / 180 * s), c2 = h2[0], m2 = h2[1], y2 = Math.pow(c2, 2) / Math.pow(a2, 2) + Math.pow(m2, 2) / Math.pow(i2, 2);
        1 < y2 && (a2 *= Math.sqrt(y2), i2 *= Math.sqrt(y2)), t2.rX = a2, t2.rY = i2;
        var p2 = Math.pow(a2, 2) * Math.pow(m2, 2) + Math.pow(i2, 2) * Math.pow(c2, 2), f2 = (t2.lArcFlag !== t2.sweepFlag ? 1 : -1) * Math.sqrt(Math.max(0, (Math.pow(a2, 2) * Math.pow(i2, 2) - p2) / p2)), T2 = a2 * m2 / i2 * f2, O2 = -i2 * c2 / a2 * f2, l2 = n([T2, O2], t2.xRot / 180 * s);
        t2.cX = l2[0] + (r2 + o2) / 2, t2.cY = l2[1] + (e2 + u2) / 2, t2.phi1 = Math.atan2((m2 - O2) / i2, (c2 - T2) / a2), t2.phi2 = Math.atan2((-m2 - O2) / i2, (-c2 - T2) / a2), 0 === t2.sweepFlag && t2.phi2 > t2.phi1 && (t2.phi2 -= 2 * s), 1 === t2.sweepFlag && t2.phi2 < t2.phi1 && (t2.phi2 += 2 * s), t2.phi1 *= 180 / s, t2.phi2 *= 180 / s;
      }
      function h(t2, r2, e2) {
        o(t2, r2, e2);
        var a2 = t2 * t2 + r2 * r2 - e2 * e2;
        if (0 > a2) return [];
        if (0 === a2) return [[t2 * e2 / (t2 * t2 + r2 * r2), r2 * e2 / (t2 * t2 + r2 * r2)]];
        var i2 = Math.sqrt(a2);
        return [[(t2 * e2 + r2 * i2) / (t2 * t2 + r2 * r2), (r2 * e2 - t2 * i2) / (t2 * t2 + r2 * r2)], [(t2 * e2 - r2 * i2) / (t2 * t2 + r2 * r2), (r2 * e2 + t2 * i2) / (t2 * t2 + r2 * r2)]];
      }
      var c = Math.PI / 180;
      function m(t2, r2, e2) {
        return (1 - e2) * t2 + e2 * r2;
      }
      function y(t2, r2, e2, a2) {
        return t2 + Math.cos(a2 / 180 * s) * r2 + Math.sin(a2 / 180 * s) * e2;
      }
      function p(t2, r2, e2, a2) {
        var i2 = 1e-6, n2 = r2 - t2, o2 = e2 - r2, s2 = 3 * n2 + 3 * (a2 - e2) - 6 * o2, u2 = 6 * (o2 - n2), h2 = 3 * n2;
        return Math.abs(s2) < i2 ? [-h2 / u2] : (function(t3, r3, e3) {
          var a3 = t3 * t3 / 4 - r3;
          if (a3 < -e3) return [];
          if (a3 <= e3) return [-t3 / 2];
          var i3 = Math.sqrt(a3);
          return [-t3 / 2 - i3, -t3 / 2 + i3];
        })(u2 / s2, h2 / s2, i2);
      }
      function f(t2, r2, e2, a2, i2) {
        var n2 = 1 - i2;
        return t2 * (n2 * n2 * n2) + r2 * (3 * n2 * n2 * i2) + e2 * (3 * n2 * i2 * i2) + a2 * (i2 * i2 * i2);
      }
      t.SVGPathDataTransformer = void 0, (function(t2) {
        function r2() {
          return i2((function(t3, r3, e3) {
            return t3.relative && (void 0 !== t3.x1 && (t3.x1 += r3), void 0 !== t3.y1 && (t3.y1 += e3), void 0 !== t3.x2 && (t3.x2 += r3), void 0 !== t3.y2 && (t3.y2 += e3), void 0 !== t3.x && (t3.x += r3), void 0 !== t3.y && (t3.y += e3), t3.relative = false), t3;
          }));
        }
        function e2() {
          var t3 = NaN, r3 = NaN, e3 = NaN, a3 = NaN;
          return i2((function(i3, n2, o2) {
            return i3.type & N.SMOOTH_CURVE_TO && (i3.type = N.CURVE_TO, t3 = isNaN(t3) ? n2 : t3, r3 = isNaN(r3) ? o2 : r3, i3.x1 = i3.relative ? n2 - t3 : 2 * n2 - t3, i3.y1 = i3.relative ? o2 - r3 : 2 * o2 - r3), i3.type & N.CURVE_TO ? (t3 = i3.relative ? n2 + i3.x2 : i3.x2, r3 = i3.relative ? o2 + i3.y2 : i3.y2) : (t3 = NaN, r3 = NaN), i3.type & N.SMOOTH_QUAD_TO && (i3.type = N.QUAD_TO, e3 = isNaN(e3) ? n2 : e3, a3 = isNaN(a3) ? o2 : a3, i3.x1 = i3.relative ? n2 - e3 : 2 * n2 - e3, i3.y1 = i3.relative ? o2 - a3 : 2 * o2 - a3), i3.type & N.QUAD_TO ? (e3 = i3.relative ? n2 + i3.x1 : i3.x1, a3 = i3.relative ? o2 + i3.y1 : i3.y1) : (e3 = NaN, a3 = NaN), i3;
          }));
        }
        function a2() {
          var t3 = NaN, r3 = NaN;
          return i2((function(e3, a3, i3) {
            if (e3.type & N.SMOOTH_QUAD_TO && (e3.type = N.QUAD_TO, t3 = isNaN(t3) ? a3 : t3, r3 = isNaN(r3) ? i3 : r3, e3.x1 = e3.relative ? a3 - t3 : 2 * a3 - t3, e3.y1 = e3.relative ? i3 - r3 : 2 * i3 - r3), e3.type & N.QUAD_TO) {
              t3 = e3.relative ? a3 + e3.x1 : e3.x1, r3 = e3.relative ? i3 + e3.y1 : e3.y1;
              var n2 = e3.x1, o2 = e3.y1;
              e3.type = N.CURVE_TO, e3.x1 = ((e3.relative ? 0 : a3) + 2 * n2) / 3, e3.y1 = ((e3.relative ? 0 : i3) + 2 * o2) / 3, e3.x2 = (e3.x + 2 * n2) / 3, e3.y2 = (e3.y + 2 * o2) / 3;
            } else t3 = NaN, r3 = NaN;
            return e3;
          }));
        }
        function i2(t3) {
          var r3 = 0, e3 = 0, a3 = NaN, i3 = NaN;
          return function(n2) {
            if (isNaN(a3) && !(n2.type & N.MOVE_TO)) throw new Error("path must start with moveto");
            var o2 = t3(n2, r3, e3, a3, i3);
            return n2.type & N.CLOSE_PATH && (r3 = a3, e3 = i3), void 0 !== n2.x && (r3 = n2.relative ? r3 + n2.x : n2.x), void 0 !== n2.y && (e3 = n2.relative ? e3 + n2.y : n2.y), n2.type & N.MOVE_TO && (a3 = r3, i3 = e3), o2;
          };
        }
        function s2(t3, r3, e3, a3, n2, s3) {
          return o(t3, r3, e3, a3, n2, s3), i2((function(i3, o2, u2, h2) {
            var c2 = i3.x1, m2 = i3.x2, y2 = i3.relative && !isNaN(h2), p2 = void 0 !== i3.x ? i3.x : y2 ? 0 : o2, f2 = void 0 !== i3.y ? i3.y : y2 ? 0 : u2;
            function T3(t4) {
              return t4 * t4;
            }
            i3.type & N.HORIZ_LINE_TO && 0 !== r3 && (i3.type = N.LINE_TO, i3.y = i3.relative ? 0 : u2), i3.type & N.VERT_LINE_TO && 0 !== e3 && (i3.type = N.LINE_TO, i3.x = i3.relative ? 0 : o2), void 0 !== i3.x && (i3.x = i3.x * t3 + f2 * e3 + (y2 ? 0 : n2)), void 0 !== i3.y && (i3.y = p2 * r3 + i3.y * a3 + (y2 ? 0 : s3)), void 0 !== i3.x1 && (i3.x1 = i3.x1 * t3 + i3.y1 * e3 + (y2 ? 0 : n2)), void 0 !== i3.y1 && (i3.y1 = c2 * r3 + i3.y1 * a3 + (y2 ? 0 : s3)), void 0 !== i3.x2 && (i3.x2 = i3.x2 * t3 + i3.y2 * e3 + (y2 ? 0 : n2)), void 0 !== i3.y2 && (i3.y2 = m2 * r3 + i3.y2 * a3 + (y2 ? 0 : s3));
            var O2 = t3 * a3 - r3 * e3;
            if (void 0 !== i3.xRot && (1 !== t3 || 0 !== r3 || 0 !== e3 || 1 !== a3)) if (0 === O2) delete i3.rX, delete i3.rY, delete i3.xRot, delete i3.lArcFlag, delete i3.sweepFlag, i3.type = N.LINE_TO;
            else {
              var l2 = i3.xRot * Math.PI / 180, v2 = Math.sin(l2), _2 = Math.cos(l2), d2 = 1 / T3(i3.rX), x = 1 / T3(i3.rY), A = T3(_2) * d2 + T3(v2) * x, E = 2 * v2 * _2 * (d2 - x), C = T3(v2) * d2 + T3(_2) * x, M = A * a3 * a3 - E * r3 * a3 + C * r3 * r3, R = E * (t3 * a3 + r3 * e3) - 2 * (A * e3 * a3 + C * t3 * r3), S = A * e3 * e3 - E * t3 * e3 + C * t3 * t3, g = (Math.atan2(R, M - S) + Math.PI) % Math.PI / 2, I = Math.sin(g), V = Math.cos(g);
              i3.rX = Math.abs(O2) / Math.sqrt(M * T3(V) + R * I * V + S * T3(I)), i3.rY = Math.abs(O2) / Math.sqrt(M * T3(I) - R * I * V + S * T3(V)), i3.xRot = 180 * g / Math.PI;
            }
            return void 0 !== i3.sweepFlag && 0 > O2 && (i3.sweepFlag = +!i3.sweepFlag), i3;
          }));
        }
        function T2() {
          return function(t3) {
            var r3 = {};
            for (var e3 in t3) r3[e3] = t3[e3];
            return r3;
          };
        }
        t2.ROUND = function(t3) {
          function r3(r4) {
            return Math.round(r4 * t3) / t3;
          }
          return void 0 === t3 && (t3 = 1e13), o(t3), function(t4) {
            return void 0 !== t4.x1 && (t4.x1 = r3(t4.x1)), void 0 !== t4.y1 && (t4.y1 = r3(t4.y1)), void 0 !== t4.x2 && (t4.x2 = r3(t4.x2)), void 0 !== t4.y2 && (t4.y2 = r3(t4.y2)), void 0 !== t4.x && (t4.x = r3(t4.x)), void 0 !== t4.y && (t4.y = r3(t4.y)), void 0 !== t4.rX && (t4.rX = r3(t4.rX)), void 0 !== t4.rY && (t4.rY = r3(t4.rY)), t4;
          };
        }, t2.TO_ABS = r2, t2.TO_REL = function() {
          return i2((function(t3, r3, e3) {
            return t3.relative || (void 0 !== t3.x1 && (t3.x1 -= r3), void 0 !== t3.y1 && (t3.y1 -= e3), void 0 !== t3.x2 && (t3.x2 -= r3), void 0 !== t3.y2 && (t3.y2 -= e3), void 0 !== t3.x && (t3.x -= r3), void 0 !== t3.y && (t3.y -= e3), t3.relative = true), t3;
          }));
        }, t2.NORMALIZE_HVZ = function(t3, r3, e3) {
          return void 0 === t3 && (t3 = true), void 0 === r3 && (r3 = true), void 0 === e3 && (e3 = true), i2((function(a3, i3, n2, o2, s3) {
            if (isNaN(o2) && !(a3.type & N.MOVE_TO)) throw new Error("path must start with moveto");
            return r3 && a3.type & N.HORIZ_LINE_TO && (a3.type = N.LINE_TO, a3.y = a3.relative ? 0 : n2), e3 && a3.type & N.VERT_LINE_TO && (a3.type = N.LINE_TO, a3.x = a3.relative ? 0 : i3), t3 && a3.type & N.CLOSE_PATH && (a3.type = N.LINE_TO, a3.x = a3.relative ? o2 - i3 : o2, a3.y = a3.relative ? s3 - n2 : s3), a3.type & N.ARC && (0 === a3.rX || 0 === a3.rY) && (a3.type = N.LINE_TO, delete a3.rX, delete a3.rY, delete a3.xRot, delete a3.lArcFlag, delete a3.sweepFlag), a3;
          }));
        }, t2.NORMALIZE_ST = e2, t2.QT_TO_C = a2, t2.INFO = i2, t2.SANITIZE = function(t3) {
          void 0 === t3 && (t3 = 0), o(t3);
          var r3 = NaN, e3 = NaN, a3 = NaN, n2 = NaN;
          return i2((function(i3, o2, s3, u2, h2) {
            var c2 = Math.abs, m2 = false, y2 = 0, p2 = 0;
            if (i3.type & N.SMOOTH_CURVE_TO && (y2 = isNaN(r3) ? 0 : o2 - r3, p2 = isNaN(e3) ? 0 : s3 - e3), i3.type & (N.CURVE_TO | N.SMOOTH_CURVE_TO) ? (r3 = i3.relative ? o2 + i3.x2 : i3.x2, e3 = i3.relative ? s3 + i3.y2 : i3.y2) : (r3 = NaN, e3 = NaN), i3.type & N.SMOOTH_QUAD_TO ? (a3 = isNaN(a3) ? o2 : 2 * o2 - a3, n2 = isNaN(n2) ? s3 : 2 * s3 - n2) : i3.type & N.QUAD_TO ? (a3 = i3.relative ? o2 + i3.x1 : i3.x1, n2 = i3.relative ? s3 + i3.y1 : i3.y2) : (a3 = NaN, n2 = NaN), i3.type & N.LINE_COMMANDS || i3.type & N.ARC && (0 === i3.rX || 0 === i3.rY || !i3.lArcFlag) || i3.type & N.CURVE_TO || i3.type & N.SMOOTH_CURVE_TO || i3.type & N.QUAD_TO || i3.type & N.SMOOTH_QUAD_TO) {
              var f2 = void 0 === i3.x ? 0 : i3.relative ? i3.x : i3.x - o2, T3 = void 0 === i3.y ? 0 : i3.relative ? i3.y : i3.y - s3;
              y2 = isNaN(a3) ? void 0 === i3.x1 ? y2 : i3.relative ? i3.x : i3.x1 - o2 : a3 - o2, p2 = isNaN(n2) ? void 0 === i3.y1 ? p2 : i3.relative ? i3.y : i3.y1 - s3 : n2 - s3;
              var O2 = void 0 === i3.x2 ? 0 : i3.relative ? i3.x : i3.x2 - o2, l2 = void 0 === i3.y2 ? 0 : i3.relative ? i3.y : i3.y2 - s3;
              c2(f2) <= t3 && c2(T3) <= t3 && c2(y2) <= t3 && c2(p2) <= t3 && c2(O2) <= t3 && c2(l2) <= t3 && (m2 = true);
            }
            return i3.type & N.CLOSE_PATH && c2(o2 - u2) <= t3 && c2(s3 - h2) <= t3 && (m2 = true), m2 ? [] : i3;
          }));
        }, t2.MATRIX = s2, t2.ROTATE = function(t3, r3, e3) {
          void 0 === r3 && (r3 = 0), void 0 === e3 && (e3 = 0), o(t3, r3, e3);
          var a3 = Math.sin(t3), i3 = Math.cos(t3);
          return s2(i3, a3, -a3, i3, r3 - r3 * i3 + e3 * a3, e3 - r3 * a3 - e3 * i3);
        }, t2.TRANSLATE = function(t3, r3) {
          return void 0 === r3 && (r3 = 0), o(t3, r3), s2(1, 0, 0, 1, t3, r3);
        }, t2.SCALE = function(t3, r3) {
          return void 0 === r3 && (r3 = t3), o(t3, r3), s2(t3, 0, 0, r3, 0, 0);
        }, t2.SKEW_X = function(t3) {
          return o(t3), s2(1, 0, Math.atan(t3), 1, 0, 0);
        }, t2.SKEW_Y = function(t3) {
          return o(t3), s2(1, Math.atan(t3), 0, 1, 0, 0);
        }, t2.X_AXIS_SYMMETRY = function(t3) {
          return void 0 === t3 && (t3 = 0), o(t3), s2(-1, 0, 0, 1, t3, 0);
        }, t2.Y_AXIS_SYMMETRY = function(t3) {
          return void 0 === t3 && (t3 = 0), o(t3), s2(1, 0, 0, -1, 0, t3);
        }, t2.A_TO_C = function() {
          return i2((function(t3, r3, e3) {
            return N.ARC === t3.type ? (function(t4, r4, e4) {
              var a3, i3, o2, s3;
              t4.cX || u(t4, r4, e4);
              for (var h2 = Math.min(t4.phi1, t4.phi2), y2 = Math.max(t4.phi1, t4.phi2) - h2, p2 = Math.ceil(y2 / 90), f2 = new Array(p2), T3 = r4, O2 = e4, l2 = 0; l2 < p2; l2++) {
                var v2 = m(t4.phi1, t4.phi2, l2 / p2), _2 = m(t4.phi1, t4.phi2, (l2 + 1) / p2), d2 = _2 - v2, x = 4 / 3 * Math.tan(d2 * c / 4), A = [Math.cos(v2 * c) - x * Math.sin(v2 * c), Math.sin(v2 * c) + x * Math.cos(v2 * c)], E = A[0], C = A[1], M = [Math.cos(_2 * c), Math.sin(_2 * c)], R = M[0], S = M[1], g = [R + x * Math.sin(_2 * c), S - x * Math.cos(_2 * c)], I = g[0], V = g[1];
                f2[l2] = { relative: t4.relative, type: N.CURVE_TO };
                var D = function(r5, e5) {
                  var a4 = n([r5 * t4.rX, e5 * t4.rY], t4.xRot), i4 = a4[0], o3 = a4[1];
                  return [t4.cX + i4, t4.cY + o3];
                };
                a3 = D(E, C), f2[l2].x1 = a3[0], f2[l2].y1 = a3[1], i3 = D(I, V), f2[l2].x2 = i3[0], f2[l2].y2 = i3[1], o2 = D(R, S), f2[l2].x = o2[0], f2[l2].y = o2[1], t4.relative && (f2[l2].x1 -= T3, f2[l2].y1 -= O2, f2[l2].x2 -= T3, f2[l2].y2 -= O2, f2[l2].x -= T3, f2[l2].y -= O2), T3 = (s3 = [f2[l2].x, f2[l2].y])[0], O2 = s3[1];
              }
              return f2;
            })(t3, t3.relative ? 0 : r3, t3.relative ? 0 : e3) : t3;
          }));
        }, t2.ANNOTATE_ARCS = function() {
          return i2((function(t3, r3, e3) {
            return t3.relative && (r3 = 0, e3 = 0), N.ARC === t3.type && u(t3, r3, e3), t3;
          }));
        }, t2.CLONE = T2, t2.CALCULATE_BOUNDS = function() {
          var t3 = function(t4) {
            var r3 = {};
            for (var e3 in t4) r3[e3] = t4[e3];
            return r3;
          }, n2 = r2(), o2 = a2(), s3 = e2(), c2 = i2((function(r3, e3, a3) {
            var i3 = s3(o2(n2(t3(r3))));
            function m2(t4) {
              t4 > c2.maxX && (c2.maxX = t4), t4 < c2.minX && (c2.minX = t4);
            }
            function T3(t4) {
              t4 > c2.maxY && (c2.maxY = t4), t4 < c2.minY && (c2.minY = t4);
            }
            if (i3.type & N.DRAWING_COMMANDS && (m2(e3), T3(a3)), i3.type & N.HORIZ_LINE_TO && m2(i3.x), i3.type & N.VERT_LINE_TO && T3(i3.y), i3.type & N.LINE_TO && (m2(i3.x), T3(i3.y)), i3.type & N.CURVE_TO) {
              m2(i3.x), T3(i3.y);
              for (var O2 = 0, l2 = p(e3, i3.x1, i3.x2, i3.x); O2 < l2.length; O2++) {
                0 < (H = l2[O2]) && 1 > H && m2(f(e3, i3.x1, i3.x2, i3.x, H));
              }
              for (var v2 = 0, _2 = p(a3, i3.y1, i3.y2, i3.y); v2 < _2.length; v2++) {
                0 < (H = _2[v2]) && 1 > H && T3(f(a3, i3.y1, i3.y2, i3.y, H));
              }
            }
            if (i3.type & N.ARC) {
              m2(i3.x), T3(i3.y), u(i3, e3, a3);
              for (var d2 = i3.xRot / 180 * Math.PI, x = Math.cos(d2) * i3.rX, A = Math.sin(d2) * i3.rX, E = -Math.sin(d2) * i3.rY, C = Math.cos(d2) * i3.rY, M = i3.phi1 < i3.phi2 ? [i3.phi1, i3.phi2] : -180 > i3.phi2 ? [i3.phi2 + 360, i3.phi1 + 360] : [i3.phi2, i3.phi1], R = M[0], S = M[1], g = function(t4) {
                var r4 = t4[0], e4 = t4[1], a4 = 180 * Math.atan2(e4, r4) / Math.PI;
                return a4 < R ? a4 + 360 : a4;
              }, I = 0, V = h(E, -x, 0).map(g); I < V.length; I++) {
                (H = V[I]) > R && H < S && m2(y(i3.cX, x, E, H));
              }
              for (var D = 0, L = h(C, -A, 0).map(g); D < L.length; D++) {
                var H;
                (H = L[D]) > R && H < S && T3(y(i3.cY, A, C, H));
              }
            }
            return r3;
          }));
          return c2.minX = 1 / 0, c2.maxX = -1 / 0, c2.minY = 1 / 0, c2.maxY = -1 / 0, c2;
        };
      })(t.SVGPathDataTransformer || (t.SVGPathDataTransformer = {}));
      var T, O = (function() {
        function r2() {
        }
        return r2.prototype.round = function(r3) {
          return this.transform(t.SVGPathDataTransformer.ROUND(r3));
        }, r2.prototype.toAbs = function() {
          return this.transform(t.SVGPathDataTransformer.TO_ABS());
        }, r2.prototype.toRel = function() {
          return this.transform(t.SVGPathDataTransformer.TO_REL());
        }, r2.prototype.normalizeHVZ = function(r3, e2, a2) {
          return this.transform(t.SVGPathDataTransformer.NORMALIZE_HVZ(r3, e2, a2));
        }, r2.prototype.normalizeST = function() {
          return this.transform(t.SVGPathDataTransformer.NORMALIZE_ST());
        }, r2.prototype.qtToC = function() {
          return this.transform(t.SVGPathDataTransformer.QT_TO_C());
        }, r2.prototype.aToC = function() {
          return this.transform(t.SVGPathDataTransformer.A_TO_C());
        }, r2.prototype.sanitize = function(r3) {
          return this.transform(t.SVGPathDataTransformer.SANITIZE(r3));
        }, r2.prototype.translate = function(r3, e2) {
          return this.transform(t.SVGPathDataTransformer.TRANSLATE(r3, e2));
        }, r2.prototype.scale = function(r3, e2) {
          return this.transform(t.SVGPathDataTransformer.SCALE(r3, e2));
        }, r2.prototype.rotate = function(r3, e2, a2) {
          return this.transform(t.SVGPathDataTransformer.ROTATE(r3, e2, a2));
        }, r2.prototype.matrix = function(r3, e2, a2, i2, n2, o2) {
          return this.transform(t.SVGPathDataTransformer.MATRIX(r3, e2, a2, i2, n2, o2));
        }, r2.prototype.skewX = function(r3) {
          return this.transform(t.SVGPathDataTransformer.SKEW_X(r3));
        }, r2.prototype.skewY = function(r3) {
          return this.transform(t.SVGPathDataTransformer.SKEW_Y(r3));
        }, r2.prototype.xSymmetry = function(r3) {
          return this.transform(t.SVGPathDataTransformer.X_AXIS_SYMMETRY(r3));
        }, r2.prototype.ySymmetry = function(r3) {
          return this.transform(t.SVGPathDataTransformer.Y_AXIS_SYMMETRY(r3));
        }, r2.prototype.annotateArcs = function() {
          return this.transform(t.SVGPathDataTransformer.ANNOTATE_ARCS());
        }, r2;
      })(), l = function(t2) {
        return " " === t2 || "	" === t2 || "\r" === t2 || "\n" === t2;
      }, v = function(t2) {
        return "0".charCodeAt(0) <= t2.charCodeAt(0) && t2.charCodeAt(0) <= "9".charCodeAt(0);
      }, _ = (function(t2) {
        function r2() {
          var r3 = t2.call(this) || this;
          return r3.curNumber = "", r3.curCommandType = -1, r3.curCommandRelative = false, r3.canParseCommandOrComma = true, r3.curNumberHasExp = false, r3.curNumberHasExpDigits = false, r3.curNumberHasDecimal = false, r3.curArgs = [], r3;
        }
        return e(r2, t2), r2.prototype.finish = function(t3) {
          if (void 0 === t3 && (t3 = []), this.parse(" ", t3), 0 !== this.curArgs.length || !this.canParseCommandOrComma) throw new SyntaxError("Unterminated command at the path end.");
          return t3;
        }, r2.prototype.parse = function(t3, r3) {
          var e2 = this;
          void 0 === r3 && (r3 = []);
          for (var a2 = function(t4) {
            r3.push(t4), e2.curArgs.length = 0, e2.canParseCommandOrComma = true;
          }, i2 = 0; i2 < t3.length; i2++) {
            var n2 = t3[i2], o2 = !(this.curCommandType !== N.ARC || 3 !== this.curArgs.length && 4 !== this.curArgs.length || 1 !== this.curNumber.length || "0" !== this.curNumber && "1" !== this.curNumber), s2 = v(n2) && ("0" === this.curNumber && "0" === n2 || o2);
            if (!v(n2) || s2) if ("e" !== n2 && "E" !== n2) if ("-" !== n2 && "+" !== n2 || !this.curNumberHasExp || this.curNumberHasExpDigits) if ("." !== n2 || this.curNumberHasExp || this.curNumberHasDecimal || o2) {
              if (this.curNumber && -1 !== this.curCommandType) {
                var u2 = Number(this.curNumber);
                if (isNaN(u2)) throw new SyntaxError("Invalid number ending at " + i2);
                if (this.curCommandType === N.ARC) {
                  if (0 === this.curArgs.length || 1 === this.curArgs.length) {
                    if (0 > u2) throw new SyntaxError('Expected positive number, got "' + u2 + '" at index "' + i2 + '"');
                  } else if ((3 === this.curArgs.length || 4 === this.curArgs.length) && "0" !== this.curNumber && "1" !== this.curNumber) throw new SyntaxError('Expected a flag, got "' + this.curNumber + '" at index "' + i2 + '"');
                }
                this.curArgs.push(u2), this.curArgs.length === d[this.curCommandType] && (N.HORIZ_LINE_TO === this.curCommandType ? a2({ type: N.HORIZ_LINE_TO, relative: this.curCommandRelative, x: u2 }) : N.VERT_LINE_TO === this.curCommandType ? a2({ type: N.VERT_LINE_TO, relative: this.curCommandRelative, y: u2 }) : this.curCommandType === N.MOVE_TO || this.curCommandType === N.LINE_TO || this.curCommandType === N.SMOOTH_QUAD_TO ? (a2({ type: this.curCommandType, relative: this.curCommandRelative, x: this.curArgs[0], y: this.curArgs[1] }), N.MOVE_TO === this.curCommandType && (this.curCommandType = N.LINE_TO)) : this.curCommandType === N.CURVE_TO ? a2({ type: N.CURVE_TO, relative: this.curCommandRelative, x1: this.curArgs[0], y1: this.curArgs[1], x2: this.curArgs[2], y2: this.curArgs[3], x: this.curArgs[4], y: this.curArgs[5] }) : this.curCommandType === N.SMOOTH_CURVE_TO ? a2({ type: N.SMOOTH_CURVE_TO, relative: this.curCommandRelative, x2: this.curArgs[0], y2: this.curArgs[1], x: this.curArgs[2], y: this.curArgs[3] }) : this.curCommandType === N.QUAD_TO ? a2({ type: N.QUAD_TO, relative: this.curCommandRelative, x1: this.curArgs[0], y1: this.curArgs[1], x: this.curArgs[2], y: this.curArgs[3] }) : this.curCommandType === N.ARC && a2({ type: N.ARC, relative: this.curCommandRelative, rX: this.curArgs[0], rY: this.curArgs[1], xRot: this.curArgs[2], lArcFlag: this.curArgs[3], sweepFlag: this.curArgs[4], x: this.curArgs[5], y: this.curArgs[6] })), this.curNumber = "", this.curNumberHasExpDigits = false, this.curNumberHasExp = false, this.curNumberHasDecimal = false, this.canParseCommandOrComma = true;
              }
              if (!l(n2)) if ("," === n2 && this.canParseCommandOrComma) this.canParseCommandOrComma = false;
              else if ("+" !== n2 && "-" !== n2 && "." !== n2) if (s2) this.curNumber = n2, this.curNumberHasDecimal = false;
              else {
                if (0 !== this.curArgs.length) throw new SyntaxError("Unterminated command at index " + i2 + ".");
                if (!this.canParseCommandOrComma) throw new SyntaxError('Unexpected character "' + n2 + '" at index ' + i2 + ". Command cannot follow comma");
                if (this.canParseCommandOrComma = false, "z" !== n2 && "Z" !== n2) if ("h" === n2 || "H" === n2) this.curCommandType = N.HORIZ_LINE_TO, this.curCommandRelative = "h" === n2;
                else if ("v" === n2 || "V" === n2) this.curCommandType = N.VERT_LINE_TO, this.curCommandRelative = "v" === n2;
                else if ("m" === n2 || "M" === n2) this.curCommandType = N.MOVE_TO, this.curCommandRelative = "m" === n2;
                else if ("l" === n2 || "L" === n2) this.curCommandType = N.LINE_TO, this.curCommandRelative = "l" === n2;
                else if ("c" === n2 || "C" === n2) this.curCommandType = N.CURVE_TO, this.curCommandRelative = "c" === n2;
                else if ("s" === n2 || "S" === n2) this.curCommandType = N.SMOOTH_CURVE_TO, this.curCommandRelative = "s" === n2;
                else if ("q" === n2 || "Q" === n2) this.curCommandType = N.QUAD_TO, this.curCommandRelative = "q" === n2;
                else if ("t" === n2 || "T" === n2) this.curCommandType = N.SMOOTH_QUAD_TO, this.curCommandRelative = "t" === n2;
                else {
                  if ("a" !== n2 && "A" !== n2) throw new SyntaxError('Unexpected character "' + n2 + '" at index ' + i2 + ".");
                  this.curCommandType = N.ARC, this.curCommandRelative = "a" === n2;
                }
                else r3.push({ type: N.CLOSE_PATH }), this.canParseCommandOrComma = true, this.curCommandType = -1;
              }
              else this.curNumber = n2, this.curNumberHasDecimal = "." === n2;
            } else this.curNumber += n2, this.curNumberHasDecimal = true;
            else this.curNumber += n2;
            else this.curNumber += n2, this.curNumberHasExp = true;
            else this.curNumber += n2, this.curNumberHasExpDigits = this.curNumberHasExp;
          }
          return r3;
        }, r2.prototype.transform = function(t3) {
          return Object.create(this, { parse: { value: function(r3, e2) {
            void 0 === e2 && (e2 = []);
            for (var a2 = 0, i2 = Object.getPrototypeOf(this).parse.call(this, r3); a2 < i2.length; a2++) {
              var n2 = i2[a2], o2 = t3(n2);
              Array.isArray(o2) ? e2.push.apply(e2, o2) : e2.push(o2);
            }
            return e2;
          } } });
        }, r2;
      })(O), N = (function(r2) {
        function a2(t2) {
          var e2 = r2.call(this) || this;
          return e2.commands = "string" == typeof t2 ? a2.parse(t2) : t2, e2;
        }
        return e(a2, r2), a2.prototype.encode = function() {
          return a2.encode(this.commands);
        }, a2.prototype.getBounds = function() {
          var r3 = t.SVGPathDataTransformer.CALCULATE_BOUNDS();
          return this.transform(r3), r3;
        }, a2.prototype.transform = function(t2) {
          for (var r3 = [], e2 = 0, a3 = this.commands; e2 < a3.length; e2++) {
            var i2 = t2(a3[e2]);
            Array.isArray(i2) ? r3.push.apply(r3, i2) : r3.push(i2);
          }
          return this.commands = r3, this;
        }, a2.encode = function(t2) {
          return i(t2);
        }, a2.parse = function(t2) {
          var r3 = new _(), e2 = [];
          return r3.parse(t2, e2), r3.finish(e2), e2;
        }, a2.CLOSE_PATH = 1, a2.MOVE_TO = 2, a2.HORIZ_LINE_TO = 4, a2.VERT_LINE_TO = 8, a2.LINE_TO = 16, a2.CURVE_TO = 32, a2.SMOOTH_CURVE_TO = 64, a2.QUAD_TO = 128, a2.SMOOTH_QUAD_TO = 256, a2.ARC = 512, a2.LINE_COMMANDS = a2.LINE_TO | a2.HORIZ_LINE_TO | a2.VERT_LINE_TO, a2.DRAWING_COMMANDS = a2.HORIZ_LINE_TO | a2.VERT_LINE_TO | a2.LINE_TO | a2.CURVE_TO | a2.SMOOTH_CURVE_TO | a2.QUAD_TO | a2.SMOOTH_QUAD_TO | a2.ARC, a2;
      })(O), d = ((T = {})[N.MOVE_TO] = 2, T[N.LINE_TO] = 2, T[N.HORIZ_LINE_TO] = 1, T[N.VERT_LINE_TO] = 1, T[N.CLOSE_PATH] = 0, T[N.QUAD_TO] = 4, T[N.SMOOTH_QUAD_TO] = 2, T[N.CURVE_TO] = 6, T[N.SMOOTH_CURVE_TO] = 4, T[N.ARC] = 7, T);
      t.COMMAND_ARG_COUNTS = d, t.SVGPathData = N, t.SVGPathDataParser = _, t.encodeSVGPath = i, Object.defineProperty(t, "__esModule", { value: true });
    }));
  })(SVGPathData$1, SVGPathData$1.exports);
  return SVGPathData$1.exports;
}
export {
  requireSVGPathData as r
};

import { r as requireCjs$1 } from "./inline-style-parser.mjs";
var cjs = {};
var hasRequiredCjs;
function requireCjs() {
  if (hasRequiredCjs) return cjs;
  hasRequiredCjs = 1;
  var __importDefault = cjs && cjs.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(cjs, "__esModule", { value: true });
  cjs.default = StyleToObject;
  const inline_style_parser_1 = __importDefault(requireCjs$1());
  function StyleToObject(style, iterator) {
    let styleObject = null;
    if (!style || typeof style !== "string") {
      return styleObject;
    }
    const declarations = (0, inline_style_parser_1.default)(style);
    const hasIterator = typeof iterator === "function";
    declarations.forEach((declaration) => {
      if (declaration.type !== "declaration") {
        return;
      }
      const { property, value } = declaration;
      if (hasIterator) {
        iterator(property, value, declaration);
      } else if (value) {
        styleObject = styleObject || {};
        styleObject[property] = value;
      }
    });
    return styleObject;
  }
  return cjs;
}
export {
  requireCjs as r
};

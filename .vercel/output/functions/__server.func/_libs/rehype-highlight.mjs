import { g as grammars, c as createLowlight } from "./lowlight.mjs";
import { v as visit } from "./unist-util-visit.mjs";
import { t as toText } from "./hast-util-to-text.mjs";
const emptyOptions = {};
function rehypeHighlight(options) {
  const settings = options || emptyOptions;
  const aliases = settings.aliases;
  const detect = settings.detect || false;
  const languages = settings.languages || grammars;
  const plainText = settings.plainText;
  const prefix = settings.prefix;
  const subset = settings.subset;
  let name = "hljs";
  const lowlight = createLowlight(languages);
  if (aliases) {
    lowlight.registerAlias(aliases);
  }
  if (prefix) {
    const pos = prefix.indexOf("-");
    name = pos === -1 ? prefix : prefix.slice(0, pos);
  }
  return function(tree, file) {
    visit(tree, "element", function(node, _, parent) {
      if (node.tagName !== "code" || !parent || parent.type !== "element" || parent.tagName !== "pre") {
        return;
      }
      const lang = language(node);
      if (lang === false || !lang && !detect || lang && plainText && plainText.includes(lang)) {
        return;
      }
      if (!Array.isArray(node.properties.className)) {
        node.properties.className = [];
      }
      if (!node.properties.className.includes(name)) {
        node.properties.className.unshift(name);
      }
      const text = toText(node, { whitespace: "pre" });
      let result;
      try {
        result = lang ? lowlight.highlight(lang, text, { prefix }) : lowlight.highlightAuto(text, { prefix, subset });
      } catch (error) {
        const cause = (
          /** @type {Error} */
          error
        );
        if (lang && /Unknown language/.test(cause.message)) {
          file.message(
            "Cannot highlight as `" + lang + "`, it’s not registered",
            {
              ancestors: [parent, node],
              cause,
              place: node.position,
              ruleId: "missing-language",
              source: "rehype-highlight"
            }
          );
          return;
        }
        throw cause;
      }
      if (!lang && result.data && result.data.language) {
        node.properties.className.push("language-" + result.data.language);
      }
      if (result.children.length > 0) {
        node.children = /** @type {Array<ElementContent>} */
        result.children;
      }
    });
  };
}
function language(node) {
  const list = node.properties.className;
  let index = -1;
  if (!Array.isArray(list)) {
    return;
  }
  let name;
  while (++index < list.length) {
    const value = String(list[index]);
    if (value === "no-highlight" || value === "nohighlight") {
      return false;
    }
    if (!name && value.slice(0, 5) === "lang-") {
      name = value.slice(5);
    }
    if (!name && value.slice(0, 9) === "language-") {
      name = value.slice(9);
    }
  }
  return name;
}
export {
  rehypeHighlight as r
};

import { y as yaml, x as xml, w as wasm, v as vbnet, t as typescript, s as swift, a as sql, b as shell, c as scss, r as rust, d as ruby, e as r, p as pythonRepl, f as python, g as plaintext, h as phpTemplate, i as php, j as perl, o as objectivec, m as markdown, k as makefile, l as lua, n as less, q as kotlin, u as json, z as javascript, A as java, B as ini, C as graphql, D as go, E as diff, F as css, G as csharp, H as cpp, I as c, J as bash, K as arduino, L as HighlightJS } from "./highlight.js.mjs";
const grammars = {
  arduino,
  bash,
  c,
  cpp,
  csharp,
  css,
  diff,
  go,
  graphql,
  ini,
  java,
  javascript,
  json,
  kotlin,
  less,
  lua,
  makefile,
  markdown,
  objectivec,
  perl,
  php,
  "php-template": phpTemplate,
  plaintext,
  python,
  "python-repl": pythonRepl,
  r,
  ruby,
  rust,
  scss,
  shell,
  sql,
  swift,
  typescript,
  vbnet,
  wasm,
  xml,
  yaml
};
const emptyOptions = {};
const defaultPrefix = "hljs-";
function createLowlight(grammars2) {
  const high = HighlightJS.newInstance();
  if (grammars2) {
    register(grammars2);
  }
  return {
    highlight,
    highlightAuto,
    listLanguages,
    register,
    registerAlias,
    registered
  };
  function highlight(language, value, options) {
    const settings = options || emptyOptions;
    const prefix = typeof settings.prefix === "string" ? settings.prefix : defaultPrefix;
    if (!high.getLanguage(language)) {
      throw new Error("Unknown language: `" + language + "` is not registered");
    }
    high.configure({ __emitter: HastEmitter, classPrefix: prefix });
    const result = (
      /** @type {HighlightResult & {_emitter: HastEmitter}} */
      high.highlight(value, { ignoreIllegals: true, language })
    );
    if (result.errorRaised) {
      throw new Error("Could not highlight with `Highlight.js`", {
        cause: result.errorRaised
      });
    }
    const root = result._emitter.root;
    const data = (
      /** @type {RootData} */
      root.data
    );
    data.language = result.language;
    data.relevance = result.relevance;
    return root;
  }
  function highlightAuto(value, options) {
    const settings = options || emptyOptions;
    const subset = settings.subset || listLanguages();
    let index = -1;
    let relevance = 0;
    let result;
    while (++index < subset.length) {
      const name = subset[index];
      if (!high.getLanguage(name)) continue;
      const current = highlight(name, value, options);
      if (current.data && current.data.relevance !== void 0 && current.data.relevance > relevance) {
        relevance = current.data.relevance;
        result = current;
      }
    }
    return result || {
      type: "root",
      children: [],
      data: { language: void 0, relevance }
    };
  }
  function listLanguages() {
    return high.listLanguages();
  }
  function register(grammarsOrName, grammar) {
    if (typeof grammarsOrName === "string") {
      high.registerLanguage(grammarsOrName, grammar);
    } else {
      let name;
      for (name in grammarsOrName) {
        if (Object.hasOwn(grammarsOrName, name)) {
          high.registerLanguage(name, grammarsOrName[name]);
        }
      }
    }
  }
  function registerAlias(aliasesOrName, alias) {
    if (typeof aliasesOrName === "string") {
      high.registerAliases(
        // Note: copy needed because hljs doesn’t accept readonly arrays yet.
        typeof alias === "string" ? alias : [...alias],
        { languageName: aliasesOrName }
      );
    } else {
      let key;
      for (key in aliasesOrName) {
        if (Object.hasOwn(aliasesOrName, key)) {
          const aliases = aliasesOrName[key];
          high.registerAliases(
            // Note: copy needed because hljs doesn’t accept readonly arrays yet.
            typeof aliases === "string" ? aliases : [...aliases],
            { languageName: key }
          );
        }
      }
    }
  }
  function registered(aliasOrName) {
    return Boolean(high.getLanguage(aliasOrName));
  }
}
class HastEmitter {
  /**
   * @param {Readonly<HljsOptions>} options
   *   Configuration.
   * @returns
   *   Instance.
   */
  constructor(options) {
    this.options = options;
    this.root = {
      type: "root",
      children: [],
      data: { language: void 0, relevance: 0 }
    };
    this.stack = [this.root];
  }
  /**
   * @param {string} value
   *   Text to add.
   * @returns {undefined}
   *   Nothing.
   *
   */
  addText(value) {
    if (value === "") return;
    const current = this.stack[this.stack.length - 1];
    const tail = current.children[current.children.length - 1];
    if (tail && tail.type === "text") {
      tail.value += value;
    } else {
      current.children.push({ type: "text", value });
    }
  }
  /**
   *
   * @param {unknown} rawName
   *   Name to add.
   * @returns {undefined}
   *   Nothing.
   */
  startScope(rawName) {
    this.openNode(String(rawName));
  }
  /**
   * @returns {undefined}
   *   Nothing.
   */
  endScope() {
    this.closeNode();
  }
  /**
   * @param {HastEmitter} other
   *   Other emitter.
   * @param {string} name
   *   Name of the sublanguage.
   * @returns {undefined}
   *   Nothing.
   */
  __addSublanguage(other, name) {
    const current = this.stack[this.stack.length - 1];
    const results = (
      /** @type {Array<ElementContent>} */
      other.root.children
    );
    if (name) {
      current.children.push({
        type: "element",
        tagName: "span",
        properties: { className: [name] },
        children: results
      });
    } else {
      current.children.push(...results);
    }
  }
  /**
   * @param {string} name
   *   Name to add.
   * @returns {undefined}
   *   Nothing.
   */
  openNode(name) {
    const self = this;
    const className = name.split(".").map(function(d, i) {
      return i ? d + "_".repeat(i) : self.options.classPrefix + d;
    });
    const current = this.stack[this.stack.length - 1];
    const child = {
      type: "element",
      tagName: "span",
      properties: { className },
      children: []
    };
    current.children.push(child);
    this.stack.push(child);
  }
  /**
   * @returns {undefined}
   *   Nothing.
   */
  closeNode() {
    this.stack.pop();
  }
  /**
   * @returns {undefined}
   *   Nothing.
   */
  finalize() {
  }
  /**
   * @returns {string}
   *   Nothing.
   */
  toHTML() {
    return "";
  }
}
export {
  createLowlight as c,
  grammars as g
};

import { c as convert } from "./unist-util-is.mjs";
const findAfter = (
  // Note: overloads like this are needed to support optional generics.
  /**
   * @type {(
   *   (<Kind extends UnistParent, Check extends Test>(parent: Kind, index: Child<Kind> | number, test: Check) => Matches<Child<Kind>, Check> | undefined) &
   *   (<Kind extends UnistParent>(parent: Kind, index: Child<Kind> | number, test?: null | undefined) => Child<Kind> | undefined)
   * )}
   */
  /**
   * @param {UnistParent} parent
   * @param {UnistNode | number} index
   * @param {Test} [test]
   * @returns {UnistNode | undefined}
   */
  (function(parent, index, test) {
    const is = convert(test);
    if (!parent || !parent.type || !parent.children) {
      throw new Error("Expected parent node");
    }
    if (typeof index === "number") {
      if (index < 0 || index === Number.POSITIVE_INFINITY) {
        throw new Error("Expected positive finite number as index");
      }
    } else {
      index = parent.children.indexOf(index);
      if (index < 0) {
        throw new Error("Expected child node or index");
      }
    }
    while (++index < parent.children.length) {
      if (is(parent.children[index], index, parent)) {
        return parent.children[index];
      }
    }
    return void 0;
  })
);
export {
  findAfter as f
};

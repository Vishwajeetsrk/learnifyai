import { c as markdownLineEndingOrSpace, u as unicodeWhitespace, d as unicodePunctuation } from "./micromark-util-character.mjs";
function classifyCharacter(code) {
  if (code === null || markdownLineEndingOrSpace(code) || unicodeWhitespace(code)) {
    return 1;
  }
  if (unicodePunctuation(code)) {
    return 2;
  }
}
export {
  classifyCharacter as c
};

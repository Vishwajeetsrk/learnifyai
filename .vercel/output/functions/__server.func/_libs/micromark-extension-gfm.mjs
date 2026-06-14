import { c as combineExtensions } from "./micromark-util-combine-extensions+[...].mjs";
import { g as gfmAutolinkLiteral } from "./micromark-extension-gfm-autolink-literal+[...].mjs";
import { g as gfmFootnote } from "./micromark-extension-gfm-footnote+[...].mjs";
import { g as gfmStrikethrough } from "./micromark-extension-gfm-strikethrough+[...].mjs";
import { g as gfmTable } from "./micromark-extension-gfm-table.mjs";
import { g as gfmTaskListItem } from "./micromark-extension-gfm-task-list-item+[...].mjs";
function gfm(options) {
  return combineExtensions([
    gfmAutolinkLiteral(),
    gfmFootnote(),
    gfmStrikethrough(options),
    gfmTable(),
    gfmTaskListItem()
  ]);
}
export {
  gfm as g
};

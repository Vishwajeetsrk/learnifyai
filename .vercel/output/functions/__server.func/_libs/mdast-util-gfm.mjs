import { g as gfmAutolinkLiteralFromMarkdown, a as gfmAutolinkLiteralToMarkdown } from "./mdast-util-gfm-autolink-literal+[...].mjs";
import { g as gfmFootnoteFromMarkdown, a as gfmFootnoteToMarkdown } from "./mdast-util-gfm-footnote.mjs";
import { g as gfmStrikethroughFromMarkdown, a as gfmStrikethroughToMarkdown } from "./mdast-util-gfm-strikethrough.mjs";
import { g as gfmTableFromMarkdown, a as gfmTableToMarkdown } from "./mdast-util-gfm-table.mjs";
import { g as gfmTaskListItemFromMarkdown, a as gfmTaskListItemToMarkdown } from "./mdast-util-gfm-task-list-item.mjs";
function gfmFromMarkdown() {
  return [
    gfmAutolinkLiteralFromMarkdown(),
    gfmFootnoteFromMarkdown(),
    gfmStrikethroughFromMarkdown(),
    gfmTableFromMarkdown(),
    gfmTaskListItemFromMarkdown()
  ];
}
function gfmToMarkdown(options) {
  return {
    extensions: [
      gfmAutolinkLiteralToMarkdown(),
      gfmFootnoteToMarkdown(options),
      gfmStrikethroughToMarkdown(),
      gfmTableToMarkdown(options),
      gfmTaskListItemToMarkdown()
    ]
  };
}
export {
  gfmToMarkdown as a,
  gfmFromMarkdown as g
};

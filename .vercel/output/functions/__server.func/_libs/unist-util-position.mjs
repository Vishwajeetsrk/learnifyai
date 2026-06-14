const pointEnd = point("end");
const pointStart = point("start");
function point(type) {
  return point2;
  function point2(node) {
    const point3 = node && node.position && node.position[type] || {};
    if (typeof point3.line === "number" && point3.line > 0 && typeof point3.column === "number" && point3.column > 0) {
      return {
        line: point3.line,
        column: point3.column,
        offset: typeof point3.offset === "number" && point3.offset > -1 ? point3.offset : void 0
      };
    }
  }
}
function position(node) {
  const start = pointStart(node);
  const end = pointEnd(node);
  if (start && end) {
    return { start, end };
  }
}
export {
  pointEnd as a,
  position as b,
  pointStart as p
};

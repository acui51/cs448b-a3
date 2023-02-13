import * as d3 from "d3";

export const dragStarted = (event, d, id) => {
  d3.select(id).raise().attr("stroke", "red");
};

export const dragged = (event, d, id) => {
  d3.select(id).attr("cx", event.x).attr("cy", event.y);
};

export const dragEnded = (event, d, id) => {
  const dragElement = d3.select(id);
  dragElement.attr("stroke", null);
  return [dragElement.attr("cx"), dragElement.attr("cy")];
};

export const addDragHandlers = (setACircleCenter, setBCircleCenter) => {
  d3.select("#draggable-circle-a").call(
    d3
      .drag()
      .on("start", (event, d) => dragStarted(event, d, "#draggable-circle-a"))
      .on("drag", (event, d) => dragged(event, d, "#draggable-circle-a"))
      .on("end", (event, d) => {
        const [cx, cy] = dragEnded(event, d, "#draggable-circle-a");
        setACircleCenter((prev) => ({ ...prev, x: cx, y: cy }));
      })
  );

  d3.select("#draggable-circle-b").call(
    d3
      .drag()
      .on("start", (event, d) => dragStarted(event, d, "#draggable-circle-b"))
      .on("drag", (event, d) => dragged(event, d, "#draggable-circle-b"))
      .on("end", (event, d) => {
        const [cx, cy] = dragEnded(event, d, "#draggable-circle-b");
        setBCircleCenter((prev) => ({ ...prev, x: cx, y: cy }));
      })
  );
};

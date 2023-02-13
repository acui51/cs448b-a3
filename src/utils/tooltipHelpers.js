import * as d3 from "d3";

export const handleMouseOver = (tooltipHtml) => {
  d3.select("#tooltip").style("visibility", "visible").html(tooltipHtml);
};

export const handleMouseOut = () => {
  d3.select("#tooltip").style("visibility", "hidden");
};

export const handleMouseMove = (event) => {
  d3.select("#tooltip")
    .style("left", event.pageX + 10 + "px")
    .style("top", event.pageY + 10 + "px");
};

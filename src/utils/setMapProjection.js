import * as d3 from "d3";

export const getMapProjection = (mapData) => {
  const projection = d3.geoAlbers();

  projection
    .precision(0)
    .rotate([90, 0, 0])
    .fitExtent(
      [
        [0, 0],
        [960, 480],
      ],
      mapData
    );
  return projection;
};

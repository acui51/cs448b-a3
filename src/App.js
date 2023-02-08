import "./App.css";
import { useMap } from "./hooks/useMap";
import { useRestaurants } from "./hooks/useRestaurants";
import { getMapProjection } from "./utils/setMapProjection";
import { useState } from "react";
import * as d3 from "d3";
import {
  handleMouseOut,
  handleMouseOver,
  handleMouseMove,
} from "./utils/tooltipHelpers";

const tooltipStyles = {
  position: "absolute",
  opacity: 0,
  border: `1px solid black`,
  backgroundColor: "white",
  padding: "8px",
};

const BayAreaRegion = ({ path }) => {
  return <path className="path" d={path} />;
};

const RestaurantCircle = ({ lat, long, projection, tooltipData }) => {
  const tooltipHtml = `
    <div class="tooltip-data">
      <span>${tooltipData.name}</span>
      <span>Address: ${tooltipData.address}</span>
      <span>Rating: ${tooltipData.rating}</span>
    </div>
  `;

  return (
    <circle
      cx={projection([+lat, +long])[0]}
      cy={projection([+lat, +long])[1]}
      r="1"
      fill="#69b3a2"
      onMouseOver={() => handleMouseOver(tooltipHtml)}
      onMouseOut={() => handleMouseOut()}
      onMouseMove={(event) => handleMouseMove(event)}
    />
  );
};

function App() {
  const [lowerRating, setLowerRating] = useState("0");
  const [upperRating, setUpperRating] = useState("5");
  const { restaurantsData, loading: restaurantsLoading } = useRestaurants(
    lowerRating,
    upperRating
  );
  const { mapData, loading: mapLoading } = useMap();

  if (mapLoading || restaurantsLoading) {
    return <div className="App">Loading...</div>;
  }

  // Draw regions
  const projection = getMapProjection(mapData);
  const path = d3.geoPath().projection(projection);
  const bayAreaRegions = mapData.features.map((data, index) => {
    return <BayAreaRegion key={index} path={path(data)} />;
  });

  // Draw circles
  const circles = restaurantsData.map(
    ({ name, rating, coordinates, address }, index) => {
      const [long, lat] = coordinates.split(",");
      return (
        <RestaurantCircle
          key={index}
          lat={lat}
          long={long}
          projection={projection}
          tooltipData={{ name, rating, address }}
        />
      );
    }
  );

  return (
    <div className="viewport">
      <div className="filter">
        Filter by rating
        <input
          value={lowerRating}
          min={0}
          max={upperRating}
          onChange={(event) => setLowerRating(event.target.value)}
        />
        <input
          value={upperRating}
          min={lowerRating}
          max={5}
          onChange={(event) => setUpperRating(event.target.value)}
        />
      </div>
      <svg className="map-canvas">
        <g>{bayAreaRegions}</g>
        <g>{circles}</g>
      </svg>
      <div id="tooltip" style={tooltipStyles} />
    </div>
  );
}

export default App;

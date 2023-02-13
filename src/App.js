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
import { addDragHandlers } from "./utils/dragHelpers";
import { lesserrafim } from "./utils/lesserrafim";
import { Input, Space } from "antd";
import { Restaurant } from "./components/Restaurant";

const tooltipStyles = {
  position: "absolute",
  visiblity: "hidden",
  border: `1px solid black`,
  backgroundColor: "white",
  padding: "8px",
};

const BayAreaRegion = ({ path }) => {
  return <path className="path" d={path} />;
};

const RestaurantCircle = ({ cy, cx, tooltipData, isInBoundingCircle }) => {
  const tooltipHtml = `
    <div class="tooltip-data">
      <span>${tooltipData.name}</span>
      <span>Address: ${tooltipData.address}</span>
      <span>Rating: ${tooltipData.rating}</span>
      <span>Coordinates: ${tooltipData.coordinates}</span>
    </div>
  `;

  return (
    <circle
      cx={cx}
      cy={cy}
      r="1"
      fill={isInBoundingCircle ? "#EE6B6E" : "#69b3a2"}
      onMouseOver={() => handleMouseOver(tooltipHtml)}
      onMouseOut={() => handleMouseOut()}
      onMouseMove={(event) => handleMouseMove(event)}
    />
  );
};

function App() {
  const [lowerRating, setLowerRating] = useState("0");
  const [upperRating, setUpperRating] = useState("5");
  const [searchValue, setSearchValue] = useState("");
  const [aCircleCenter, setACircleCenter] = useState({
    x: 491,
    y: 407,
    r: 100,
  });
  const [bCircleCenter, setBCircleCenter] = useState({
    x: 625,
    y: 400,
    r: 100,
  });
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
  const inBoundRestaurants = [];
  const circles = restaurantsData.map(
    ({ name, rating, coordinates, address, image_url, url }, index) => {
      const [long, lat] = coordinates.split(",");
      const [cx, cy] = projection([+lat, +long]);

      const isInBoundingACircle = lesserrafim({
        x: cx,
        y: cy,
        centerX: aCircleCenter.x,
        centerY: aCircleCenter.y,
        radius: aCircleCenter.r,
      });

      const isInBoundingBCircle = lesserrafim({
        x: cx,
        y: cy,
        centerX: bCircleCenter.x,
        centerY: bCircleCenter.y,
        radius: bCircleCenter.r,
      });

      if (isInBoundingACircle && isInBoundingBCircle) {
        inBoundRestaurants.push({
          name,
          rating,
          address,
          image_url,
          url,
        });
      }

      return (
        <RestaurantCircle
          isInBoundingCircle={isInBoundingACircle && isInBoundingBCircle}
          key={index}
          cx={cx}
          cy={cy}
          projection={projection}
          tooltipData={{ name, rating, address, coordinates }}
        />
      );
    }
  );

  return (
    <div
      className="viewport"
      ref={(_node) => {
        addDragHandlers(setACircleCenter, setBCircleCenter);
      }}
    >
      <div className="lefthand">
        <h1>CS448B Assignment 3</h1>
        <div className="filter">
          <h3>Ratings</h3>
          <Input.Group>
            <Input
              style={{
                width: "33%",
                textAlign: "center",
                borderTopRightRadius: "0px",
              }}
              value={lowerRating}
              onChange={(event) => setLowerRating(event.target.value)}
            />
            <Input
              className="site-input-split"
              style={{
                width: 30,
                borderLeft: 0,
                borderRight: 0,
                pointerEvents: "none",
              }}
              placeholder="~"
              disabled
            />
            <Input
              className="site-input-right"
              style={{
                width: "33%",
                textAlign: "center",
              }}
              value={upperRating}
              onChange={(event) => setUpperRating(event.target.value)}
            />
          </Input.Group>
        </div>
        <div className="filter">
          <h3>Zone Ranges</h3>
          <Space>
            <Input
              addonBefore="Zone A"
              value={aCircleCenter.r}
              onChange={(event) =>
                setACircleCenter({ ...aCircleCenter, r: event.target.value })
              }
            />
            <Input
              addonBefore="Zone B"
              value={bCircleCenter.r}
              onChange={(event) =>
                setBCircleCenter({ ...bCircleCenter, r: event.target.value })
              }
            />
          </Space>
        </div>
        <h3>Restaurants</h3>
        <Space direction="vertical" size="middle">
          <Input.Search
            value={searchValue}
            placeholder="Search..."
            onChange={(event) => setSearchValue(event.target.value)}
            style={{ width: "400px" }}
          />
          {inBoundRestaurants
            .filter(({ name }) =>
              name.toLowerCase().startsWith(searchValue.toLowerCase())
            )
            .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
            .map((restaurant) => {
              return <Restaurant {...restaurant} />;
            })}
        </Space>
      </div>
      <svg className="map-canvas">
        <g>{bayAreaRegions}</g>
        <g>
          <circle
            id="draggable-circle-a"
            r={aCircleCenter.r}
            cx={aCircleCenter.x}
            cy={aCircleCenter.y}
            fill="rgba(255, 0, 0, 0.19)"
          />
          <circle
            id="draggable-circle-b"
            r={bCircleCenter.r}
            cx={bCircleCenter.x}
            cy={bCircleCenter.y}
            fill="rgba(255, 0, 0, 0.19)"
          />
        </g>
        <g>{circles}</g>
      </svg>
      <div id="tooltip" style={tooltipStyles} />
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import * as d3 from "d3";

export const useMap = () => {
  const [mapData, setMapData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    d3.json("map.json")
      .then((data) => {
        setMapData(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  return { mapData, loading };
};

import { useState, useEffect } from "react";
import * as d3 from "d3";

export const useRestaurants = (lowerRating, upperRating) => {
  const [restaurantsData, setRestaurantsData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    d3.csv("restaurants.csv")
      .then((data) => {
        setRestaurantsData(
          data.filter((datum) => {
            if (
              parseFloat(datum.rating) <= upperRating &&
              parseFloat(datum.rating) >= lowerRating
            ) {
              return datum;
            }
          })
        );
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, [lowerRating, upperRating]);

  return { restaurantsData, loading };
};

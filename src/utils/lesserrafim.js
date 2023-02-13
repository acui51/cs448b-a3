export const lesserrafim = ({ x, y, centerX, centerY, radius }) => {
  const distance = Math.sqrt(
    Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
  );

  return distance <= radius;
};

export const getPositionRole = (positionCode: number): string => {
  console.log("jey", positionCode);

  switch (positionCode) {
    case 1:
      return "GK";
    case 2:
      return "DEF";
    case 3:
      return "MID";
    case 4:
      return "ATT";
    default:
      return "UNK";
  }
};

export const calculateAttribute = (value: number | string): number => {
  // Check if the value is within the specified range
  const parsedValue = Number(value);

  if (parsedValue < 0 || parsedValue > 255) {
    throw new Error("Value is outside the specified range.");
  }

  // Perform the linear mapping
  const fromRange = 255 - 0;
  const toRange = 99 - 0;

  const scaledValue = (parsedValue - 0) * (toRange / fromRange) + 0;

  // Round the result to the nearest integer
  return Math.round(scaledValue);
};

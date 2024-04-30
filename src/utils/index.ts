export const TOKEN_ADDRESS = "0xd48c7B8e94FCb73dC1f81d7CE29392d908c2564D";
export const GAME_ADDRESS = "0xbFC3a250ACa9Af6f3399D2056BDB5786f9Ec6b3e";

export const getPositionRole = (positionCode: number): string => {
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

export const isValidPlacement = (playerPosition: string, gridIndex: number) => {
  if (playerPosition === "GK" && gridIndex !== 0) {
    return false;
  } else if (playerPosition === "DEF" && gridIndex !== 1) {
    return false;
  } else if (playerPosition === "MID" && gridIndex !== 2) {
    return false;
  } else if (playerPosition === "ATT" && gridIndex !== 3) {
    return false;
  }

  return true;
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

export const getTeamName = (id: string) => {
  switch (id) {
    case "1":
      return "a";
    case "2":
      return "b";
    case "3":
      return "c";
    case "4":
      return "d";
    case "5":
      return "e";
    case "6":
      return "f";
    default:
      return "Unknown";
  }
};


export const truncateAddress = (address: string) => {
  if (address && address.length <= 6) return address; // No need to truncate if the address is too short

  const prefix = address.slice(0, 4); // Typically "0x"
  const suffix = address.slice(-4); // The last 4 characters

  return `${prefix}...${suffix}`;
};

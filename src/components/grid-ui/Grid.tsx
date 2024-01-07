"use client";

import { PlayerType } from "../Game";
import GridSlot from "./GridSlot";

interface IGrid {
  formation: string;
  grid: (PlayerType | null)[];
  movePlayer: (playerId: number, slot: number) => void;
  removePlayer: (playerId: number) => void;
}

const Grid: React.FC<IGrid> = ({
  formation,
  grid,
  movePlayer,
  removePlayer,
}) => {
  return (
    <div
      className={`w-[90vh] justify-items-center items-center content-center grid grid-cols-${formation}`}
    >
      {grid.map((player, index) => (
        <GridSlot
          isDisabled={false}
          key={index}
          slot={index}
          player={player}
          movePlayer={movePlayer}
          removePlayer={removePlayer}
        />
      ))}
    </div>
  );
};
// const getGridClass = (formation: string): string => {
//   // Implement the logic to determine the grid class based on the formation
//   // You can use a switch statement or any other logic here
//   // Example:
//   switch (formation) {
//     case "4-4-2":
//       return "grid-cols-4 grid-rows-4"; // Customize as needed
//     case "3-5-2":
//       return "grid-cols-3 grid-rows-5"; // Customize as needed
//     default:
//       return "grid-cols-4 grid-rows-4"; // Default grid class
//   }
// };

export default Grid;

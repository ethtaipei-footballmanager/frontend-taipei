import React from "react";
import { PlayerType } from "../Game";
import JerseySVG from "../Jersey";
import Player from "../Player";

interface IGridSlot {
  player: PlayerType | null;
  formationPart: string;
  slot: number;
  isDisabled: boolean;
  rowIndex: number;
  selectedPlayer: number;
  isGoalkeeper: boolean;
  movePlayer: (val0: number, val1: number, val2: number) => void;
  removePlayer: (val0: number) => void;
}

const GridSlot: React.FC<IGridSlot> = ({
  slot,
  player,
  movePlayer,
  isDisabled,
  isGoalkeeper,
  formationPart,
  selectedPlayer,
  removePlayer,
  rowIndex,
}) => {
  const jerseyColor = isGoalkeeper ? "rgba(255,0,0,1)" : "#164f6b";

  return (
    <div
      onClick={() => {
        if (!player) {
          console.log("clicked", slot, rowIndex);

          movePlayer(selectedPlayer, rowIndex, slot);
        } else {
          removePlayer(player.id || 0);
        }
      }}
      className={`w-20 h-20 relative flex flex-col ${
        isDisabled ? "cursor-not-allowed" : ""
      }`}
    >
      <div>
        <span className="w-20 absolute h-20">
          <JerseySVG fillColor={jerseyColor} />
        </span>
        <p className="text-xl -mt-4">{`${slot}, ${rowIndex}`}</p>
        {player && !isDisabled && (
          <Player
            removePlayer={removePlayer}
            player={player}
            movePlayer={movePlayer}
            isActive={true}
          />
        )}
      </div>
    </div>
  );
};

export default GridSlot;

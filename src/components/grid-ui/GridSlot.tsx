import React from "react";
import { useDrop } from "react-dnd";
import { PlayerType } from "../Game";
import JerseySVG from "../Jersey";
import Player from "../Player";
interface IGridSlot {
  player: PlayerType | null;
  formationPart: string;
  slot: number;
  isDisabled: boolean;
  movePlayer: (val0: number, val1: number) => void;
  removePlayer: (val0: number) => void;
}

const GridSlot: React.FC<IGridSlot> = ({
  slot,
  player,
  movePlayer,
  isDisabled,
  formationPart,
  removePlayer,
}) => {
  console.log("log", slot);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "player",
      canDrop: () => !isDisabled,
      drop: () => ({ slot }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [isDisabled]
  );
  const jerseyColor = player?.position === "GK" ? "rgba(255,0,0,1)" : "#164f6b";

  return (
    <div
      ref={drop}
      className={`w-12 h-12 relative flex flex-col ${
        isDisabled ? "cursor-not-allowed" : ""
      }`}
    >
      <div>
        <span className="w-20 absolute h-20">
          <JerseySVG fillColor={jerseyColor} />
        </span>
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

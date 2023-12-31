"use client";

import React from "react";
import { useDrop } from "react-dnd";
import { PlayerType } from "../Game";
import Player from "../Player";

interface IGridSlot {
  player: PlayerType | null;
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
  removePlayer,
}) => {
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

  // console.log("48", player);

  return (
    <div
      ref={drop}
      className={` flex w-full h-full ${
        isDisabled ? "cursor-not-allowed" : ""
      }`}
    >
      {player && !isDisabled && (
        <Player
          removePlayer={removePlayer}
          player={player}
          movePlayer={movePlayer}
          isActive={true}
        />
      )}
    </div>
  );
};

export default GridSlot;

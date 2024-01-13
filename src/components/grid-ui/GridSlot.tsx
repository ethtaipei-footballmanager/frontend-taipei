import React from "react";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { GiCancel } from "react-icons/gi";
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
  isSelecting: boolean;
  movePlayer: (val0: number, val1: number, val2: number) => void;
  removePlayer: (val0: number) => void;
  setIsSelecting: (val: boolean) => void;
  replacePlayer: (val: number) => void;
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
  isSelecting,
  setIsSelecting,
  replacePlayer,
}) => {
  const jerseyColor = isGoalkeeper ? "rgba(255,0,0,1)" : "#164f6b";
  console.log("player30", player);
  // const isValid = isValidPlacement(selectedPlayer)
  return (
    <div
      onClick={() => {
        setIsSelecting(true);
        if (!player) {
          console.log("clicked", slot, rowIndex);

          movePlayer(selectedPlayer, rowIndex, slot);
        }
      }}
      className={`w-20 h-20 relative flex  flex-col ${
        isDisabled ? "cursor-not-allowed" : ""
      } ${isSelecting ? " " : ""}`}
    >
      {isSelecting && (
        <div className="absolute flex justify-end mx-auto w-[90%] -top-1.5 left-1">
          {/* <FaExchangeAlt
            onClick={() => {
              if (player) {
                replacePlayer(player.id);
              }
            }}
            className="hover:text-red-500 z-10 stroke-current"
          /> */}
          {player && (
            <GiCancel
              onClick={() => removePlayer(player?.id as number)}
              className=" hover:text-red-500 ease-in-out transition-colors duration-150 z-10 stroke-current "
            />
          )}
        </div>
      )}
      <div>
        <span className="w-20 absolute h-20">
          <JerseySVG fillColor={jerseyColor} />
        </span>
        {isSelecting && (
          <span className=" absolute left-[32%] top-[25%]">
            <CgArrowsExchangeAlt className="h-6 w-6" />
          </span>
        )}

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

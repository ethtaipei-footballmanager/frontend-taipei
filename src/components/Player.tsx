"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { useDrag } from "react-dnd";
import { PlayerType } from "./Game";

interface IPlayer {
  player: PlayerType;
  movePlayer: (val0: number, val1: number) => void;
  removePlayer?: (val0: number) => void;
  isActive: boolean;
}

type DropResult = {
  slot?: number;
};

function mapValue(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number {
  // Check if the value is within the specified range
  if (value < fromMin || value > fromMax) {
    throw new Error("Value is outside the specified range.");
  }

  // Perform the linear mapping
  const fromRange = fromMax - fromMin;
  const toRange = toMax - toMin;

  const scaledValue = (value - fromMin) * (toRange / fromRange) + toMin;

  // Round the result to the nearest integer
  return Math.round(scaledValue);
}

const Player: React.FC<IPlayer> = ({
  player,
  movePlayer,
  removePlayer,
  isActive,
}) => {
  const [, drag] = useDrag(() => ({
    type: "player",
    item: { id: player.id },
    // canDrag: false,
    end: (item, monitor) => {
      const dropResult: DropResult | null = monitor.getDropResult();
      if (item && dropResult!.slot) {
        movePlayer(item.id, dropResult!.slot);
      }
    },
  }));
  console.log("player", player.image);

  const handleDoubleClick = () => {
    console.log("doulbe");
    if (removePlayer) removePlayer(player.id);
  };

  return (
    // <Card
    //   onDoubleClick={handleDoubleClick}
    //   className={`flex  bg-white ${
    //     isActive ? "w-2/3 h-28 p-2 opacity-80" : "w-full h-32 p-4 "
    //   } shadow-lg    transition duration-200 ease-in-out hover:scale-105 `}
    // >
    //   <div
    //     ref={drag}
    //     className={`flex relative  ${
    //       !isActive
    //         ? " w-full h-full items-center justify-between"
    //         : "w-full h-full"
    //     } `}
    //   >
    //     <div className="flex items-center">
    //       <img
    //         src={player.image}
    //         alt={player.name}
    //         className={`${isActive ? "w-16 h-16  " : "w-20 h-20"} `}
    //       />
    //     </div>
    //     <div
    //       className={`text-black h-full flex flex-col items-center ${
    //         isActive ? "gap-1" : "gap-2"
    //       }`}
    //     >
    //       <p className="font-bold text-lg whitespace-nowrap">{player.name}</p>
    //       <p className="">
    //         <span className="font-bold">A:</span> {player.attackScore}
    //       </p>
    //       <p className="">
    //         <span className="font-bold">D:</span> {player.defenseScore}
    //       </p>
    //     </div>
    //   </div>
    // </Card>
    <Card className="w-full relative h-32 flex justify-end items-end mx-auto bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-200 ease-in-out">
      <CardHeader className="w-full flex  flex-grow">
        <div className="flex  items-end absolute left-1 top-4  justify-end  ">
          <Avatar className=" w-10 h-10 ">
            <AvatarImage src={player.image} />
            <AvatarFallback className="hidden">FP</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="-mt-10 -ml-2  flex  w-[100%]  h-full items-end  justify-start flex-col ">
        <div className=" absolute left-4 top-2 flex flex-col  items-center flex-grow w-full">
          <h1 className="text-gray-700 font-bold text-xl">{player.name}</h1>
          <p className="mt-2 text-gray-600 text-sm whitespace-nowrap">
            Forward
          </p>
        </div>
        <div className="flex absolute bottom-0 left-3 items-center gap-2 mx-auto  justify-between  py-4 ">
          <Badge
            className="items-center whitespace-nowrap py-2"
            variant="outline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 mr-2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            {mapValue(player.defenseScore, 0, 255, 0, 99)}
          </Badge>
          <Badge
            className="items-center whitespace-nowrap py-2"
            variant="outline"
          >
            <svg
              className="h-3.5 w-3.5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
              <line x1="13" x2="19" y1="19" y2="13" />
              <line x1="16" x2="20" y1="16" y2="20" />
              <line x1="19" x2="21" y1="21" y2="19" />
            </svg>
            {mapValue(player.attackScore, 0, 255, 0, 99)}
          </Badge>
        </div>
      </CardContent>
      {/* <CardFooter>
        <div className="flex justify-center px-4 py-2">
          <Button variant="link">View More</Button>
        </div>
      </CardFooter> */}
    </Card>
  );
};
export default Player;

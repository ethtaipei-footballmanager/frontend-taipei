"use client";

import { useEffect, useState } from "react";
import { useNewGameStore } from "../create-game/store";
import { useGameStore } from "../state/gameStore";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Event,
  EventType,
  EventsFilter,
  GetEventsResponse,
  getEvents,
} from "@puzzlehq/sdk";

export const getAllPuzzleWalletEvents = async () => {
  const filter: EventsFilter = {
    type: EventType.Execute,
    programId: "football_game_v012.aleo",
  };
  const events: GetEventsResponse = await getEvents(filter);
  console.log("🚀 ~ getAllPuzzleWalletEvents ~ events:", events);
  return events.events;
};

interface IPage {}

const Page: React.FC<IPage> = ({}) => {
  const [allEvents, setAllEvents] = useState<Event[] | undefined>();
  const getEvents = async () => {
    const walletEvents = await getAllPuzzleWalletEvents();
    setAllEvents(walletEvents!);
  };

  useEffect(() => {
    getEvents();
  }, []);

  const [yourTurn, theirTurn, totalBalance] = useGameStore((state) => [
    state.yourTurn,
    state.theirTurn,
    state.totalBalance,
  ]);
  const [initialize] = useNewGameStore((state) => [state.initialize]);

  return (
    <div>
      {allEvents?.map((event, index) => {
        if (
          event.functionId == "propose_game" ||
          event.functionId == "accept_game"
        ) {
          return (
            <Card className="w-full  rounded-sm px-2 py-2 " key={index}>
              <CardTitle className="text-sm flex justify-between">
                Status:{" "}
                <Badge
                  variant={
                    (event.status == "Pending" && "destructive") || "default"
                  }
                >
                  {event.status}
                </Badge>
              </CardTitle>
              <CardContent className="mt-2 p-0">
                <div className="flex flex-col gap-2">
                  <p className="text-sm">
                    <span className="font-bold">Bet Amount: </span>{" "}
                    <span className="text-red-300">
                      {parseInt(event.inputs[0]!)}
                    </span>{" "}
                    Fortune Credits
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm">
                    <span className="font-bold">Bet: </span>{" "}
                    <span className="text-red-300">
                      {parseInt(event.inputs[1]!)}
                    </span>{" "}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm">
                    <span className="font-bold">Game ID: </span>{" "}
                    <span className="text-red-300">{event._id!}</span>{" "}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        }
      })}
    </div>
  );
};
export default Page;

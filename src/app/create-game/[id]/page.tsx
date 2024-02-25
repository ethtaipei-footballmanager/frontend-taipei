"use client";

import { useGameStore } from "@/app/state/gameStore";
import GameCard from "@/components/GameCard";
import { useAccount, useEvent } from "@puzzlehq/sdk";
import { format } from "date-fns";
import { useNewGameStore } from "../store";
interface IPage {}

const Page: React.FC<IPage> = ({}) => {
  const { account } = useAccount();

  const [theirTurn, totalBalance] = useGameStore((state) => [
    state.theirTurn,
    state.totalBalance,
  ]);

  const [inputs, eventId] = useNewGameStore((state) => [
    state.inputs,
    state.eventId,
  ]);
  console.log("🚀 ~ inputs:", inputs, eventId);
  const game_multisig = inputs?.game_multisig;

  const { event } = useEvent({ id: eventId });
  console.log("🚀 ~ yourTurn:", theirTurn, totalBalance);
  return (
    <section className="w-full h-[50vh] flex items-center justify-center ">
      <GameCard
        playerOne={inputs?.wager_record?.owner ?? ""}
        playerTwo={inputs?.opponent ?? ""}
        date={format(new Date(inputs?.wager_record?.timestamp!), "do MMM yyyy")}
        state={""}
      />
    </section>
  );
};
export default Page;

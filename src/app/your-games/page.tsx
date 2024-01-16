"use client";

import { useNewGameStore } from "../create-game/store";
import { useGameStore } from "../state/gameStore";

interface IPage {}

const Page: React.FC<IPage> = ({}) => {
  const [yourTurn, theirTurn, totalBalance] = useGameStore((state) => [
    state.yourTurn,
    state.theirTurn,
    state.totalBalance,
  ]);
  const [initialize] = useNewGameStore((state) => [state.initialize]);

  return <div></div>;
};
export default Page;

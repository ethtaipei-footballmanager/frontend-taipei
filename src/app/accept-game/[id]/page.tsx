"use client";

import Game from "@/components/Game";
import { useAcceptGameStore } from "../store";

interface IPage {}

const Page: React.FC<IPage> = ({}) => {
  const [acceptedSelectedTeam] = useAcceptGameStore((state: any) => [
    state.setAcceptedSelectedTeam,
  ]);
  return (
    <>
      <Game selectedTeam={acceptedSelectedTeam} />
    </>
  );
};
export default Page;

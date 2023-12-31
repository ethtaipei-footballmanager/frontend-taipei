"use client";

import Game from "@/components/Game";
import TeamSelection from "@/components/TeamSelection";
import { useState } from "react";

interface ICreateGame {}

const CreateGame: React.FC<ICreateGame> = ({}) => {
  const [selectedTeam, setSelectedTeam] = useState(1);
  const [isGameStarted, setIsGameStarted] = useState(false);

  return (
    <div className="">
      {isGameStarted ? (
        <Game selectedTeam={selectedTeam} />
      ) : (
        <TeamSelection
          setSelectedTeam={setSelectedTeam}
          selectedTeam={selectedTeam}
          setIsGameStarted={setIsGameStarted}
        />
      )}
    </div>
  );
};
export default CreateGame;

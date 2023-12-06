"use client";

import TeamSelection from "@/components/TeamSelection";

interface ICreateGame {}

const CreateGame: React.FC<ICreateGame> = ({}) => {
  return (
    <div>
      <TeamSelection />
    </div>
  );
};
export default CreateGame;

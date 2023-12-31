"use client";

import { teams } from "@/utils/team-data";
import { csv } from "d3";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Player from "./Player";
import SelectFormation from "./SelectFormation";
import Grid from "./grid-ui/Grid";
import { Button } from "./ui/button";
interface IGame {
  selectedTeam: number;
}

export type PlayerType = {
  id: number;
  name: string;
  team: string;
  image: string;
  attackScore: number;
  defenseScore: number;
};

const Game: React.FC<IGame> = ({ selectedTeam }) => {
  const [benchPlayers, setBenchPlayers] = useState<PlayerType[]>([]);
  const [activePlayers, setActivePlayers] = useState<PlayerType[]>([]);
  const [currentPlayers, setCurrentPlayers] = useState<PlayerType[]>([]);
  const [totalAttack, setTotalAttack] = useState(0);
  const [totalDefense, setTotalDefense] = useState(0);
  // const [opponentTotalDefense, setOpponentTotalDefense] = useState(0);
  // const [opponentTotalAttack, setOpponentTotalAttack] = useState(0);
  const [selectedFormation, setSelectedFormation] = useState("4-3-3");
  const [grid, setGrid] = useState<(PlayerType | null)[]>(
    Array.from({ length: 16 }, () => null)
  );

  const activePlayersCount = activePlayers.filter(Boolean).length;

  const movePlayer = (playerId: number, slot: number) => {
    setCurrentPlayers((prevCurrentPlayers: PlayerType[]) => {
      const newCurrentPlayers = [
        ...prevCurrentPlayers,
        benchPlayers![playerId],
      ];
      return newCurrentPlayers;
    });

    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      const playerIndexOnField = activePlayers.findIndex(
        (p) => p?.id === playerId
      );
      const playerIndexOnBench = benchPlayers!.findIndex(
        (p) => p.id === playerId
      );

      if (playerIndexOnBench !== -1) {
        // Remove the player from the bench
        setBenchPlayers((prevPlayers) =>
          prevPlayers.filter((p) => p.id !== playerId)
        );

        // Add the player to the field
        setActivePlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers];
          const formationColumns = selectedFormation.split("-").map(Number)[0];
          const rowIndex = Math.floor(slot / formationColumns);
          const colIndex = slot % formationColumns;
          updatedPlayers[rowIndex * formationColumns + colIndex] =
            benchPlayers[playerIndexOnBench];
          return updatedPlayers;
        });
      }
      newGrid[slot] = benchPlayers[playerIndexOnBench];

      // Update the newGrid with the correct player object

      return newGrid;
    });
  };

  const removePlayer = (playerId: number) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      const playerIndexOnField = activePlayers.findIndex(
        (p) => p?.id === playerId
      );

      // Check if the player is on the field
      if (playerIndexOnField !== -1) {
        // Remove the player from the field
        setActivePlayers((prevPlayers: any) =>
          prevPlayers.map((p: PlayerType, index: number) => {
            if (index === playerIndexOnField) {
              return p;
            }
          })
        );

        // Check if the player is not already on the bench
        const isPlayerOnBench = benchPlayers.some((p) => p.id === playerId);
        if (!isPlayerOnBench) {
          // Add the player back to the bench with sorted order
          setBenchPlayers((prevPlayers) =>
            [...prevPlayers, activePlayers[playerIndexOnField]].sort(
              (a, b) => a.id - b.id
            )
          );
        }
      }

      return newGrid;
    });
  };

  useEffect(() => {
    // Fetch and parse the CSV data on component mount
    csv("/players.csv").then((data) => {
      console.log("data 95", data, selectedTeam);
      // Filter the data for the selected team and set the players state
      const teamPlayers = data
        .filter((player) => player.team_id === teams[selectedTeam].id) // Filter by selectedTeam
        .map((player) => ({
          id: parseInt(player.id),
          name: player.player_name,
          team: player.team,
          goalkeeper: player.goalkeeper,
          image: `/player_a.svg`,
          speed: player.speed,
          power: player.power,
          stamina: player.stamina,
          technique: player.technique,
          goalkeeping: player.goalkeeping,
          attackScore: Number(player.attack),
          defenseScore: Number(player.defense),
        }))
        .sort((a, b) => a.id - b.id);

      setBenchPlayers(teamPlayers);
    });
  }, []);

  useEffect(() => {
    // Calculate total attack and defense whenever activePlayers changes
    console.log("346", activePlayers);
    const newTotalAttack = activePlayers.reduce(
      (sum, player) => (player ? sum + player.attackScore : sum),
      0
    );
    const newTotalDefense = activePlayers.reduce(
      (sum, player) => (player ? sum + player.defenseScore : sum),
      0
    );

    // Update the state with the new totals
    setTotalAttack(newTotalAttack);
    setTotalDefense(newTotalDefense);
  }, [activePlayers]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-row px-16 py-8 bg-white h-[90vh] overflow-hidden w-full gap-4">
        <div className=" relative bg-field grid grid-cols-4  bg-cover  object-contain bg-center max-h-[85vh]  bg-no-repeat w-full   ">
          <div className="absolute left-4 top-4">
            <SelectFormation
              selectedFormation={selectedFormation}
              setSelectedFormation={setSelectedFormation}
            />
          </div>

          {/* <div className="mt-4 "> */}
          {/* {grid.map((player, index) => {
            const isDisabled = index === 0 || index === 8; // Disables the top left and bottom left slots in a 3x4 grid
            return (
              <GridSlot
                key={index}
                slot={index}
                player={player}
                movePlayer={movePlayer}
                isDisabled={isDisabled}
                removePlayer={removePlayer}
              />
            );
          })} */}
          <Grid
            formation={selectedFormation}
            grid={grid}
            movePlayer={movePlayer}
            removePlayer={removePlayer}
          />
          {/* </div> */}
        </div>
        <div className="flex flex-col w-2/5 h-auto bg-black px-4 rounded-md">
          {activePlayersCount === 11 && (
            <div className="absolute right-24 top-36">
              <Button
                variant="outline"
                className="text-black"
                // onClick={
                //   location.pathname === "create-game" ? startGame : joinGame
                // }
              >
                Start Game
              </Button>
            </div>
          )}
          <div className="flex flex-col py-4 px-4 whitespace-nowrap">
            <h1 className="text-xl tracking-tighter">
              Current Attack : {totalAttack}
            </h1>
            <h1 className="text-xl tracking-tighter">
              Current Defence : {totalDefense}
            </h1>
          </div>
          <div className="w-full grid grid-cols-2 gap-2 overflow-y-auto h-[calc(100vh_-_40px)] p-5">
            {benchPlayers!.map((player) => {
              return (
                <Player
                  key={player.id}
                  player={player}
                  movePlayer={movePlayer}
                  isActive={false}
                />
              );
            })}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};
export default Game;

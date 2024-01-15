"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
// import PageHeader from '@components/PageHeader';
// import Nav from '@components/Nav';
// import ChooseAlexLocation from '@components/ChooseAlexLocation';
import {
  EventStatus,
  EventType,
  requestCreateEvent,
  useAccount,
  useBalance,
} from "@puzzlehq/sdk";
import {
  AcceptGameInputs,
  GAME_FUNCTIONS,
  GAME_PROGRAM_ID,
  transitionFees,
} from "@state/manager.js";
import { useEffect, useState } from "react";
// import { Answer } from '@state/RecordTypes/football_game.js';
import { useMsRecords } from "@/hooks/msRecords.js";
import { isValidPlacement } from "@/utils";
import { teams } from "@/utils/team-data";
import { useGameStore } from "@state/gameStore.js";
import { useKeyPressEvent } from "react-use";
import { toast } from "sonner";
import { Step, useAcceptGameStore } from "../app//accept-game/store";
import { useEventHandling } from "../hooks/eventHandling.js";
import { PlayerType, initializeGrid } from "./Game";
import PlayerDetails from "./PlayerDetails";
import SelectFormation from "./SelectFormation";
import { renderStars } from "./TeamCard";
import Grid from "./grid-ui/Grid";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
const AcceptGame = () => {
  const [
    inputs,
    eventIdAccept,
    setInputs,
    setEventIdAccept,
    initializeAcceptGame,
    setStep,
  ] = useAcceptGameStore((state) => [
    state.inputsAcceptGame,
    state.eventIdAccept,
    state.setAcceptGameInputs,
    state.setEventIdAccept,
    state.initializeAcceptGame,
    state.setStep,
  ]);
  const [currentGame] = useGameStore((state) => [state.currentGame]);

  const msAddress = currentGame?.gameNotification.recordData.game_multisig;
  const { msPuzzleRecords, msGameRecords } = useMsRecords(msAddress);

  const { loading, error, event, setLoading, setError } = useEventHandling({
    id: eventIdAccept,
    address: msAddress,
    multisig: true,
    stepName: "Accept Game",
    onSettled: () => setStep(Step._03_Confirmed),
  });

  const { account } = useAccount();
  const { balances } = useBalance({});
  const balance = balances?.[0]?.public ?? 0;
  const [benchPlayers, setBenchPlayers] = useState<PlayerType[]>([]);
  const [activePlayers, setActivePlayers] = useState<PlayerType[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [movingPlayer, setMovingPlayer] = useState<PlayerType>();
  const [playerData, setPlayerData] = useState<PlayerType>();
  const [totalAttack, setTotalAttack] = useState(0);
  const [totalDefense, setTotalDefense] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedReplacementPlayer, setSelectedReplacementPlayer] =
    useState<PlayerType | null>(null);
  // const [opponentTotalDefense, setOpponentTotalDefense] = useState(0);
  // const [opponentTotalAttack, setOpponentTotalAttack] = useState(0);
  const [selectedFormation, setSelectedFormation] = useState("4-4-2");
  const [formationSplitted, setFormationSplitted] = useState(
    selectedFormation.split("-")
  );
  const [grid, setGrid] = useState<any>(initializeGrid(selectedFormation, []));
  useKeyPressEvent("Escape", () => setIsSelecting(false));
  // const [grid, setGrid] = useState<any>([
  //   Array.from({ length: 1 }, () => null),
  //   Array.from({ length: Number(formationSplitted[0]) ?? 4 }, () => null),
  //   Array.from({ length: Number(formationSplitted[1]) ?? 4 }, () => null),
  //   Array.from({ length: Number(formationSplitted[2]) ?? 2 }, () => null),
  // ]);

  const activePlayersCount = activePlayers.filter(Boolean).length;
  console.log("formationSplitted", formationSplitted[2]);

  const movePlayer = (playerId: number, gridIndex: number, slot: number) => {
    console.log("Moving player with ID:", playerId);
    console.log("To grid index:", gridIndex);
    console.log("To slot:", slot);

    const playerIndexOnBench = benchPlayers.findIndex(
      (p) => p?.id === playerId
    );

    // Validate if the player can be placed in the specified grid position
    if (
      !isValidPlacement(benchPlayers[playerIndexOnBench]?.position, gridIndex)
    ) {
      toast.error("Invalid placement for the player.");
      setIsSelecting(false);
      return;
    }

    setGrid((prevGrid: any) => {
      const newGrid = [...prevGrid];
      console.log("Previous Grid:", prevGrid);

      console.log("Player Index on Bench:", playerIndexOnBench);

      // Remove the player from the bench
      setBenchPlayers((prevPlayers) =>
        prevPlayers.filter((p) => p.id !== playerId)
      );
      setActivePlayers((prevPlayers) => {
        const updatedPlayers = [...prevPlayers];
        const existingPlayerIndex = updatedPlayers.findIndex(
          (p) => p?.id === benchPlayers[playerIndexOnBench]?.id
        );

        if (existingPlayerIndex === -1) {
          updatedPlayers.push(benchPlayers[playerIndexOnBench]);
        }

        return updatedPlayers;
      });

      newGrid[gridIndex][slot] = benchPlayers[playerIndexOnBench];
      console.log("New Grid:", newGrid, activePlayers);

      return newGrid;
    });

    setIsSelecting(false);
  };

  const replacePlayer = (playerId: number) => {
    const playerToReplace = activePlayers.find(
      (player) => player?.id === playerId
    );
    if (playerToReplace) {
      // Set the player to be replaced in the state
      setSelectedReplacementPlayer(playerToReplace);
    }
  };

  useEffect(() => {
    console.log("format", selectedFormation.split("-"));

    setFormationSplitted(selectedFormation.split("-"));

    setGrid((prevGrid: any) => initializeGrid(selectedFormation, prevGrid));
  }, [selectedFormation]);

  const startGame = async () => {
    console.log("active", activePlayers);

    if (activePlayers.length !== 11) {
      toast.info("Please select 11 players");
    } else {
      const createGame = await createEvent();
      console.log("🚀 ~ startGame ~ createGame:", createGame);
      toast.info("You have selected 11 ");
    }
  };

  const removePlayer = (playerId: number) => {
    setGrid((prevGrid: any) => {
      const newGrid = [...prevGrid];
      const playerIndexOnField = activePlayers.findIndex(
        (p) => p?.id === playerId
      );

      // Check if the player is on the field
      if (playerIndexOnField !== -1) {
        // Clear the slot in the grid
        const [rowIndex, slotIndex] = findPlayerLocation(newGrid, playerId);
        if (rowIndex !== -1 && slotIndex !== -1) {
          newGrid[rowIndex][slotIndex] = null;
        }

        // Remove the player from the field
        setActivePlayers((prevPlayers: any) =>
          prevPlayers.filter(
            (_: any, index: number) => index !== playerIndexOnField
          )
        );

        // Check if the player is not already on the bench
        const isPlayerOnBench = benchPlayers.some((p) => p.id === playerId);
        if (!isPlayerOnBench) {
          // Add the player back to the bench with sorted order
          setBenchPlayers((prevPlayers) => {
            const updatedBenchPlayers = [...prevPlayers];

            // Ensure the player is not already on the bench
            const isPlayerOnBench = updatedBenchPlayers.some(
              (p) => p.id === playerId
            );
            if (!isPlayerOnBench) {
              updatedBenchPlayers.push(activePlayers[playerIndexOnField]);
            }

            return updatedBenchPlayers.sort((a, b) => a.id - b.id);
          });
        }
      }

      return newGrid;
    });
  };

  const findPlayerLocation = (
    grid: any[],
    playerId: number
  ): [number, number] => {
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      const slotIndex = grid[rowIndex].findIndex(
        (player: PlayerType) => player?.id === playerId
      );
      if (slotIndex !== -1) {
        return [rowIndex, slotIndex];
      }
    }
    return [-1, -1]; // Player not found on the grid
  };

  useEffect(() => {
    // Fetch and parse the CSV data on component mount
    csv("/players.csv").then((data) => {
      console.log("data 95", data, selectedTeam);
      // Filter the data for the selected team and set the players state
      const teamPlayers = data
        .filter((player) => player.team_id === teams[selectedTeam].id) // Filter by selectedTeam
        .map((player) => ({
          id: parseInt(player.player_uid),
          name: player.player_name,
          team: player.team,
          position: getPositionRole(Number(player.position)),
          goalkeeper: player.goalkeeper,
          image: `/player_a.svg`,
          speed: calculateAttribute(player.speed),
          power: calculateAttribute(player.power),
          stamina: calculateAttribute(player.stamina),
          technique: calculateAttribute(player.technique),
          goalkeeping: calculateAttribute(player.goalkeeping),
          attackScore: calculateAttribute(player.attack),
          defenseScore: calculateAttribute(player.defense),
        }))
        .sort((a, b) => a.id - b.id);
      console.log("player0", teamPlayers[0]);

      setBenchPlayers(teamPlayers);
      setSelectedPlayer(teamPlayers[0].id);
      setPlayerData(teamPlayers[0]);
    });
  }, []);

  useEffect(() => {
    csv("/players.csv").then((data) => {
      console.log("123", data, selectedPlayer);
      // Filter the data for the selected team and set the players state
      const player = data
        .filter((player) => Number(player.player_uid) === selectedPlayer) // Filter by selectedTeam
        .map((player) => ({
          id: parseInt(player.player_uid),
          name: player.player_name,
          team: player.team,
          position: getPositionRole(Number(player.position)),
          goalkeeper: player.goalkeeper,
          image: `/player_a.svg`,
          speed: calculateAttribute(player.speed),
          power: calculateAttribute(player.power),
          stamina: calculateAttribute(player.stamina),
          technique: calculateAttribute(player.technique),
          goalkeeping: calculateAttribute(player.goalkeeping),
          attackScore: calculateAttribute(player.attack),
          defenseScore: calculateAttribute(player.defense),
        }));
      console.log("player", player[0]);

      setPlayerData(player[0]);
    });
  }, [selectedPlayer]);

  console.log("selected", selectedPlayer);

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

  const [searchParams, setSearchParams] = useSearchParams();

  // const { balances: msBalances } = useBalance({
  //   address: msAddress,
  //   multisig: true,
  // });
  // const msPublicBalance =
  //   msBalances && msBalances?.length > 0 ? msBalances[0].public : 0;

  useEffect(() => {
    if (!currentGame || !msPuzzleRecords || !msGameRecords) return;
    const piece_stake_challenger = msPuzzleRecords?.find(
      (r) =>
        r.data.ix === "3u32.private" &&
        r.data.challenger.replace(".private", "") ===
          currentGame.gameNotification.recordData.challenger_address &&
        r.data.staker.replace(".private", "") ===
          currentGame.gameNotification.recordData.challenger_address
    );
    const piece_claim_challenger = msPuzzleRecords.find(
      (r) =>
        r.data.ix === "6u32.private" &&
        r.data.challenger.replace(".private", "") ===
          currentGame.gameNotification.recordData.challenger_address &&
        r.data.claimer.replace(".private", "") ===
          currentGame.gameNotification.recordData.challenger_address
    );
    const piece_stake_opponent = msPuzzleRecords.find(
      (r) =>
        r.data.ix === "3u32.private" &&
        r.data.opponent.replace(".private", "") ===
          currentGame.gameNotification.recordData.opponent_address &&
        r.data.staker.replace(".private", "") ===
          currentGame.gameNotification.recordData.opponent_address
    );
    const piece_claim_opponent = msPuzzleRecords.find(
      (r) =>
        r.data.ix === "6u32.private" &&
        r.data.opponent.replace(".private", "") ===
          currentGame.gameNotification.recordData.opponent_address &&
        r.data.claimer.replace(".private", "") ===
          currentGame.gameNotification.recordData.opponent_address
    );

    console.log("msGameRecords[0]", msGameRecords[0]);
    console.log("piece_stake_challenger", piece_stake_challenger);
    console.log("piece_claim_challenger", piece_claim_challenger);
    console.log("piece_stake_opponent", piece_stake_opponent);
    console.log("piece_claim_opponent", piece_claim_opponent);
    if (
      piece_claim_challenger === undefined ||
      piece_claim_opponent === undefined ||
      piece_stake_challenger === undefined ||
      piece_stake_opponent === undefined ||
      msGameRecords[0] === undefined
    )
      return;
    initializeAcceptGame(
      msGameRecords[0],
      piece_stake_challenger,
      piece_claim_challenger,
      piece_stake_opponent,
      piece_claim_opponent
    );
  }, [
    currentGame?.gameNotification.recordData.game_multisig,
    [msPuzzleRecords, msGameRecords].toString(),
  ]);

  const createEvent = async () => {
    if (
      !inputs?.game_record ||
      !inputs?.opponent_answer ||
      !inputs.piece_stake_challenger ||
      !inputs.piece_claim_challenger ||
      !inputs.piece_stake_opponent ||
      !inputs.piece_claim_opponent
    )
      return;
    setLoading(true);
    setError(undefined);
    try {
      const response_block_ht = await fetch(
        "https://jigsaw-dev.puzzle.online/api/aleoapi/latest/height"
      );
      const block_ht = Number(await response_block_ht.json());
      const acceptGameInputs: Omit<
        AcceptGameInputs,
        "opponent_answer_readable"
      > = {
        game_record: inputs.game_record,
        opponent_answer: inputs.opponent_answer,
        piece_stake_challenger: inputs.piece_stake_challenger,
        piece_claim_challenger: inputs.piece_claim_challenger,
        piece_stake_opponent: inputs.piece_stake_opponent,
        piece_claim_opponent: inputs.piece_claim_opponent,
        block_ht: block_ht.toString() + "u32",
      };
      const response = await requestCreateEvent({
        type: EventType.Execute,
        programId: GAME_PROGRAM_ID,
        functionId: GAME_FUNCTIONS.accept_game,
        fee: transitionFees.accept_game,
        inputs: Object.values(acceptGameInputs),
        address: inputs.game_record.owner,
      });
      if (response.error) {
        setError(response.error);
        setLoading(false);
      } else if (!response.eventId) {
        setError("No eventId found!");
        setLoading(false);
      } else {
        console.log("success", response.eventId);
        setEventIdAccept(response.eventId);
        setSearchParams({ eventIdAccept: response.eventId });
      }
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  };

  const answer = inputs?.opponent_answer_readable;

  const disabled =
    !inputs?.game_record ||
    !inputs?.opponent_answer ||
    !inputs.piece_stake_challenger ||
    !inputs.piece_claim_challenger ||
    !inputs.piece_stake_opponent ||
    !inputs.piece_claim_opponent ||
    !answer;
  // msPublicBalance < transitionFees.accept_game + transitionFees.finish_game;

  const [buttonText, setButtonText] = useState("ACCEPT GAME");
  useEffect(() => {
    if (!loading) {
      setButtonText("ACCEPT GAME");
    } else if (event?.status === EventStatus.Creating) {
      setButtonText("CREATING EVENT...");
    } else if (event?.status === EventStatus.Pending) {
      setButtonText("EVENT PENDING...");
    }
  }, [loading, event?.status]);

  return (
    <div className="grid grid-rows-2 px-20 py-8 bg-white h-[90vh] overflow-hidden w-full ">
      <div className=" relative  grid grid-cols-4  gap-y-8  bg-center max-h-[85vh]  bg-no-repeat w-full   ">
        <div className="col-span-4  h-80 relative">
          <Image className="absolute z-0" src="/field.svg" fill alt="field" />
          <div className="grid grid-rows-4  items-start justify-center h-[100%] z-10">
            <div className="row-span-1">
              <Grid
                selectedPlayer={selectedPlayer!}
                rowIndex={3}
                isGoalkeeper={false}
                formation={formationSplitted[2]}
                grid={grid[3]}
                jersey={teams[selectedTeam].jersey}
                setIsSelecting={setIsSelecting}
                isSelecting={isSelecting}
                movePlayer={movePlayer}
                removePlayer={removePlayer}
                replacePlayer={replacePlayer}
              />
            </div>
            <div className="row-span-1">
              <Grid
                selectedPlayer={selectedPlayer!}
                rowIndex={2}
                isGoalkeeper={false}
                formation={formationSplitted[1]}
                grid={grid[2]}
                jersey={teams[selectedTeam].jersey}
                setIsSelecting={setIsSelecting}
                isSelecting={isSelecting}
                movePlayer={movePlayer}
                removePlayer={removePlayer}
                replacePlayer={replacePlayer}
              />
            </div>
            <div className="row-span-1">
              <Grid
                selectedPlayer={selectedPlayer!}
                rowIndex={1}
                isGoalkeeper={false}
                isSelecting={isSelecting}
                jersey={teams[selectedTeam].jersey}
                formation={formationSplitted[0]}
                setIsSelecting={setIsSelecting}
                grid={grid[1]}
                movePlayer={movePlayer}
                removePlayer={removePlayer}
                replacePlayer={replacePlayer}
              />
            </div>
            <div className="row-span-1 ">
              <Grid
                selectedPlayer={selectedPlayer!}
                rowIndex={0}
                isGoalkeeper={true}
                formation={"1"}
                isSelecting={isSelecting}
                jersey={teams[selectedTeam].jersey}
                setIsSelecting={setIsSelecting}
                grid={grid[0]} // Adjust the range based on your data
                movePlayer={movePlayer}
                replacePlayer={replacePlayer}
                removePlayer={removePlayer}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-start-3 col-span-1 row-start-1 row-span-2 flex flex-col gap-6">
        <Card className="shadow">
          <CardContent className="py-2">
            {/* <div className="absolute left-4 top-[90px]">
              <Button variant={"outline"} size={"icon"} className="">
                <IoIosArrowBack
                  onClick={() => setIsGameStarted(false)}
                  className="w-6 h-6"
                />
              </Button>
            </div> */}
            <div className="flex items-center justify-center flex-col">
              <h1 className="text-2xl font-bold">{teams[selectedTeam].name}</h1>
              <Image
                width={64}
                height={64}
                src={`/${teams[selectedTeam].image}.svg`}
                alt={teams[selectedTeam].name}
                className=""
              />

              {/* <div className="-ml-4">
                  {renderStars(
                    calculateStarRating(
                      teams[selectedTeam].attack,
                      teams[selectedTeam].defense
                    )
                  )}
                </div> */}
              <div className="flex w-full justify-between">
                <SelectFormation
                  selectedFormation={selectedFormation}
                  setSelectedFormation={setSelectedFormation}
                />
                <div className="mr-10">
                  {renderStars(
                    calculateStarRating(
                      teams[selectedTeam].attack,
                      teams[selectedTeam].defense
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {playerData && (
          <div className="">
            <PlayerDetails playerDetails={playerData!} />
          </div>
        )}
        <div className="w-full -mt-2 flex justify-center">
          <Button onClick={startGame} className="w-1/2" variant={"outline"}>
            Start Game
          </Button>
        </div>
      </div>
      <div className="row-start-2 flex flex-col w-full h-[270px] mt-12 border-gray-200 bg-[#f5f5f5] border-2 px-4 rounded-md">
        {/* <div className="flex flex-col px-4 whitespace-nowrap">
            <h1 className="text-xl tracking-tighter">
              Current Attack : {totalAttack}
            </h1>
            <h1 className="text-xl tracking-tighter">
              Current Defence : {totalDefense}
            </h1>
          </div> */}

        <ScrollArea className=" overflow-y-auto h-64 p-5">
          <div className="w-full grid grid-cols-5 gap-2  h-64 p-6 ">
            {benchPlayers!.map((player) => {
              return (
                <Player
                  key={player.name}
                  onPlayerClick={() => {
                    setMovingPlayer(player);
                    setSelectedPlayer(player.id);
                    setIsSelecting(true);
                  }}
                  player={player}
                  movePlayer={(playerId, slot) => movePlayer(playerId, 1, slot)}
                  isActive={false}
                />
              );
            })}
          </div>
          {/* {activePlayersCount !== 11 && (
              <div className="w-full flex justify-center">
                <Button className="w-1/2" variant={"outline"}>
                  Start Game
                </Button>
              </div>
            )} */}
        </ScrollArea>
      </div>
    </div>
  );
};

export default AcceptGame;

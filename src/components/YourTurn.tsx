import { useAcceptGameStore } from "@/app/accept-game/store";
import { useEventHandling } from "@/hooks/eventHandling";
import { useMsRecords } from "@/hooks/msRecords";
import { truncateAddress } from "@/utils";
import { RecordWithPlaintext } from "@puzzlehq/sdk";
//@ts-ignore
import { Game } from "@/app/your-games/page";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
//@ts-ignore
import Identicon from "react-identicons";
import { useAccount } from "wagmi";

interface IYourTurn {
  game: Game;
  isFinished: boolean;
}

const messageToSign = "Accept Game Challenge"; // TODO replace this by appropriate msg

const YourTurn: React.FC<IYourTurn> = ({ game, isFinished }) => {
  const router = useRouter();

  const { address } = useAccount();

  const [
    inputsSubmitWager,
    eventIdSubmit,
    acceptGameInputs,
    setSubmitWagerInputs,
    setEventIdSubmit,
    setStep,
    setAcceptedSelectedTeam,
    initializeAcceptGame,
  ] = useAcceptGameStore((state: any) => [
    state.inputsSubmitWager,
    state.eventIdSubmit,
    state.setAcceptGameInputs,
    state.setSubmitWagerInputs,
    state.setEventIdSubmit,
    state.setStep,
    state.setAcceptedSelectedTeam,
    state.initializeAcceptGame,
  ]);

  const msAddress = currentGame?.gameNotification.recordData.game_multisig;
  console.log("msAddress", msAddress);
  const { msPuzzleRecords: recordsPuzzle, msGameRecords: recordsGame } =
    useMsRecords(msAddress);
  const [msPuzzleRecords, setMsPuzzleRecords] = useState<
    RecordWithPlaintext[] | undefined
  >();
  const [msGameRecords, setMsGameRecords] = useState<
    RecordWithPlaintext[] | undefined
  >();

  const [isModal, setIsModal] = useState(false);
  const { loading, error, event, setLoading, setError } = useEventHandling({
    id: eventIdSubmit,
    stepName: "Submit Wager",
  });

  // TODO: Use results from fetchGameOutcome as input
  // const fetchGameOutcomeObject = async () => {
  //   try {
  //     const response = await fetch(
  //       `https://node.puzzle.online/testnet3/program/football_game_v014.aleo/mapping/game_outcomes/${game_id}`
  //     );

  //     const dataText = await response.text(); // Change this to text(), as JSON parsing fails

  //     console.log("Fetched data:", dataText); // Log the fetched data

  //     // Convert the dataText string into valid JSON format
  //     const cleanedDataString = dataText
  //       .replace(/(\\n|\\)/g, "") // Remove escaped characters and line breaks
  //       .replace(/'/g, '"') // Replace single quotes with double quotes to make it valid JSON
  //       .replace(/(\w+)\s*:/g, '"$1":') // Add double quotes around keys
  //       .replace(/:\s*([\w"]+)/g, ':"$1"'); // Add double quotes around values
  //     console.log("Cleaned data:", cleanedDataString); // Log the cleaned data
  //     const cleanedDataStringWithoutQuotes = cleanedDataString.slice(1, -1);
  //     console.log(
  //       "🚀 ~ fetchGameOutcome ~ cleanedDataStringWithoutQuotes:",
  //       cleanedDataStringWithoutQuotes
  //     );

  //     const cleanedDataStringTrimmed = cleanedDataStringWithoutQuotes.trim();

  //     console.log("Cleaned data trimmed:", cleanedDataStringTrimmed);

  //     // Parse the JSON data into an object
  //     // const data = JSON.parse(cleanedDataString.toString());
  //     const data = parseJson(cleanedDataStringTrimmed);
  //     console.log("Parsed data:", data);

  //     const matchOutcome = {
  //       address_home: data.address_home,
  //       address_away: data.address_away,
  //       team_id_home: data.team_id_home,
  //       team_id_away: data.team_id_away,
  //       goals_home: parseInt(data.goals_home.replace("u64", "")),
  //       goals_away: parseInt(data.goals_away.replace("u64", "")),
  //     };

  //     console.log("goals", matchOutcome.goals_home, matchOutcome.goals_away);
  //     setMatchOutcome(matchOutcome);

  //     return data;
  //     // If you need to access game_outcome later, you can do it after this line
  //   } catch (error) {
  //     console.error("There was an error fetching the game outcome:", error);
  //   }
  // };

  // TODO: Complete this
  // const createCalculateOutcomeEvent = async () => {
  //   const reveal_answer_notification_record =
  //     game.gameNotification.recordWithPlaintext;
  //   const challenger_answer_record = game.utilRecords.find(
  //     (r) =>
  //       r.data.owner.replace(".private", "") ===
  //       game.gameNotification.recordData.challenger_address
  //   );
  //   if (!reveal_answer_notification_record || !challenger_answer_record) {
  //     return;
  //   }

  //   const newInputs: Partial<CalculateOutcomeInputs> = {
  //     reveal_answer_notification_record: reveal_answer_notification_record, //todo
  //     challenger_answer_record: challenger_answer_record, // todo
  //   };

  //   // setCalculateOutcomeInputs(newInputs);
  //   const response = await requestCreateEvent({
  //     type: EventType.Execute,
  //     programId: GAME_PROGRAM_ID,
  //     functionId: GAME_FUNCTIONS.calculate_outcome,
  //     fee: transitionFees.calculate_outcome,
  //     inputs: Object.values(newInputs),
  //   });
  //   if (response.error) {
  //     setError(response.error);
  //     setLoading(false);
  //   } else if (response.eventId) {
  //     /// todo - other things here?
  //     setEventIdSubmit(response.eventId);
  //     setCurrentGame(game);
  //     // setCalculateOutcomeInputs({ ...newInputs });
  //     // router.push(`/accept-game/${response.eventId}`);
  //   }
  // };

  // const createRevealAnswerEvent = async () => {
  //   const calculated_outcome_notification_record =
  //     game.gameNotification.recordWithPlaintext;

  //   const challenger_claim_signature = game.puzzleRecords.find(
  //     (r) => r.data.ix.replace(".private", "") === "7u32"
  //   );

  //   const challenger_answer_record = game.utilRecords.find(
  //     (r) =>
  //       r.data.owner.replace(".private", "") ===
  //       game.gameNotification.recordData.challenger_address
  //   );

  //   const joint_piece_stake = game.puzzleRecords.find(
  //     (r) => r.data.ix.replace(".private", "") === "10u32"
  //   );

  //   const multisig = game.gameNotification.recordData.game_multisig;

  //   const game_outcome = await fetchGameOutcome();

  //   if (
  //     !calculated_outcome_notification_record ||
  //     !challenger_answer_record ||
  //     !joint_piece_stake ||
  //     !challenger_claim_signature ||
  //     !game_outcome
  //   ) {
  //     return;
  //   }

  //   const newInputs: Partial<RevealAnswerInputs> = {
  //     challenger_claim_signature: challenger_claim_signature,
  //     calculated_outcome_notification_record:
  //       calculated_outcome_notification_record,
  //     joint_piece_state: joint_piece_stake,
  //     challenger_answer_record: challenger_answer_record,
  //     game_outcome: game_outcome,
  //   };

  //   // setCalculateOutcomeInputs(newInputs);
  //   const response = await requestCreateEvent({
  //     type: EventType.Execute,
  //     programId: GAME_PROGRAM_ID,
  //     functionId: GAME_FUNCTIONS.reveal_answer,
  //     fee: transitionFees.reveal_answer,
  //     inputs: Object.values(newInputs),
  //   });
  //   if (response.error) {
  //     setError(response.error);
  //     setLoading(false);
  //   } else if (response.eventId) {
  //     /// todo - other things here?
  //     setEventIdSubmit(response.eventId);
  //     setCurrentGame(game);
  //     // setCalculateOutcomeInputs({ ...newInputs });
  //     // router.push(`/accept-game/${response.eventId}`);
  //   }
  // };

  const renderActionButton = () => {
    switch (game.gameAction) {
      case "Submit Wager":
        // return <SubmitWagerButton game={game} />;
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setCurrentGame(game);
                  setIsModal(true);
                }}
                variant="outline"
                className="tracking-wider text-sm text-black dark:text-white font-semibold flex gap-2.5"
              >
                Accept Game
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="flex gap-1 w-full flex-col justify-center items-center">
                <DialogTitle className=" tracking-lighter dark:text-white  text-[#25292e] text-[18px] ">
                  Would you like to accept the challenge from{" "}
                  <span className="font-extrabold"> {game.challenger}</span> for{" "}
                  <span className="font-extrabold">{game.wager}</span> FBC?
                </DialogTitle>

                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="flex justify-center gap-4 mt-2 text-center w-full items-center">
                <Button
                  disabled={loading}
                  onClick={createSubmitWagerEvent}
                  variant="outline"
                  className="flex flex-col gap-1 hover:text-white dark:hover:bg-[#dbe0e5]  bg-[#fafafa]   h-fit justify-center items-center"
                >
                  <span className="text-xs font-semibold text-black">
                    Submit
                  </span>{" "}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        );
      case "Accept":
        // return <AcceptGameButton game={game} />;
        return (
          <Button
            disabled={loading}
            onClick={() => {
              setCurrentGame(game);
              router.push(
                `/accept-game/${game.gameNotification.recordData.game_multisig}`
              );
            }}
            variant="outline"
            className="tracking-wider text-sm text-black dark:text-white font-semibold flex gap-2.5"
          >
            Accept
          </Button>
        );

      case "Reveal":
        return (
          <Button
            onClick={createRevealAnswerEvent} // TODO implement a simple wallet popup that consumes 2 records.
            variant="outline"
            className="tracking-wider text-sm text-black dark:text-white font-semibold flex gap-2.5"
          >
            Reveal outcome
          </Button>
        );

      case "Lose":
        return (
          <Button
            variant="outline"
            className="tracking-wider text-sm text-black dark:text-white font-semibold flex gap-2.5"
          >
            Lose
          </Button>
        );
    }
  };
  return (
    // <div className="mb-2 grid w-full grid-cols-[1fr,auto,1fr] items-center gap-5">
    //   <div className="my-auto self-center text-left text-xs font-bold tracking-tight text-primary-pink max-sm:ml-2">
    //     {truncateAddress(vs)}
    //   </div>
    //   <div className="my-auto self-center text-left text-xs font-bold tracking-tight text-primary-pink max-sm:ml-2">
    //     {wager} pieces
    //   </div>
    //   <div className="flex justify-end">{renderActionButton()}</div>
    // </div>
    <Card className="  w-52 grid-span-1 shadow-lg rounded-xl overflow-hidden">
      <div className="flex flex-col gap-4 justify-center items-center  p-6  sm:space-y-0">
        {/* <div className="flex w-full flex-col justify-between">
          <div>
            <Identicon string={truncateAddress(vs)} size={36} />

            <span className="font-semibold text-lg text-center">
              Challenger: <strong>{truncateAddress(vs)}</strong>
            </span>
          </div>
        </div> */}
        <div className="flex flex-col gap-2.5 items-center ">
          {/* Game id= multisig address */}

          <Identicon string={{game.challenger === address ? truncateAddress(game.opponent) : truncateAddress(game.challenger)}} size={36} />
          <span className="font-bold text-lg text-center">
            {game.challenger === address ? truncateAddress(game.opponent) : truncateAddress(game.challenger)}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Challenged you
          </span>
         
        </div>

        <div className="flex flex-col text-center w-full items-center justify-center">
          <div>
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
              {game.isFinished && (
                <div className="flex flex-col">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Outcome: <strong>{game?.outcome}</strong>
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Amount: <strong>{game.wager}</strong>
              </p>
            </div>
          </div>

          {renderActionButton()}
        </div>
        {/* <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Refree: Pierluigi Webb
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Stadium: Wembley, London
      </p>
    </div> */}
      </div>
      {/* <div className="px-6 py-2 border-t border-gray-100 dark:border-gray-700">
      <Button className="w-full" variant="outline">
        {game.state === "completed" ? "View Match Statistics" : "Play"}
      </Button>
    </div> */}
    </Card>
  );
};
export default YourTurn;

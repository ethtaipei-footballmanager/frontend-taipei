import { useAcceptGameStore } from "@/app/accept-game/store";
import {
  CalculateOutcomeInputs,
  GAME_FUNCTIONS,
  GAME_PROGRAM_ID,
  RevealAnswerInputs,
  SubmitWagerInputs,
  transitionFees,
} from "@/app/state/manager";
import { useEventHandling } from "@/hooks/eventHandling";
import { useMsRecords } from "@/hooks/msRecords";
import {
  EventType,
  importSharedState,
  requestCreateEvent,
  requestSignature,
} from "@puzzlehq/sdk";
import { useGameStore, type Game } from "@state/gameStore";
import jsyaml from "js-yaml";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { truncateAddress } from "./ConnectWallet";
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

interface IYourTurn {
  game: Game;
}
const messageToSign = "1234567field"; // TODO replace this by appropriate msg

// const networkClient = new AleoNetworkClient("https://vm.aleo.org/api");

const YourTurn: React.FC<IYourTurn> = ({ game }) => {
  const router = useRouter();
  const user = game.gameNotification.recordData.owner;
  const opponent_address = game.gameNotification.recordData.opponent_address;
  const challenger_address =
    game.gameNotification.recordData.challenger_address;
  const vs = user === opponent_address ? challenger_address : opponent_address;

  const [setCurrentGame] = useGameStore((state) => [state.setCurrentGame]);

  const wager = game.gameNotification.recordData.total_pot / 2;
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

  const [largestPiece, availableBalance, currentGame] = useGameStore(
    (state) => [state.largestPiece, state.availableBalance, state.currentGame]
  );
  const msAddress = currentGame?.gameNotification.recordData.game_multisig;
  console.log("🚀 ~ msAddress 82:", msAddress);

  const { msPuzzleRecords, msGameRecords } = useMsRecords(msAddress);
  console.log("🚀 ~ msPuzzleRecords 82:", msPuzzleRecords);
  console.log("🚀 ~ currentGMAE 82:", currentGame);

  const puzzleRecord =
    availableBalance >= game.gameNotification.recordData.total_pot / 2
      ? largestPiece
      : undefined;
  // const [
  //   inputs,
  //   eventIdSubmit,
  //   setSubmitWagerInputs,
  //   setEventIdSubmit,
  //   setStep,
  // ] = useAcceptGameStore((state) => [
  console.log("🚀 ~ availableBalance:", availableBalance, largestPiece);
  //   state.inputsSubmitWager,
  //   state.eventIdSubmit,
  //   state.setSubmitWagerInputs,
  //   state.setEventIdSubmit,
  //   state.setStep,
  // ]);

  const [isModal, setIsModal] = useState(false);
  const { loading, error, event, setLoading, setError } = useEventHandling({
    id: eventIdSubmit,
    stepName: "Submit Wager",
    // onSettled: () => setStep(Step._02_AcceptGame),
  });

  // const createEvent = async () => {
  //   console.log("clicked", inputs, game);

  //   if (
  //     !inputs?.opponent_wager_record ||
  //     !inputs.key_record ||
  //     !inputs.game_req_notification
  //   )
  //     return;
  //   setLoading(true);
  //   setError(undefined);
  //   const signature = await requestSignature({ message: messageToSign });
  //   if (!signature.messageFields || !signature.signature) {
  //     setError("Signature or signature message fields not found");
  //     setLoading(false);
  //     return;
  //   }
  //   const messageFields = Object(jsyaml.load(signature.messageFields));

  //   const newInputs: Partial<SubmitWagerInputs> = {
  //     opponent_wager_record: inputs.opponent_wager_record,
  //     key_record: inputs.key_record,
  //     game_req_notification: inputs.game_req_notification,
  //     opponent_message_1: messageFields.field_1,
  //     opponent_message_2: messageFields.field_2,
  //     opponent_message_3: messageFields.field_3,
  //     opponent_message_4: messageFields.field_4,
  //     opponent_message_5: messageFields.field_5,
  //     opponent_sig: signature.signature,
  //   };
  //   const game_multisig_seed = currentGame?.utilRecords?.[0].data.seed ?? "";
  //   console.log("game_multisig seed", game_multisig_seed);
  //   const { data } = await importSharedState(game_multisig_seed);
  //   console.log(`Shared state imported: ${data?.address}`);

  //   setSubmitWagerInputs(newInputs);
  //   const response = await requestCreateEvent({
  //     type: EventType.Execute,
  //     programId: GAME_PROGRAM_ID,
  //     functionId: GAME_FUNCTIONS.submit_wager,
  //     fee: transitionFees.submit_wager,
  //     inputs: Object.values(newInputs),
  //     address: inputs.game_req_notification.owner, // opponent address
  //   });
  //   if (response.error) {
  //     setError(response.error);
  //     setLoading(false);
  //   } else if (response.eventId) {
  //     /// todo - other things here?
  //     setEventIdSubmit(response.eventId);
  //     setSubmitWagerInputs({ ...newInputs });
  //     router.push(`/create-game`);
  //     //   setSearchParams({ eventIdSubmit: response.eventId });
  //   }
  // };

  useEffect(() => {
    if (!currentGame || !msPuzzleRecords || !msGameRecords) return;
    const piece_stake_challenger = msPuzzleRecords?.find(
      (r: any) =>
        r.data.ix === "3u32.private" &&
        r.data.challenger.replace(".private", "") ===
          currentGame.gameNotification.recordData.challenger_address &&
        r.data.staker.replace(".private", "") ===
          currentGame.gameNotification.recordData.challenger_address
    );
    const piece_claim_challenger = msPuzzleRecords.find(
      (r: any) =>
        r.data.ix === "6u32.private" &&
        r.data.challenger.replace(".private", "") ===
          currentGame.gameNotification.recordData.challenger_address &&
        r.data.claimer.replace(".private", "") ===
          currentGame.gameNotification.recordData.challenger_address
    );
    const piece_stake_opponent = msPuzzleRecords.find(
      (r: any) =>
        r.data.ix === "3u32.private" &&
        r.data.opponent.replace(".private", "") ===
          currentGame.gameNotification.recordData.opponent_address &&
        r.data.staker.replace(".private", "") ===
          currentGame.gameNotification.recordData.opponent_address
    );
    const piece_claim_opponent = msPuzzleRecords.find(
      (r: any) =>
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
  const createSubmitWagerEvent = async () => {
    const key_record = game.utilRecords[0];
    console.log("🚀 ~ createSubmitWagerEvent ~ key_record:", key_record);
    const game_req_notification = game.gameNotification.recordWithPlaintext;
    console.log(
      "🚀 ~ createSubmitWagerEvent ~ game_req_notification:",
      game_req_notification
    );
    console.log("🚀 ~ createSubmitWagerEvent ~ puzzleRecord:", puzzleRecord);
    if (!puzzleRecord || !key_record || !game_req_notification) {
      return;
    }
    console.log("heere");

    setLoading(true);
    setError(undefined);
    const signature = await requestSignature({ message: messageToSign });
    // setConfirmStep(ConfirmStep.Signing);
    if (!signature.messageFields || !signature.signature) {
      setError("Signature or signature message fields not found");
      setLoading(false);
      return;
    }
    // setConfirmStep(ConfirmStep.RequestingEvent);
    const messageFields = Object(jsyaml.load(signature.messageFields));

    const newInputs: Partial<SubmitWagerInputs> = {
      opponent_wager_record: puzzleRecord,
      key_record: key_record,
      game_req_notification: game_req_notification,
      opponent_message_1: messageFields.field_1,
      opponent_message_2: messageFields.field_2,
      opponent_message_3: messageFields.field_3,
      opponent_message_4: messageFields.field_4,
      opponent_message_5: messageFields.field_5,
      opponent_sig: signature.signature,
    };
    const game_multisig_seed = currentGame?.utilRecords?.[0].data.seed ?? "";
    console.log("game_multisig seed", game_multisig_seed);
    const { data } = await importSharedState(game_multisig_seed);
    console.log(`Shared state imported: ${data?.address}`);

    setSubmitWagerInputs(newInputs);
    const response = await requestCreateEvent({
      type: EventType.Execute,
      programId: GAME_PROGRAM_ID,
      functionId: GAME_FUNCTIONS.submit_wager,
      fee: transitionFees.submit_wager,
      inputs: Object.values(newInputs),
      address: game_req_notification.owner, // opponent address
    });
    if (response.error) {
      setError(response.error);
      setLoading(false);
    } else if (response.eventId) {
      /// todo - other things here?
      setEventIdSubmit(response.eventId);
      setCurrentGame(game);
      setSubmitWagerInputs({ ...newInputs });
      router.push(`/accept-game/${response.eventId}`);
    }
  };

  // TODO: Complete this
  const createCalculateOutcomeEvent = async () => {
    console.log("🚀 ~ createCalculateOutcomeEvent ~ TODO:");

    const newInputs: Partial<CalculateOutcomeInputs> = {
      reveal_answer_notification_record: puzzleRecord, //todo
      challenger_answer_record: puzzleRecord, // todo
    };

    // setCalculateOutcomeInputs(newInputs);
    const response = await requestCreateEvent({
      type: EventType.Execute,
      programId: GAME_PROGRAM_ID,
      functionId: GAME_FUNCTIONS.calculate_outcome,
      fee: transitionFees.calculate_outcome,
      inputs: Object.values(newInputs),
      address: "TODO",
    });
    if (response.error) {
      setError(response.error);
      setLoading(false);
    } else if (response.eventId) {
      /// todo - other things here?
      setEventIdSubmit(response.eventId);
      setCurrentGame(game);
      // setCalculateOutcomeInputs({ ...newInputs });
      // router.push(`/accept-game/${response.eventId}`);
    }
  };

  // TODO: Complete this
  const createRevealAnswerEvent = async () => {
    console.log("🚀 ~ createRevealAnswerGameEvent ~ TODO:");
    // const gameOutcome = await networkClient?.getProgramMappingValue(
    //   GAME_PROGRAM_ID,
    //   GAME_RESULTS_MAPPING,
    //   game.gameNotification.recordData.game_multisig
    // );
    const newInputs: Partial<RevealAnswerInputs> = {
      challenger_claim_signature: puzzleRecord,
      calculated_outcome_notification_record: puzzleRecord,
      joint_piece_state: puzzleRecord,
      challenger_answer_record: puzzleRecord,
      game_outcome: "win",
    };

    // setCalculateOutcomeInputs(newInputs);
    const response = await requestCreateEvent({
      type: EventType.Execute,
      programId: GAME_PROGRAM_ID,
      functionId: GAME_FUNCTIONS.reveal_answer,
      fee: transitionFees.reveal_answer,
      inputs: Object.values(newInputs),
      address: "TODO",
    });
    if (response.error) {
      setError(response.error);
      setLoading(false);
    } else if (response.eventId) {
      /// todo - other things here?
      setEventIdSubmit(response.eventId);
      setCurrentGame(game);
      // setCalculateOutcomeInputs({ ...newInputs });
      // router.push(`/accept-game/${response.eventId}`);
    }
  };

  const renderActionButton = () => {
    switch (game.gameAction) {
      case "Submit Wager":
        // return <SubmitWagerButton game={game} />;
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsModal(true)}
                variant="outline"
                className="tracking-wider text-base text-black dark:text-white font-semibold flex gap-2.5"
              >
                Accept Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="flex gap-1 w-full flex-col justify-center items-center">
                <DialogTitle className=" tracking-lighter dark:text-white  text-[#25292e] text-[18px] ">
                  Would you like to accept the challenge from{" "}
                  <span className="font-extrabold"> {truncateAddress(vs)}</span>{" "}
                  for <span className="font-extrabold">{wager}</span> pieces?
                </DialogTitle>

                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="flex justify-center gap-4 mt-2 text-center w-full items-center">
                <Button
                  onClick={createSubmitWagerEvent}
                  variant="outline"
                  className="flex flex-col gap-1 hover:text-white dark:hover:bg-[#dbe0e5]  bg-[#fafafa] w-2/5   h-fit justify-center items-center"
                >
                  <span className="text-xs font-semibold text-black">
                    Accept
                  </span>{" "}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        );
      case "Accept":
        // return <AcceptGameButton game={game} />;
        return (
          <Button size="sm" color="yellow">
            Accept
          </Button>
        );
      case "Calculate":
        return (
          <Button
            onClick={createCalculateOutcomeEvent} // TODO implement a simple wallet popup that consumes 2 records.
            size="sm"
            color="yellow"
          >
            Play game
          </Button>
        );
      case "Reveal":
        return (
          <Button onClick={createRevealAnswerEvent} size="sm" color="yellow">
            Reveal outcome
          </Button>
        );
        return (
          // TODO: Here we must do 3 things
          // - gameOutcome must be retrieved from the mapping (multisig address is the key)
          // - Wallet popup that consumes 4 records + gameOutcome
          // - Navigate user to the page of this specific game (something like /games/{id}) // id = multisig address
          <Button
            // onClick={() => {
            //   setCurrentGame(game);
            //   const gameOutcome = networkClient.getProgramMappingValue(GAME_PROGRAM_ID, GAME_RESULTS_MAPPING, game.gameNotification.recordData.game_multisig);
            //   navigate(
            //     `/reveal-answer/${game.gameNotification.recordData.game_multisig}`
            //   );
            // }}
            size="sm"
            color="yellow"
          >
            Reveal outcome
          </Button>
        );
      // return (
      // <Button
      //     onClick={() => {
      //         setCurrentGame(game);
      //         navigate(
      //             `/reveal-answer/${game.gameNotification.recordData.game_multisig}`
      //         );
      //     }}
      //     size="sm"
      //     color="yellow"
      // >
      //     Reveal
      // </Button>
      // );
      case "Lose":
        return (
          <Button size="sm" color="yellow">
            Lose
          </Button>
        );
      // return (
      //     <Button
      //         onClick={() => {
      //             setCurrentGame(game);
      //             navigate(
      //                 `/finish-game/lose/${game.gameNotification.recordData.game_multisig}`
      //             );
      //         }}
      //         size="sm"
      //         color="yellow"
      //     >
      //         See Answer
      //     </Button>
      // );
      case "Claim":
        return (
          <Button size="sm" color="yellow">
            Claim
          </Button>
        );
      // return (
      //     <Button
      //         onClick={() => {
      //             setCurrentGame(game);
      //             navigate(
      //                 `/finish-game/win/${game.gameNotification.recordData.game_multisig}`
      //             );
      //         }}
      //         color="yellow"
      //         size="sm"
      //     >
      //         View Result
      //     </Button>
      // );
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
    <Card className="  max-w-sm grid-span-1 w-full shadow-lg rounded-xl overflow-hidden">
      <div className="flex flex-col gap-8 justify-center items-center lg:justify-between p-6 space-y-6 sm:space-y-0">
        <div className="flex w-full flex-col justify-between">
          <div>
            <Identicon string={truncateAddress(vs)} size={36} />

            <span className="font-semibold text-lg text-center">
              Challenger: <strong>{truncateAddress(vs)}</strong>
            </span>
          </div>
          <span className="font-semibold text-lg text-center">
            Outcome: <strong>1-1</strong>
            {/* Outcome: <strong>{gameOutcome.goals_home + "-" gameOutcome.goals_away}</strong> */}
          </span>
          <span className="font-semibold text-lg text-center">
            Amount: <strong>{wager}</strong>
          </span>
        </div>
        {renderActionButton()}
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

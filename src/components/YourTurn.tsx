import { useAcceptGameStore } from "@/app/accept-game/store";
import {
  GAME_FUNCTIONS,
  GAME_PROGRAM_ID,
  SubmitWagerInputs,
  transitionFees,
} from "@/app/state/manager";
import { useEventHandling } from "@/hooks/eventHandling";
import {
  EventType,
  importSharedState,
  requestCreateEvent,
  requestSignature,
} from "@puzzlehq/sdk";
import { useGameStore, type Game } from "@state/gameStore";
import jsyaml from "js-yaml";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

interface IYourTurn {
  game: Game;
}
const messageToSign = "1234567field";

const YourTurn: React.FC<IYourTurn> = ({ game }) => {
  const router = useRouter();
  const user = game.gameNotification.recordData.owner;
  const opponent_address = game.gameNotification.recordData.opponent_address;
  const challenger_address =
    game.gameNotification.recordData.challenger_address;
  const vs = user === opponent_address ? challenger_address : opponent_address;
  const wager = game.gameNotification.recordData.total_pot / 2;

  const [
    inputs,
    eventIdSubmit,
    setSubmitWagerInputs,
    setEventIdSubmit,
    setStep,
  ] = useAcceptGameStore((state) => [
    state.inputsSubmitWager,
    state.eventIdSubmit,
    state.setSubmitWagerInputs,
    state.setEventIdSubmit,
    state.setStep,
  ]);
  const [currentGame, largestPiece] = useGameStore((state) => [
    state.currentGame,
    state.largestPiece,
  ]);
  const [isModal, setIsModal] = useState(false);
  const { loading, error, event, setLoading, setError } = useEventHandling({
    id: eventIdSubmit,
    stepName: "Submit Wager",
    // onSettled: () => setStep(Step._02_AcceptGame),
  });

  const createEvent = async () => {
    console.log("clicked", inputs, game);

    if (
      !inputs?.opponent_wager_record ||
      !inputs.key_record ||
      !inputs.game_req_notification
    )
      return;
    setLoading(true);
    setError(undefined);
    const signature = await requestSignature({ message: messageToSign });
    if (!signature.messageFields || !signature.signature) {
      setError("Signature or signature message fields not found");
      setLoading(false);
      return;
    }
    const messageFields = Object(jsyaml.load(signature.messageFields));

    const newInputs: Partial<SubmitWagerInputs> = {
      opponent_wager_record: inputs.opponent_wager_record,
      key_record: inputs.key_record,
      game_req_notification: inputs.game_req_notification,
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
      address: inputs.game_req_notification.owner, // opponent address
    });
    if (response.error) {
      setError(response.error);
      setLoading(false);
    } else if (response.eventId) {
      /// todo - other things here?
      setEventIdSubmit(response.eventId);
      setSubmitWagerInputs({ ...newInputs });
      router.push(`/create-game`);
      //   setSearchParams({ eventIdSubmit: response.eventId });
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
                  onClick={() => {
                    createEvent();
                  }}
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
      case "Reveal":
        return (
          <Button size="sm" color="yellow">
            Reveal
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
        <div className="flex w-full justify-between">
          <span className="font-semibold text-lg text-center">
            Challenger: <strong>{truncateAddress(vs)}</strong>
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

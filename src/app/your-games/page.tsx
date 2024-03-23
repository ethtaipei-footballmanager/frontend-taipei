//@ts-nocheck
"use client";

// import TheirTurn from '@components/TheirTurn';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GAME_ADDRESS, TOKEN_ADDRESS } from "@/utils";
import YourTurn from "@components/YourTurn";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useReadContract,
  useWatchContractEvent,
} from "wagmi";
import TOKEN_ABI from "../../abi/ERC20.json";
import GAME_ABI from "../../abi/Game.json";
interface IYourGames {}

const tabs = [
  { id: "your", label: "Your Turn" },
  { id: "their", label: "Their Turn" },
  { id: "finished", label: "Finished" },
];

export type Game = {
  opponent: string;
  challenger: string;
  wager: string;
  outcome: string;
  isFinished: boolean;
};

const YourGames: React.FC<IYourGames> = ({}) => {
  // const provider = new ethers.JsonRpcProvider("https://sepolia-rpc.scroll.io");
  // const gameContract = new ethers.Contract(
  //   GAME_ADDRESS,
  //   GAME_ABI.abi,
  //   provider
  // );
  // console.log("🚀 ~ gameContract:", gameContract);

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const publicClient = usePublicClient();

  const { address } = useAccount();
  console.log("🚀 ~ address:", address);
  const [loading, setLoading] = useState(false);

  const [yourTurn, setYourTurn] = useState<Game[]>();
  const [theirTurn, setTheirTurn] = useState<Game[]>();
  const [finished, setFinished] = useState<Game[]>();
  const result = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI.abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });
  const { data } = useBalance({
    address: address,
  });
  console.log("🚀 ~ data:", data);

  const { data: data2 } = useReadContract({
    address: GAME_ADDRESS,
    abi: GAME_ABI.abi,
    functionName: "getGameCount",
  });
  const gameContractConfig = {
    address: GAME_ADDRESS,
    abi: GAME_ABI.abi,
  } as const;
  const events = useWatchContractEvent({
    ...gameContractConfig,
    eventName: "GameProposed",
    onLogs(logs: any) {
      console.log("New logs!", logs);
    },
  });

  console.log("🚀 ~ events:", events);
  useEffect(() => {
    const getLogs = async () => {
      const logs = await publicClient?.getContractEvents({
        address: GAME_ADDRESS,
        abi: GAME_ABI.abi,
        // eventName: "GameProposed",
        // args: {
        //   from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
        //   to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac'
        // },
        fromBlock: 3385459n,
        toBlock: "latest",
      });
      console.log("getlog", logs);

      const gameContract = {
        address: GAME_ADDRESS,
        abi: GAME_ABI.abi,
      } as const;

      const getGameNumber = await publicClient?.readContract({
        address: GAME_ADDRESS,
        abi: GAME_ABI.abi,
        functionName: "getGameCount",
      });
      console.log("🚀 ~ getLogs ~ getGameNumber:", Number(getGameNumber));

      const results = await publicClient?.multicall({
        contracts: Array.from(
          { length: Number(getGameNumber) },
          (_, index) => ({
            address: GAME_ADDRESS,
            abi: GAME_ABI.abi,
            functionName: "games",
            args: [index],
          })
        ),
      });
      const games = results?.map((game) => {
        console.log("gameasd", game.result[0], game.result[1], address);

        if (game.result[0] === address && (!game.result[3] as Boolean)) {
          console.log("1asd");

          setYourTurn((prevState: Game[] | undefined) => [
            ...(prevState || []), // Ensure prevState is an array or initialize it as an empty array
            {
              challenger: game.result[0],
              opponent: game.result[1],
              wager: formatUnits(game.result[2], 18),
              // gameId:   ,
              outcome: ``,
              isFinished: false,
            },
          ]);
        } else if (game.result[1] === address && !game.result[3]) {
          console.log("2asd");
          setTheirTurn((prevState: Game[] | undefined) => [
            ...(prevState || []), // Ensure prevState is an array or initialize it as an empty array
            {
              challenger: game.result[0],
              opponent: game.result[1],
              wager: formatUnits(game.result[2], 18),
              // gameId:   ,
              outcome: ``,
              isFinished: false,
            },
          ]);
        } else if (
          (game.result[0] === address || game.result[1] === address) &&
          game.result[3]
        ) {
          console.log("3asd");

          setFinished((prevState: Game[] | undefined) => [
            ...(prevState || []), // Ensure prevState is an array or initialize it as an empty array
            {
              challenger: game.result[0],
              opponent: game.result[1],
              wager: formatUnits(game.result[2], 18),
              // gameId:   ,
              outcome: `${Number(game.result[3].goalsHomeTeam)} - ${Number(
                game.result[3].awayTeam
              )}`,
              isFinished: true,
            },
          ]);
        }
      });
      console.log("🚀 ~ getLogs ~ results:", results, games);
      // const filteredData = logs
      //   ?.map((event) => {
      //     // console.log("event", event.args);
      //     if (event.name === "GameProposed") {
      //       if (event.args.opponent.toLowerCase() === address?.toLowerCase()) {
      //         setYourTurn((prevState: Game) => [
      //           ...prevState,
      //           {
      //             opponent: event.args.opponent,
      //             challenger: event.args.challenger,
      //             wager: formatUnits(event.args.wagerAmount, 18),
      //             gameId: event.args.gameId.toString(),
      //             outcome: "",
      //           },
      //         ]);
      //       }
      //     } else if (event.name === "GameAccepted") {
      //       if (
      //         event.args.challenger.toLowerCase() === address?.toLowerCase()
      //       ) {
      //         setTheirTurn((prevState: Game) => [
      //           ...prevState,
      //           {
      //             opponent: event.args.opponent,
      //             challenger: event.args.challenger,
      //             wager: formatUnits(event.args.wagerAmount, 18),
      //             gameId: event.args.gameId.toString(),
      //             outcome: "",
      //           },
      //         ]);
      //       }
      //     } else {
      //       if (
      //         event.args.challenger.toLowerCase() === address?.toLowerCase() ||
      //         event.args.opponent.toLowercase() === address?.toLowerCase()
      //       ) {
      //         setFinished((prevState: Game) => [
      //           ...prevState,
      //           {
      //             opponent: event.args.opponent,
      //             challenger: event.args.challenger,
      //             wager: formatUnits(event.args.wagerAmount, 18),
      //             gameId: event.args.gameId.toString(),
      //             outcome: "",
      //           },
      //         ]);
      //       }
      //     }
      //   })
      //   .filter(Boolean);
    };
    getLogs();
    // gameContract.on(
    //   "GameProposed",
    //   (gameId, challenger, opponent, wagerAmount) => {
    //     let info = {
    //       gameId: gameId,
    //       challenger: challenger,
    //       opponent: opponent,
    //       wagerAmount: wagerAmount,
    //     };
    //     console.log("data98", JSON.stringify(info, null, 4));
    //   }
    // );

    // return gameContract.removeAllListeners("GameProposed");
  }, [address]);

  console.log("gamesasd", finished, yourTurn, theirTurn);

  // useEffect(() => {
  //   const getFilter = async () => {
  //     const filter = await publicClient?.createEventFilter({
  //       address: GAME_ADDRESS,
  //       event: parseAbiItem(
  //         "event GameProposed(uint256 gameId,address indexed challenger,address indexed opponent,uint256 wagerAmount)"
  //       ),
  //       strict: true,
  //     });
  //     // const logs = await publicClient?.getFilterLogs({ filter });
  //     // console.log("🚀 ~ getFilter ~ logs:", logs);
  //   };
  //   getFilter();
  // }, []);

  console.log("🚀 ~ {data}:", data, address, data2);

  return (
    <div className="flex flex-col justify-center gap-4 items-center">
      {/* {yourTurn.length > 0 && <YourTurn games={yourTurn} />} */}
      <div className="p-4 flex relative gap-2 h-[85vh] w-full mt-6 justify-center">
        <Tabs
          // value={tab}
          // onValueChange={onTabChange}
          defaultValue="your"
          className="max-w-4xl "
        >
          <div className="flex w-full max-w-4xl items-center justify-center">
            <TabsList className="flex border h-fit w-fit absolute bottom-0 shadow-lg bg-transparent gap-4  items-center justify-center">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  className={`${
                    activeTab === tab.id ? "text-white" : "text-black"
                  } relative rounded-full px-3 py-3 text-base tracking-tighter font-semibold dark:text-white outline-sky-400 transition focus-visible:outline-2 `}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    WebkitTapHighlightColor: "transparent",
                  }}
                  value={tab.id}
                >
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="bubble"
                      className="absolute inset-0 z-10  bg-white mix-blend-difference"
                      style={{ borderRadius: 8 }}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <ScrollArea className=" overflow-y-auto h-[75vh] p-5">
            <TabsContent value={"your"}>
              {yourTurn && yourTurn.length !== 0 ? (
                <div className="flex flex-col  gap-6 -mt-2  items-center w-full justify-center">
                  <h2 className="tracking-tighter text-2xl font-bold">
                    Your Turn to Play
                  </h2>

                  <div className="grid grid-cols-3 gap-4 p-2">
                    {yourTurn &&
                      yourTurn.map((game, index) => (
                        <YourTurn key={index} game={game} isFinished={false} />
                      ))}
                  </div>
                </div>
              ) : (
                <div className="w-full flex items-center text-center justify-center h-[40vh]">
                  <p className=" text-2xl font-semibold">
                    No ongoing games, start one with a friend!
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent value={"their"} className="">
              {theirTurn && theirTurn.length !== 0 ? (
                <div className="flex flex-col  gap-6 -mt-2  items-center w-full justify-center">
                  <h2 className="tracking-tighter text-2xl font-bold">
                    Their Turn to Play
                  </h2>

                  <div className="grid grid-cols-3 gap-4 p-2">
                    {theirTurn &&
                      theirTurn.map((game, index) => (
                        <YourTurn key={index} game={game} isFinished={false} />
                      ))}
                  </div>
                </div>
              ) : (
                <div className="w-full flex items-center text-center justify-center h-[40vh]">
                  <p className=" text-2xl font-semibold">
                    No ongoing games, start one with a friend!
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent value={"finished"}>
              {finished && finished.length !== 0 ? (
                <div className="flex flex-col  gap-6 -mt-2  items-center w-full justify-center">
                  <h2 className="tracking-tighter text-2xl font-bold">
                    Finished Games
                  </h2>

                  <div className="grid grid-cols-3 gap-4 p-2">
                    {finished &&
                      finished.map((game, index) => (
                        <YourTurn key={index} game={game} isFinished={true} />
                      ))}
                  </div>
                </div>
              ) : (
                <div className="w-full flex items-center text-center justify-center h-[40vh]">
                  <p className=" text-2xl font-semibold">
                    No finished games, start one with a friend!
                  </p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        {/* {activePlayersCount !== 11 && (
              <div className="w-full flex justify-center">
                <Button className="w-1/2" variant={"outline"}>
                  Start Game
                </Button>
              </div>
            )} */}
      </div>

      {/* {allEvents?.map((event, index) => {
        if (
          event.functionId == "propose_game" ||
          event.functionId == "accept_game"
        ) {
          return (
            <Card className="w-full  rounded-sm px-2 py-2 " key={index}>
              <CardTitle className="text-sm flex justify-between">
                Status:{" "}
                <Badge
                  variant={
                    (event.status == "Pending" && "destructive") || "default"
                  }
                >
                  {event.status}
                </Badge>
              </CardTitle>
              <CardContent className="mt-2 p-0">
                <div className="flex flex-col gap-2">
                  <p className="text-sm">
                    <span className="font-bold">Bet Amount: </span>{" "}
                    <span className="text-red-300">
                      {parseInt(event.inputs[0]!)}
                    </span>{" "}
                    Fortune Credits
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm">
                    <span className="font-bold">Bet: </span>{" "}
                    <span className="text-red-300">
                      {parseInt(event.inputs[1]!)}
                    </span>{" "}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm">
                    <span className="font-bold">Game ID: </span>{" "}
                    <span className="text-red-300">{event._id!}</span>{" "}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        }
      })} */}
    </div>
  );
};
export default YourGames;

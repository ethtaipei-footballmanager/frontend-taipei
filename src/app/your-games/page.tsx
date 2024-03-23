"use client";

import { useGameStore } from "../state/gameStore";
// import TheirTurn from '@components/TheirTurn';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GAME_ADDRESS, TOKEN_ADDRESS } from "@/utils";
import YourTurn from "@components/YourTurn";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";
import GAME_ABI from "../../abi/Game.json";

interface IYourGames {}

const tabs = [
  { id: "your", label: "Your Turn" },
  { id: "their", label: "Their Turn" },
  { id: "finished", label: "Finished" },
];

const YourGames: React.FC<IYourGames> = ({}) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const [yourTurn, theirTurn, finished, availableBalance] = useGameStore(
    (state) => [
      state.yourTurn,
      state.theirTurn,
      state.finished,
      state.availableBalance,
    ]
  );
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  console.log("🚀 ~ yourTurn:", yourTurn);
  console.log("🚀 ~ theirTurn:", theirTurn);
  console.log("🚀 ~ finished:", finished);

  const result = useReadContract({
    address: TOKEN_ADDRESS,
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "initialSupply",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "decimals",
            type: "uint8",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "allowance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256",
          },
        ],
        name: "ERC20InsufficientAllowance",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256",
          },
        ],
        name: "ERC20InsufficientBalance",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "approver",
            type: "address",
          },
        ],
        name: "ERC20InvalidApprover",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
        ],
        name: "ERC20InvalidReceiver",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "ERC20InvalidSender",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
        ],
        name: "ERC20InvalidSpender",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
        ],
        name: "allowance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "transfer",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "transferFrom",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
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
              {yourTurn.length !== 0 ? (
                <div className="flex flex-col  gap-6 -mt-2  items-center w-full justify-center">
                  <h2 className="tracking-tighter text-2xl font-bold">
                    Your Turn to Play
                  </h2>

                  <div className="grid grid-cols-3 gap-4 p-2">
                    {yourTurn.map((game, index) => (
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
              {theirTurn.length !== 0 ? (
                <div className="flex flex-col  gap-6 -mt-2  items-center w-full justify-center">
                  <h2 className="tracking-tighter text-2xl font-bold">
                    Their Turn to Play
                  </h2>

                  <div className="grid grid-cols-3 gap-4 p-2">
                    {theirTurn.map((game, index) => (
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
              {finished.length !== 0 ? (
                <div className="flex flex-col  gap-6 -mt-2  items-center w-full justify-center">
                  <h2 className="tracking-tighter text-2xl font-bold">
                    Finished Games
                  </h2>

                  <div className="grid grid-cols-3 gap-4 p-2">
                    {finished.map((game, index) => (
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

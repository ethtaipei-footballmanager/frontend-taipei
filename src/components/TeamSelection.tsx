"use client";
import { useGameStore } from "@/app/state/gameStore";
import { teams } from "@/utils/team-data";
import {
  RecordsFilter,
  getRecords,
  useAccount,
  zodAddress,
} from "@puzzlehq/sdk";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "sonner";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { z } from "zod";
import { useNewGameStore } from "../app/create-game/store";
import TeamCard from "./TeamCard";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
interface ITeamSelection {
  setSelectedTeam: (val: number) => void;
  setIsGameStarted: (val: boolean) => void;
  selectedTeam: number;
  // startGame: () => void;
}

type Team = {
  name: string;
  attack: number;
  defense: number;
  image: string;
  foundingYear: number;
  coach: string;
  colors: string[];
  achievements: string[];
  fanbase: string;
};

function getRandomNumber(): number {
  return Math.floor(Math.random() * 1000) + 1;
}

const opponentSchema = zodAddress;
const wagerAmountSchema = z
  .number()
  .refine(
    (value) => !isNaN(Number(value)),
    "Wager amount must be a valid number"
  )
  .refine(
    (value) => Number(value) >= 0 && Number(value) <= 1000,
    "Wager amount must be between 0 and 1000"
  );

const TeamSelection: React.FC<ITeamSelection> = ({
  selectedTeam,
  setSelectedTeam,
  setIsGameStarted,
}) => {
  const [bet, setBet] = useState(1);
  const [opponent, setOpponent] = useState("");
  const swiperRef = useRef<any>();
  const [opponentError, setOpponentError] = useState<string | null>(null);
  const [betError, setBetError] = useState<string | null>(null);
  const { account } = useAccount();
  const { setInputs, inputs } = useNewGameStore();
  const [availableBalance, largestPiece] = useGameStore((state) => [
    state.availableBalance,
    state.largestPiece,
  ]);
  const filter: RecordsFilter = {
    type: "all",
  };
  useEffect(() => {
    const response = async () => {
      const record = await getRecords({
        filter,
        address: account?.address,
      });
      console.log("🚀 ~ response ~ response:", record);

      return record;
    };
    response();
  }, []);

  console.log("🚀 ~ availableBalance:", availableBalance);
  console.log("🚀 ~ largestPiece:", largestPiece);

  const handleOpponentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpponent(e.target.value);
  };
  useEffect(() => {
    const wagerAmountResult = wagerAmountSchema.safeParse(bet);
    console.log("🚀 ~ useEffect ~ wagerAmountResult:", wagerAmountResult);
    const opponentResult = opponentSchema.safeParse(opponent);
    console.log("🚀 ~ useEffect ~ opponentResult:", opponentResult);

    if (!wagerAmountResult.success) {
      setBetError("Wager amount must be a valid number");
    } else {
      setBetError(null);
    }

    if (!opponentResult.success) {
      setOpponentError("Opponent address must be valid aleo account");
    } else {
      setOpponentError(null);
    }

    // Update inputs only if both values are valid
    if (wagerAmountResult.success && opponentResult.success) {
      setInputs({
        challenger_wager_amount: wagerAmountResult.data.toString(),
        opponent: opponentResult.data,
        wager_record: largestPiece,
      });
    }
  }, [bet, opponent]);

  const handleStartGame = () => {
    if (account?.address) {
      setIsGameStarted(true);
    } else {
      toast.info("Please connect your Puzzle Wallet to play");
    }
  };

  console.log("bet", bet, inputs);

  return (
    <div className="flex flex-col h-fit  items-center gap-16 mt-16 justify-around ">
      <Swiper
        onSnapIndexChange={
          (newIndex) =>
            setSelectedTeam(newIndex.activeIndex) /* or set to state */
        }
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 300,
          modifier: 1,
          slideShadows: false,
          //   scale: 0.9,
        }}
        direction="horizontal"
        navigation={{
          nextEl: "swiper-button-prev",
          prevEl: "swiper-button-next",
        }}
        initialSlide={teams.length / 2}
        // navigation={true}
        modules={[EffectCoverflow, Navigation]}
        className="mySwiper max-w-md h-fit lg:max-w-3xl lg:h-full"
      >
        {/* {artists.map((artist) => (
          <SwiperSlide key={artist.id} className={SwiperSlideClass}>
            <FeaturedEventCard artist={artist} />
          </SwiperSlide>
        ))} */}
        {teams.map((team, index) => {
          console.log("teams", team);
          return (
            <SwiperSlide
              key={team.name}
              className="max-w-fit flex flex-col gap-8 items-center justify-center rounded-3xl font-bold"
            >
              <TeamCard
                key={team.name}
                index={index}
                selectedTeam={selectedTeam}
                team={team}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="hidden sm:block  absolute top-[45%]  left-48">
        <Button
          size={"icon"}
          className="rounded-full"
          variant={"ghost"}
          onClick={() => swiperRef.current?.slidePrev()}
          title="Previous"
        >
          <FaChevronLeft size={24} />
        </Button>
      </div>
      <div className="hidden sm:block  absolute top-[45%]  right-48">
        <Button
          size={"icon"}
          className="rounded-full"
          variant={"ghost"}
          onClick={() => {
            swiperRef.current?.slideNext();
          }}
          title="Next"
        >
          {" "}
          <FaChevronRight size={24} />
        </Button>
        {/* <div className="flex flex-row gap-1"> */}
        {/* </div> */}
            
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Pick Team</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Start Game</DialogTitle>
            <DialogDescription>
              Enter how much you are wagering for the game and your opponent
            </DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            onChange={(e) => handleOpponentChange(e)}
            placeholder="Opponent address"
          />
          {opponentError && (
            <p className="text-red-500 text-sm">{opponentError}</p>
          )}
          <div className="grid gap-4 py-4">
            <div className="flex w-full relative items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Wager
              </Label>
              <Input
                id="amount"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBet(parseInt(e.currentTarget.value))
                }
                className="col-span-3 outline-none  ring-offset-0"
                value={bet}
              />
              <p className="absolute text-xs tracking-tighter right-4">
                Puzzle Token
              </p>
            </div>
            {betError && <p className="text-red-500 text-sm">{betError}</p>}
            <div className="relative">
              <Slider
                className="mt-6"
                onValueChange={(e) => setBet(e[0])}
                defaultValue={[100]}
                value={[bet]}
                min={0}
                max={1000}
                step={10}
              />

              {/* <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-[26%] -translate-x-1/2 rtl:translate-x-1/2  -bottom-7">
                250
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -bottom-7">
                500
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-3/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-7">
                750
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-7">
                1000
              </span> */}
            </div>
          </div>
          <div className="flex w-full justify-center  items-center ">
            {/* <Button
              variant="outline"
              className="relative w-48 overflow-hidden bg-gradient-to-r from-blue-300 via-fuchsia-400 to-yellow-600"
              onClick={() => {
                const number = getRandomNumber();
                setBet(number);
              }}
            >
              <motion.span
                layout
                initial={{
                  x: Math.random() * 100 - 50, // Random initial x position between -50 and 50
                  y: Math.random() * 60 - 30, // Random initial y position between -30 and 30
                }}
                animate={{
                  x: Math.random() * 100 - 50, // Random destination x position between -50 and 50
                  y: Math.random() * 60 - 30, // Random destination y position between -30 and 30
                  z: Math.random(),
                }}
                className="absolute  bg-clip-text bg-transparent"
                transition={{
                  repeatType: "reverse",
                  repeat: Infinity,
                  duration: 2,
                }}
              >
                Feeling Lucky!
              </motion.span>
            </Button> */}
            <Button
              onClick={handleStartGame}
              className="w-full"
              variant={"outline"}
              type="submit"
            >
              Start Game
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default TeamSelection;

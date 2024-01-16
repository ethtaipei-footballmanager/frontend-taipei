"use client";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type Team = {
  name: string;
  attack: number;
  defense: number;
  image: string;
  foundingYear: number;
  colors: string[];
  colorCodes: string[];
  achievements: string[];
  fanbase: string;
};

interface ITeamCard {
  team: Team;
  index: number;
  selectedTeam: number;
}

export const calculateStarRating = (
  attack: number,
  defense: number
): number => {
  const normalizedAttack = attack / 100;
  const normalizedDefense = defense / 100;
  const overallRating = (normalizedAttack + normalizedDefense) / 2;
  const starRating = overallRating * 5;
  return starRating;
};

type ColorVariants = {
  [key: string]: string[];
};

export const renderStars = (starRating: number) => {
  const fullStars = Math.floor(starRating);
  const fractionalPart = starRating % 1;

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg
        key={i}
        className="w-8 h-8 ms-3 text-yellow-300 flex-shrink-0"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 20"
      >
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
      </svg>
      // <svg
      //   width="512"
      //   height="512"
      //   viewBox="0 0 512 512"
      //   key={i}
      //   className="w-8 h-8 ms-3 text-yellow-300 flex-shrink-0"
      //   aria-hidden="true"
      //   xmlns="http://www.w3.org/2000/svg"
      //   fill="currentColor"
      // >
      //   <rect
      //     width="512"
      //     height="512"
      //     x="0"
      //     y="0"
      //     rx="30"
      //     fill="transparent"
      //     stroke="transparent"
      //     stroke-width="0"
      //     stroke-opacity="100%"
      //     paint-order="stroke"
      //   ></rect>
      //   <svg
      //     width="256px"
      //     height="256px"
      //     viewBox="0 0 1024 1024"
      //     fill="currentColor"
      //     x="128"
      //     y="128"
      //     role="img"
      //     xmlns="http://www.w3.org/2000/svg"
      //   >
      //     <g fill="currentColor">
      //       <path
      //         fill="currentColor"
      //         d="m908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5c-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1l-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2c17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9l183.7-179.1c5-4.9 8.3-11.3 9.3-18.3c2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7L323.1 772l36.1-210.3l-152.8-149L417.6 382L512 190.7L606.4 382l211.2 30.7l-152.8 148.9z"
      //       />
      //     </g>
      //   </svg>
      // </svg>
    );
  }

  // Render the partially filled star if applicable
  if (fractionalPart > 0) {
    const width = `${fractionalPart * 100}%`;

    // Background star with only stroke for fractional part
    stars.push(
      <div className="relative flex" key={`bg-${fullStars}`}>
        {/* Background star with only stroke */}
        <svg
          className="w-8 h-8 ms-3 absolute text-yellow-300 stroke-current"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 22 20"
          stroke="#FFD700"
          strokeWidth={1}
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>

        {/* Filled star path */}
        <motion.svg
          className="w-8 h-8 ms-3 absolute text-yellow-300"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
          style={{
            clipPath: `polygon(0 0, ${width} 0, ${width} 100%, 0 100%)`,
          }}
        >
          {/* Filled star path */}
          <path
            d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
            stroke="none"
          />
        </motion.svg>
      </div>
    );
  }

  return <div className="flex ">{stars}</div>;
};

const colorVariants: ColorVariants = {
  "0": [
    "bg-[#3498db] hover:bg-[#3498db] border-[#3498db]",
    "bg-[#bdc3c7] hover:bg-[#bdc3c7] border-[#bdc3c7]",
  ],
  "1": [
    "bg-[#3498db] hover:bg-[#3498db] border-[#3498db]",
    "bg-[#f39c12] hover:bg-[#f39c12] border-[#f39c12]",
  ],
  "2": [
    "bg-[#8e44ad] hover:bg-[#8e44ad] border-[#8e44ad]",
    "bg-[#596275] hover:bg-[#596275] border-[#596275]",
  ],
  "3": [
    "bg-[#8b4513] hover:bg-[#8b4513] border-[#8b4513]",
    "bg-[#008000] hover:bg-[#008000] border-[#008000]",
  ],
  "4": [
    "bg-[#00ff00] hover:bg-[#00ff00] border-[#00ff00]",
    "bg-[#c92d2d] hover:bg-[#c92d2d] border-[#c92d2d]",
  ],
  "5": [
    "bg-[#ffd700] hover:bg-[#ffd700] border-[#ffd700]",
    "bg-[#000000] hover:bg-[#000000] border-[#000000]",
  ],
};
const TeamCard: React.FC<ITeamCard> = ({ team, selectedTeam, index }) => {
  const [starRating, setStarRating] = useState(() =>
    calculateStarRating(team.attack, team.defense)
  );

  const controls = useAnimation();
  useEffect(() => {
    controls.start({ width: `${(starRating % 1) * 100}%` });
    setStarRating(calculateStarRating(team.attack, team.defense));
  }, [team.attack, team.defense]);

  const badgeColorOneStyle = {
    borderColor: `var(--${team.colors[0]})`,
    backgroundColor: `var(--${team.colors[0]})`,
  };
  const badgeColorTwoStyle = {
    borderColor: `var(--${team.colors[1]})`,
    backgroundColor: `var(--${team.colors[1]})`,
  };

  // ...

  // ...

  return (
    <div className="relative">
      <TooltipProvider delayDuration={200}>
        <Tooltip defaultOpen={index !== selectedTeam ? false : true}>
          <TooltipTrigger asChild>
            <Card
              className="flex flex-col gap-8   text-black  items-center border bg-neutral-100 cursor-pointer  p-2.5 w-80 h-[50vh] mt-4 rounded-[10px] border-solid  border-[#ddd]"
              onClick={() => {
                console.log("team", team.name);
                //   onTeamSelected(team.name);
                //   setIsGameStarted(true);
              }}
            >
              <div className="flex items-center justify-center flex-col gap-4">
                <h3 className="font-bold text-2xl  tracking-tighter mt-2">
                  {team.name}
                </h3>
                <div className="w-36 h-36 rounded">
                  <Image
                    width={144}
                    height={144}
                    src={`/${team.image}.svg`}
                    alt={team.name}
                    className="w-full h-full"
                  />
                  <motion.div
                    className="relative right-[30%]"
                    layout
                    initial={{ width: "0%" }}
                    animate={controls}
                    transition={{
                      duration: 0.5,
                    }}
                  >
                    {renderStars(starRating)}
                  </motion.div>
                  <div className="flex items-center justify-around mt-6">
                    <div className="flex flex-col gap-2 items-center">
                      <h2 className="font-bold text-xl tracking-tighter underline">
                        ATT
                      </h2>
                      <p className="text-lg tracking-tight">{team.attack}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                      <h2 className="font-bold text-xl tracking-tighter underline">
                        DEF
                      </h2>
                      <p className="text-lg tracking-tight">{team.defense}</p>
                    </div>
                  </div>
                  {/* <Avatar>
          <AvatarImage src={`/${team.image}.png`} alt={team.name} />
          <AvatarFallback>{team.name}</AvatarFallback>
        </Avatar> */}
                </div>
              </div>
            </Card>
          </TooltipTrigger>
          {index === selectedTeam && (
            <TooltipContent
              side="top"
              className="absolute flex flex-col items-center  w-[40vh]"
            >
              <CardHeader>
                <CardTitle className="text-lg font-bold">{team.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2   ">
                <div>
                  <h3 className="text-sm font-semibold">Founding Year</h3>
                  <p className="text-xs">{team.foundingYear}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold">Colors</h3>
                  <div className="flex space-x-2">
                    <Badge
                      className={`${colorVariants[index][0]} `}
                      variant={"default"}
                    >
                      <p className="text-xs text-white">{team.colors[0]}</p>
                    </Badge>
                    <Badge
                      variant={"default"}
                      className={`${colorVariants[index][1]} `}
                    >
                      <p className="text-xs text-white">{team.colors[1]}</p>
                    </Badge>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Achievements</h3>
                  <ul>
                    {team.achievements.map((ach) => {
                      return (
                        <li key={ach} className="text-xs ">
                          {ach}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Fanbase</h3>
                  <p className="text-xs">{team.fanbase}</p>
                </div>
              </CardContent>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
export default TeamCard;

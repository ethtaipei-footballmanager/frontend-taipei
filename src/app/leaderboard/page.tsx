"use client";
import { useState } from "react";
// import { getLeaderboard, storeLeaderboard } from "./db";
// import { sdk } from "./sdk";

// import './Leaderboard.css'; // Assuming you have a separate CSS file for the Leaderboard
import PlayerDetails from "@/components/PlayerDetails";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const calculateTotalPoints = (win: number, draw: number) => {
    return win * 3 + draw;
  };

  //   useEffect(() => {
  //     const refresh = async () => {
  //       await refreshLeaderboard();
  //     };
  //     refresh();
  //     const lb = getLeaderboard();
  //     console.log("🚀 ~ file: Leaderboard.jsx:19 ~ useEffect ~ lb:", lb);
  //     setLeaderboard(lb);
  //   }, []);

  //   const refreshLeaderboard = async () => {
  //     setIsLoading(true);
  //     try {
  //       const lb = await sdk.retrieveLeaderboard();
  //       console.log(
  //         "🚀 ~ file: Leaderboard.jsx:31 ~ refreshLeaderboard ~ lb:",
  //         lb
  //       );
  //       storeLeaderboard(lb);
  //       setLeaderboard(lb);
  //       return lb;
  //     } catch (error) {
  //       console.error(error);
  //     }
  //     setIsLoading(false);
  //   };

  return (
    <section className="w-full  text-black py-6 px-2 md:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-2 tracking-tighter">
          Leo League Leaderboard
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Team</TableHead>
                <TableHead className="underline">GP</TableHead>
                <TableHead className="underline">W</TableHead>
                <TableHead className="underline">D</TableHead>
                <TableHead className="underline">L</TableHead>
                <TableHead className="underline">GF</TableHead>
                <TableHead className="underline">GA</TableHead>
                <TableHead className="underline">P</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {leaderboard &&
                leaderboard.players
                  .sort((a, b) => a.position - b.position)
                  .map((player) => (
                    <TableRow key={player.user}>
                      <TableCell className="flex items-center">
  
                        <span className="font-medium">
                          {truncateAddress(player.user)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {player.win + player.draw + player.loss}
                      </TableCell>
                      <TableCell>{player.win}</TableCell>
                      <TableCell>{player.draw}</TableCell>
                      <TableCell>{player.loss}</TableCell>
                      <TableCell>{player.goals_scored}</TableCell>
                      <TableCell>{player.goals_conceded}</TableCell>
  
                      <TableCell>
                        {calculateTotalPoints(player.win, player.draw)}
                      </TableCell>
                    </TableRow>
                  ))}  */}
            </TableBody>
          </Table>
        </div>
        <PlayerDetails />
      </div>
    </section>
  );
};

export default Leaderboard;

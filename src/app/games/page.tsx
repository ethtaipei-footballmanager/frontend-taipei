"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const games = [
  {
    id: 1,
    homeTeam: "Fenerbahçe",
    homeLogo: "team-a.svg",
    awayTeam: "Galatasaray",
    awayLogo: "team-b.svg",
    score: "2-1",
    state: "completed",
  },
  {
    id: 2,
    homeTeam: "Beşiktaş",
    homeLogo: "team-c.svg",
    awayTeam: "Galatasaray",
    awayLogo: "team-b.svg",
    score: "2-1",
    state: "completed",
  },
  {
    id: 3,
    homeTeam: "Galatasaray",
    homeLogo: "team-b.svg",
    awayTeam: "Fenerbahçe",
    awayLogo: "team-a.svg",
    score: "0-2",
    state: "completed",
  },
  {
    id: 4,
    homeTeam: "Fenerbahçe",
    homeLogo: "team-a.svg",
    awayTeam: "Beşiktaş",
    awayLogo: "team-c.svg",
    score: "3-1",
    state: "completed",
  },
];

const Games = () => {
  // You'll need to fetch or manage game data in state
  // This is just placeholder content
  const router = useRouter();

  return (
    <section className="w-screen p-4 overflow-y-auto">
      {/* <div className="flex w-full justify-center mt-3 ">
        <div className="flex w-full  max-w-sm items-center space-x-2">
          <Input type="text" className="text-black" placeholder="Room ID" />
          <Button onClick={() => router.push(`/game-room/3`)}>Join Room</Button>
        </div>
      </div> */}
      <div className="grid grid-cols-1  place-items-center lg:grid-cols-2 xl:grid-cols-3 gap-6  mt-4  mx-8">
        {games.map((game) => (
          <Card
            key={game.id}
            className="  max-w-md shadow-lg rounded-xl overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row justify-center items-center lg:justify-between p-6 space-y-6 sm:space-y-0">
              <div className="flex items-center ">
                <img
                  alt="Team A Logo"
                  className="rounded-full"
                  height="50"
                  src={game.homeLogo}
                  style={{
                    aspectRatio: "50/50",
                    objectFit: "cover",
                  }}
                  width="50"
                />
                <span className="font-bold text-lg">{game.homeTeam}</span>
              </div>
              <div className="text-center">
                <p className="text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                  Premier League
                </p>
                <p className="text-xl font-bold">{game.score}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {game.state === "completed" ? "Full Time" : "Ongoing"}
                </p>
              </div>
              <div className="flex items-center ">
                <span className="font-bold text-lg">{game.awayTeam}</span>
                <img
                  alt="Team B Logo"
                  className="rounded-full"
                  height="50"
                  src={game.awayLogo}
                  style={{
                    aspectRatio: "50/50",
                    objectFit: "cover",
                  }}
                  width="50"
                />
              </div>
            </div>
            <div className="flex w-full items-center justify-center">
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Match Date: 15th Nov 2023
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Stadium: Wembley, London
                </p>
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
            <div className="px-6 py-2 border-t border-gray-100 dark:border-gray-700">
              <Button className="w-full" variant="outline">
                {game.state === "completed" ? "View Match Statistics" : "Play"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Games;

"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card } from "./ui/card";

interface IPlayerDetails {}

const data = [
  {
    attribute: "Attack",
    A: 86,
    fullMark: 100,
  },
  {
    attribute: "Defense",
    A: 98,
    fullMark: 100,
  },
  {
    attribute: "Tactics",
    A: 86,
    fullMark: 100,
  },
  {
    attribute: "Supporters",
    A: 85,
    fullMark: 100,
  },
  {
    attribute: "Midfield",
    A: 65,
    fullMark: 100,
  },
];

const PlayerDetails: React.FC<IPlayerDetails> = ({}) => {
  return (
    <Card>
      <div className=" w-full h-[200px]  rounded">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="attribute" />
            <Tooltip />
            <Radar
              name="Team"
              dataKey="A"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.75}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
export default PlayerDetails;

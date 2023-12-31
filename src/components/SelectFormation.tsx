import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ISelectFormation {
  selectedFormation: string;
  setSelectedFormation: (val: string) => void;
}

const SelectFormation: React.FC<ISelectFormation> = ({
  setSelectedFormation,
  selectedFormation,
}) => {
  return (
    <Select>
      <SelectTrigger className="w-[180px] text-black">
        <SelectValue className="" placeholder="Select a formation" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Formations</SelectLabel>
          <SelectItem value="0" onClick={() => setSelectedFormation("4-3-3")}>
            4-3-3
          </SelectItem>
          <SelectItem value="1" onClick={() => setSelectedFormation("4-2-3-1")}>
            4-2-3-1
          </SelectItem>
          <SelectItem value="2" onClick={() => setSelectedFormation("3-5-2")}>
            3-5-2
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default SelectFormation;

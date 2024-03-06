import { useRecords } from "@puzzlehq/sdk";

export const useMsRecords = (address?: string) => {
  console.log("🚀 ~ useMsRecords ~ address:", address);
  const { records } = useRecords({
    filter: {
      programIds: [
        "football_game_v013.aleo",
        "puzzle_pieces_v016.aleo",
        "multiparty_pvp_utils_v015_avh.aleo",
      ],
      type: "unspent",
    },
    address,
    page: 1,
    multisig: true,
  });
  console.log("🚀 ~ useMsRecords ~ records:", records, address);
  const msGameRecords = records?.filter(
    (record) => record.programId === "football_game_v013.aleo"
  );
  const msPuzzleRecords = records?.filter(
    (record) => record.programId === "puzzle_pieces_v016.aleo"
  );
  const msUtilRecords = records?.filter(
    (record) => record.programId === "multiparty_pvp_utils_v015_avh.aleo"
  );

  console.log("recordsss", [msGameRecords, msPuzzleRecords, msUtilRecords]);

  return { msPuzzleRecords, msGameRecords, msUtilRecords };
};

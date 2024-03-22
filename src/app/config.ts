import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { http } from "wagmi";
import { ten } from "../utils/chains";

export const config = getDefaultConfig({
  appName: "Super Leo Lig",
  projectId: "2467c634f2cd36c070a52b8f688931da",
  chains: [ten],
  transports: {
    [ten.id]: http(),
  },
});

// export const config = createConfig({
//   chains: [ten],
//   transports: {
//     [ten.id]: http(),
//   },
// });

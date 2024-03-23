import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { lineaTestnet, scrollSepolia } from "viem/chains";
import { http } from "wagmi";
import { ten } from "../utils/chains";

export const config = getDefaultConfig({
  appName: "Ten Taipei Football Manager",
  projectId: "2467c634f2cd36c070a52b8f688931da",
  chains: [ten, scrollSepolia, lineaTestnet],
  transports: {
    [ten.id]: http(),
    [lineaTestnet.id]: http(),
    [scrollSepolia.id]: http(),
  },
  ssr: true,
});

// export const config = createConfig({
//   chains: [ten],
//   transports: {
//     [ten.id]: http(),
//   },
// });

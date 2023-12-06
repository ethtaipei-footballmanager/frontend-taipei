"use client";

import { PuzzleWalletProvider } from "@puzzlehq/sdk";
import { ThemeProvider } from "next-themes";
//@ts-ignore
export function Providers({ children }) {
  return (
    <ThemeProvider enableSystem defaultTheme="system" attribute="class">
      <PuzzleWalletProvider
        dAppName="Super Leo Lig"
        dAppDescription="Zk Football Manager game"
        dAppUrl="https://localhost:3000/"
        dAppIconURL="https://wheresalex.puzzle.online/alex_head.png"
      >
        {children}
      </PuzzleWalletProvider>
    </ThemeProvider>
  );
}

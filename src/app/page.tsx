"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { configureConnection } from "@puzzlehq/sdk";
import ConnectWallet from "@/components/ConnectWallet";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    configureConnection({
      dAppName: "<YOUR DAPP NAME>",
      dAppDescription: "<YOUR DAPP DESCRIPTION>",
      dAppUrl: "<YOUR DAPP URL>",
      dAppIconURL: "<YOUR DAPP ICON URL>",
    });
  }, []);

  return (
    <div>
      <ConnectWallet />
    </div>
  );
}

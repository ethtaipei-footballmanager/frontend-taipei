"use client";
import Navbar from "@/components/Navbar";
import { configureConnection } from "@puzzlehq/sdk";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const initializeWallet = async () => {
      configureConnection({
        dAppName: "Super Leo Lig",
        dAppDescription: "Zk Football Manager game",
        dAppUrl: "https://localhost:3000/",
        dAppIconURL: "<YOUR DAPP ICON URL>",
      });
    };

    initializeWallet();
    console.log("connection");
  }, []);

  return (
    <div>
      <Navbar />
    </div>
  );
}

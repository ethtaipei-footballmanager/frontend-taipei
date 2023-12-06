"use client";
import { configureConnection, useAccount } from "@puzzlehq/sdk";
import { useEffect } from "react";

export default function Home() {
  const { account, error, loading } = useAccount();

  console.log("account navbar", account);
  useEffect(() => {
    const initializeWallet = async () => {
      configureConnection({
        dAppName: "Super Leo Lig",
        dAppDescription: "Zk Football Manager game",
        dAppUrl: "https://localhost:3000/",
        dAppIconURL: "https://wheresalex.puzzle.online/alex_head.png",
      });
    };

    initializeWallet();
    console.log("connection");
  }, []);

  return <div>{/* <Navbar /> */}</div>;
}

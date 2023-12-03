"use client";
import { connect, useAccount } from "@puzzlehq/sdk";
import React, { useEffect } from "react";
import { Button } from "./ui/button";

interface IConnectWallet {}

const ConnectWallet: React.FC<IConnectWallet> = ({}) => {
  //   const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState<string | undefined>();
  const { account, error, loading } = useAccount();

  const connectWallet = async () => {
    // setLoading(true);
    // setError(undefined);
    try {
      const session = await connect();
      console.log(
        "🚀 ~ file: ConnectWallet.tsx:18 ~ connectWal ~ session:",
        session
      );
      console.log("account", account);
    } catch (e) {
      //   setError((e as Error).message);
    } finally {
      //   setLoading(false);
    }
  };

  useEffect(() => {
    console.log("account", account, error, loading);
  }, [account]);

  return (
    <>
      <Button onClick={connectWallet}>ConnectWallet</Button>;
      {account && <p>you did it!</p>}
      {error && <p>error connecting: {error}</p>}
    </>
  );
};
export default ConnectWallet;

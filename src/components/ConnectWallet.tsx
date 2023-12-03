"use client";
import {
  disconnect,
  shortenAddress,
  useAccount,
  useConnect,
} from "@puzzlehq/sdk";
import React, { useEffect } from "react";
import { ThemeToggle } from "./ToggleTheme";
import { Button } from "./ui/button";

interface IConnectWallet {}

const ConnectWallet: React.FC<IConnectWallet> = ({}) => {
  //   const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState<string | undefined>();
  const { account, error, loading } = useAccount();
  const { connect } = useConnect();

  const connectWallet = async () => {
    // setLoading(true);
    // setError(undefined);
    try {
      await connect();

      console.log("account", account);
    } catch (e) {
      //   setError((e as Error).message);
    } finally {
      //   setLoading(false);
    }
  };

  useEffect(() => {
    console.log("account123", account, error, loading);
  }, [account]);

  return (
    <div className="flex gap-6">
      {account ? (
        <Button onClick={disconnect}>{shortenAddress(account.address)}</Button>
      ) : (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )}
      <ThemeToggle />
    </div>
  );
};
export default ConnectWallet;

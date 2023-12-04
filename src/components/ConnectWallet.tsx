"use client";
import { shortenAddress, useAccount, useConnect } from "@puzzlehq/sdk";
import { SessionTypes } from "@walletconnect/types";
import React, { useEffect, useState } from "react";
import { ThemeToggle } from "./ToggleTheme";
// @ts-ignore https://github.com/doke-v/react-identicons/issues/40
import Identicon from "react-identicons";
import { Button } from "./ui/button";
interface IConnectWallet {
  setIsWalletModal: (val: boolean) => void;
}

const ConnectWallet: React.FC<IConnectWallet> = ({ setIsWalletModal }) => {
  //   const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState<string | undefined>();
  const { account, error, loading } = useAccount();
  const [address, setAddress] = useState("");
  const { connect } = useConnect();

  const connectWallet = async () => {
    // setLoading(true);
    // setError(undefined);
    try {
      const session: SessionTypes.Struct = await connect();

      console.log("account", session);
    } catch (err) {
      //   setError((e as Error).message);
      console.log("error", err);
    }
  };

  console.log("hey account", account);

  useEffect(() => {
    setAddress(account?.address);
  }, [account]);

  return (
    <div className="flex gap-6">
      {account ? (
        <Button
          onClick={() => setIsWalletModal(true)}
          variant="outline"
          className="tracking-wider text-base text-black dark:text-white font-semibold flex gap-2"
        >
          {address && <Identicon string={shortenAddress(address)} size={24} />}
          {address && shortenAddress(address)}
        </Button>
      ) : (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )}
      <ThemeToggle />
    </div>
  );
};
export default ConnectWallet;

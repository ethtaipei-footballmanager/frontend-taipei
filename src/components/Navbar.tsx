"use client";

import { buttonVariants } from "@/components/ui/button";
import { useAccount } from "@puzzlehq/sdk";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ConnectWallet from "./ConnectWallet";
import WalletModal from "./WalletModal";
const Navbar = () => {
  const { account, error, loading } = useAccount();
  const [isWalletModal, setIsWalletModal] = useState(false);

  return (
    <nav className=" w-screen z-10 flex bg-slate-400 dark:bg-black text-white justify-between items-center py-3 px-6">
      <div>
        <Link href="/" className="">
          {/* <Button variant="default">Home</Button> */}
          <Image width={64} height={64} src={"/logo_2.png"} alt="logo" />
        </Link>
      </div>
      <div className="flex text-white  items-center ml-8">
        <Link
          href="/games"
          className={`text-white ${buttonVariants({
            variant: "link",
            size: "lg",
          })}`}
          // className=""
        >
          {/* <Button variant="link" size="lg" >
            Games
          </Button> */}
          Games
        </Link>
        <Link
          href="/leaderboard"
          className={`text-white ${buttonVariants({
            variant: "link",
            size: "lg",
          })}`}
          // className=""
        >
          Leaderboard
        </Link>
        <Link
          href="/create-game"
          className={`text-white ${buttonVariants({
            variant: "link",
            size: "lg",
          })}`}
          // className=""
        >
          Create Game
        </Link>
      </div>
      <ConnectWallet setIsWalletModal={setIsWalletModal} />
      {isWalletModal && <WalletModal setIsWalletModal={setIsWalletModal} />}
    </nav>
  );
};

export default Navbar;

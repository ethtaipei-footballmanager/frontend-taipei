"use client";

import { useAccount } from "@puzzlehq/sdk";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import ConnectWallet from "./ConnectWallet";
import { ThemeToggle } from "./ToggleTheme";
import { buttonVariants } from "./ui/button";
const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { account, error, loading } = useAccount();
  const [isWalletModal, setIsWalletModal] = useState(false);
  const { width } = useWindowSize();

  useEffect(() => {
    if (width > 768) {
      setIsNavOpen(false);
    }
  }, [width]);

  return (
    // <nav className=" border-b w-full z-10 flex  bg-white dark:bg-black justify-between items-center py-1 px-6">
    //   <div>
    //     <Link href="/" className="">
    //       <Image width={48} height={48} src={"/logo_2.png"} alt="logo" />
    //     </Link>
    //   </div>
    //   <div className="flex   items-center ml-8">
    //     <Link
    //       href="/games"
    //       className={`text-black ${buttonVariants({
    //         variant: "link",
    //         size: "lg",
    //       })}`}
    //       // className=""
    //     >
    //       {/* <Button variant="link" size="lg" >
    //         Games
    //       </Button> */}
    //       Games
    //     </Link>
    //     <Link
    //       href="/leaderboard"
    //       className={`text-black ${buttonVariants({
    //         variant: "link",
    //         size: "lg",
    //       })}`}
    //       // className=""
    //     >
    //       Leaderboard
    //     </Link>
    //     <Link
    //       href="/create-game"
    //       className={`text-black ${buttonVariants({
    //         variant: "link",
    //         size: "lg",
    //       })}`}
    //       // className=""
    //     >
    //       Create Game
    //     </Link>
    //   </div>
    //   <ConnectWallet setIsWalletModal={setIsWalletModal} />
    //   {/* {isWalletModal && <WalletModal setIsWalletModal={setIsWalletModal} />} */}
    // </nav>

    <nav className="py-1 px-6  border-b flex bg-white dark:bg-black  w-full z-20 top-0 left-0  ">
      <div className="container  cursor-pointer flex flex-wrap justify-between items-center mx-auto">
        <div>
          <Link href="/" className="">
            <Image width={48} height={48} src={"/logo_2.png"} alt="logo" />
          </Link>
        </div>
        <div className="flex md:order-2 gap-2">
          <ConnectWallet setIsWalletModal={setIsWalletModal} />

          <button
            type="button"
            className="inline-flex items-center p-2 text-sm  rounded-lg lg:hidden  focus:outline-none focus:ring-2  text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
            onClick={() => setIsNavOpen((prevState) => !prevState)}
          >
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div
          className={
            isNavOpen
              ? " justify-between mt-4 items-center w-full lg:flex lg:w-auto lg:order-1 -ml-8"
              : "justify-between items-center w-full lg:flex lg:w-auto lg:order-1 hidden"
          }
          id="navbar-sticky"
        >
          <ul className="flex flex-col ml-8 w-full relative   rounded-lg border  md:flex-row md:space-x-4 lg:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0  bg-white dark:bg-black ">
            <li>
              <Link
                href="/games"
                className={`text-black ${buttonVariants({
                  variant: "link",
                })}`}
              >
                Games
              </Link>
            </li>
            <li>
              <Link
                href="/your-games"
                className={`text-black ${buttonVariants({
                  variant: "link",
                })}`}
              >
                Your Games
              </Link>
            </li>
            <li>
              <Link
                href="/leaderboard"
                className={`text-black ${buttonVariants({
                  variant: "link",
                })}`}
              >
                Leaderboard
              </Link>
            </li>

            <li>
              <Link
                href="/create-game"
                className={`text-black ${buttonVariants({
                  variant: "link",
                })}`}
              >
                Create Game
              </Link>
            </li>
            <li className="absolute md:hidden top-2 right-2 ">
              {/* <Button variant={"link"} className={`text-black `}>
                Change Theme
              </Button> */}
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

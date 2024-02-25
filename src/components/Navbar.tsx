"use client";

import { cn } from "@/lib/utils";
import { useAccount } from "@puzzlehq/sdk";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import ConnectWallet from "./ConnectWallet";
import {
  FloatingMenu,
  HoveredLink,
  MobileMenu,
  MobileMenuItem,
} from "./FloatingMenu";
import { buttonVariants } from "./ui/button";
const Navbar = ({ className }: { className?: string }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { account, error, loading } = useAccount();
  const pathname = usePathname();
  console.log("🚀 ~ Navbar ~ pathname:", pathname);

  const [isWalletModal, setIsWalletModal] = useState(false);
  const { width } = useWindowSize();
  const [active, setActive] = useState<boolean>(false);
  useEffect(() => {
    if (width > 768) {
      setIsNavOpen(false);
    }
  }, [width]);

  return (
    // <nav className=" sticky py-1 px-6  border-b flex bg-white dark:bg-black  w-full z-20 top-0 left-0  ">
    //   <div className="container  cursor-pointer flex flex-wrap justify-between items-center mx-auto">
    //     <div>
    //       <Link href="/" className="">
    //         <Image width={48} height={48} src={"/logo_2.png"} alt="logo" />
    //       </Link>
    //     </div>
    //     <div className="flex lg:order-2 gap-2">
    //       <ConnectWallet setIsWalletModal={setIsWalletModal} />

    //       <button
    //         type="button"
    //         className="inline-flex items-center p-2 text-sm  rounded-lg lg:hidden  focus:outline-none focus:ring-2  text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
    //         onClick={() => setIsNavOpen((prevState) => !prevState)}
    //       >
    //         <svg
    //           className="w-6 h-6"
    //           aria-hidden="true"
    //           fill="currentColor"
    //           viewBox="0 0 20 20"
    //           xmlns="http://www.w3.org/2000/svg"
    //         >
    //           <path
    //             fillRule="evenodd"
    //             d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
    //             clipRule="evenodd"
    //           ></path>
    //         </svg>
    //       </button>
    //     </div>
    //     <div
    //       className={
    //         isNavOpen
    //           ? " justify-between mt-4 items-center w-full lg:flex lg:w-auto lg:order-1 -ml-8"
    //           : "justify-between items-center w-full lg:flex lg:w-auto lg:order-1 hidden"
    //       }
    //       id="navbar-sticky"
    //     >
    //       <ul className="flex flex-col ml-8 w-full relative   rounded-lg border  lg:flex-row  lg:space-x-8 lg:mt-0 lg:text-sm lg:font-medium lg:border-0  bg-white dark:bg-black ">
    //         {/* <li>
    //           <Link
    //             href="/games"
    //             className={`text-black ${buttonVariants({
    //               variant: "link",
    //             })}`}
    //           >
    //             Games
    //           </Link>
    //         </li> */}
    //         <li>
    //           <Link
    //             href="/your-games"
    //             className={`text-black ${buttonVariants({
    //               variant: "link",
    //             })}`}
    //           >
    //             Your Games
    //           </Link>
    //         </li>
    //         {/* <li>
    //           <Link
    //             href="/leaderboard"
    //             className={`text-black ${buttonVariants({
    //               variant: "link",
    //             })}`}
    //           >
    //             Leaderboard
    //           </Link>
    //         </li> */}

    //         <li>
    //           <Link
    //             href="/create-game"
    //             className={`text-black ${buttonVariants({
    //               variant: "link",
    //             })}`}
    //           >
    //             Create Game
    //           </Link>
    //         </li>
    //         <li className="absolute md:hidden top-2 right-2 ">
    //           {/* <Button variant={"link"} className={`text-black `}>
    //             Change Theme
    //           </Button> */}
    //           <ThemeToggle />
    //         </li>
    //       </ul>
    //     </div>
    //   </div>
    // </nav>
    <div
      className={` flex justify-between pt-3 md:pt-6 items-center md:items-end    px-6 ${
        pathname === "/" ? "bg-[#E0F4FF]" : "bg-transparent"
      }  dark:bg-black  w-full z-20 top-0 left-0`}
    >
      {width < 768 ? (
        <MobileMenu setActive={setActive}>
          {/* <Link
              href="/your-games"
              className={`text-black ${buttonVariants({
                variant: "link",
              })}`}
            >
              Your Games
            </Link>
            <Link
              href="/create-game"
              className={`text-black ${buttonVariants({
                variant: "link",
              })}`}
            >
              Create Game
            </Link> */}

          <MobileMenuItem
            setActive={setActive}
            active={active}
            // item={<IoFootballOutline className="h-4 w-4 " />}
            item={
              <Image
                width={48}
                height={48}
                src={"/logo_2.png"}
                className="rounded-full"
                alt="logo"
              />
            }
          >
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/create-game">Create Game</HoveredLink>
              <HoveredLink href="/your-games">Your Games</HoveredLink>
            </div>
          </MobileMenuItem>
        </MobileMenu>
      ) : (
        <Link href="/" className="">
          <Image
            width={48}
            height={48}
            src={"/logo_2.png"}
            className="rounded-full"
            alt="logo"
          />
        </Link>
      )}
      <div
        className={cn(
          "fixed flex items-center  justify-center top-6 inset-x-0 max-w-xl mx-auto z-50",
          className
        )}
      >
        {width > 768 && (
          <FloatingMenu setActive={setActive}>
            <Link
              href="/your-games"
              className={`text-black ${buttonVariants({
                variant: "link",
              })}`}
            >
              Your Games
            </Link>
            <Link
              href="/create-game"
              className={`text-black ${buttonVariants({
                variant: "link",
              })}`}
            >
              Create Game
            </Link>
          </FloatingMenu>
        )}
      </div>
      <ConnectWallet setIsWalletModal={setIsWalletModal} />
    </div>
  );
};

export default Navbar;

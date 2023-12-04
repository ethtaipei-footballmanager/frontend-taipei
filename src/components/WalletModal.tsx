"use client";
import {
  disconnect,
  shortenAddress,
  useAccount,
  useBalance,
} from "@puzzlehq/sdk";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoCopyOutline, IoLogOutOutline } from "react-icons/io5";
import { MdDone } from "react-icons/md";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import Identicon from "react-identicons";

interface IWalletModal {
  //   logout: () => void;
  setIsWalletModal: (val: boolean) => void;
}

const WalletModal: React.FC<IWalletModal> = ({
  //   logout,
  setIsWalletModal,
}) => {
  //   const { data } = useBalance({
  //     address: wallet?.address,
  //   });
  //   console.log("🚀 ~ file: EmbeddedWalletModal.tsx:33 ~ data:", data);

  const ref = useRef<HTMLDivElement | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { account } = useAccount();
  const { balances } = useBalance();
  console.log("🚀 ~ file: WalletModal.tsx:31 ~ balances:", balances);

  useEffect(() => {
    function handleEvent(event: MouseEvent) {
      const clickedElement = event.target as HTMLElement;
      const clickedElementId = clickedElement.id;
      console.log(
        "🚀 ~ file: LoginWithEmail.tsx:122 ~ handleEvent ~ clickedElementId:",
        clickedElementId
      );

      if (clickedElementId === "bg") {
        closeModal();
      }
    }

    document.addEventListener("mousedown", handleEvent);

    return () => {
      document.removeEventListener("mousedown", handleEvent);
    };
  }, [ref]);

  const closeModal = () => {
    setIsWalletModal(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(account.address as string);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1200);
  };
  return (
    <div
      id="bg"
      ref={ref}
      className="fixed inset-0 flex  bg-opacity-40 items-center justify-center z-10 divide-y divide-gray-200 bg-[#b2b2b2]"
    >
      <div
        id="modal"
        className="relative bg-[#f4f4f4] rounded-xl shadow-2xl  drop-shadow-2xl w-96 border-2 h-72"
      >
        <AiOutlineClose
          className="absolute right-6 top-4 cursor-pointer"
          onClick={closeModal}
        />
        <div className="absolute top-12 flex gap-2 w-full flex-col justify-center items-center">
          <Identicon string={shortenAddress(account.address)} size={32} />
          <div className="flex flex-col gap-0.5  justify-center text-center ">
            <h1 className="font-bold tracking-lighter  text-[#25292e] text-[18px] ">
              {shortenAddress(account.address)}
            </h1>
            <h1 className="font-semibold tracking-tighter text-[#868989] ">
              Public Balance: {balances && balances[0].public.toFixed(2)}
            </h1>
            <h1 className="font-semibold tracking-tighter text-[#868989] ">
              Private Balance: {balances && balances[0].public.toFixed(2)}
            </h1>
          </div>
        </div>
        <div className="absolute bottom-4 w-full flex gap-8 justify-center">
          <button
            onClick={copyAddress}
            className="flex flex-col gap-1 bg-[#fafafa] w-2/5 hover:scale-105 transition duration-200 ease-in-out rounded-lg py-2.5 justify-center items-center"
          >
            {isCopied ? (
              <>
                <MdDone
                  className=" cursor-pointer  stroke-black  text-black fill-current"
                  size={24}
                />
                <span className="text-xs  font-semibold text-black">
                  Copied
                </span>
              </>
            ) : (
              <>
                <IoCopyOutline
                  className=" stroke-black  text-black fill-current  cursor-pointer"
                  size={24}
                />
                <span className="text-xs mt-1 font-semibold text-black">
                  Copy Address
                </span>
              </>
            )}
          </button>
          <button
            onClick={() => {
              setIsWalletModal(false);
              disconnect();
            }}
            className="flex flex-col gap-1 bg-[#fafafa] w-2/5 hover:scale-105 transition duration-200 ease-in-out rounded-lg py-2.5 justify-center items-center"
          >
            <IoLogOutOutline
              className="stroke-black  text-black fill-current cursor-pointer"
              size={28}
            />
            <span className="text-xs font-semibold text-black">Disconnect</span>{" "}
          </button>
        </div>
      </div>
    </div>
  );
};
export default WalletModal;

import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

import { WalletConnectModal } from "./WalletConnectModal";

const truncateWalletAddress = (address: string | undefined): string => {
  return !address
    ? ""
    : `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const WalletConnectButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { disconnect } = useDisconnect();
  const { address: walletAddress, isConnected } = useAccount();

  // auto hide modal upon wallet connection success
  if (isOpen && isConnected) setIsOpen(false);

  // show wallet connection modal when opened
  if (isOpen) {
    return <WalletConnectModal isOpen={isOpen} setIsOpen={setIsOpen} />;
  }

  if (isConnected) {
    return (
      <div>
        <button className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded" onClick={() => disconnect()}>
          Disconnect {truncateWalletAddress(walletAddress)}
        </button>
      </div>
    );
  }

  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setIsOpen(true)}>
      Connect Wallet
    </button>
  );
};

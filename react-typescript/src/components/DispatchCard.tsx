import {
  Dispatch,
  IOnExecuteContract,
  IOnGetTokenBalance,
  IOnNoWalletConnected,
  IOnRecordEventSuccess,
  IOnRequestWalletConnection,
  IOnRequestWalletDisconnection,
  IOnSignMessage,
  IOnSwitchNetworkPrompt,
} from "@iex-xyz/sdk";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BigNumber } from "ethers";
import { fetchBalance, prepareWriteContract, writeContract } from "@wagmi/core";
import { useAccount, useDisconnect, useSignMessage, useSwitchNetwork, useNetwork } from "wagmi";
import { Address } from "abitype";

import { WalletConnectModal } from "./WalletConnectModal"

interface DispatchCardProps {
  dispatchMessageId: string;
}

const DispatchCard = ({ dispatchMessageId }: DispatchCardProps) => {
  const { address: walletAddress, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { switchNetwork } = useSwitchNetwork();
  const { disconnectAsync } = useDisconnect();
  const { chain } = useNetwork();
  const [dispatch] = useState(Dispatch());
  const [dispatchEmbedUrl, setDispatchEmbedUrl] = useState<string>();
  const [isWalletConnectOpen, setIsWalletConnectOpen] = useState(false);

  useEffect(() => {
    setDispatchEmbedUrl(
      dispatch.create({
        autoHeight: true,
        dispatchMessageId,
        onExecuteContract: handleExecuteContract,
        onGetTokenBalance: handleGetTokenBalance,
        onNoWalletConnected: handleNoWalletConnected,
        onRecordEventSuccess: handleRecordEventSuccess,
        onRequestWalletConnection: handleRequestWalletConnection,
        onRequestWalletDisconnection: handleRequestWalletDisconnection,
        onSignMessage: handleSignMessage,
        onSwitchNetworkPrompt: handleNetworkChange,
        source: "dispatch-react-typescript-example",
        walletAddress,
      })
    );
    return () => dispatch.destroy();
  }, [switchNetwork, dispatchMessageId]);

  useEffect(() => {
    if (walletAddress) {
      dispatch.setWalletAddress(walletAddress);
    }
  }, [walletAddress]);

  useEffect(() => {
    dispatch.setChainId(chain?.id);
  }, [chain]);

  const handleRequestWalletConnection: IOnRequestWalletConnection = async () => {
    if (!isConnected) {
      setIsWalletConnectOpen(true);
    } else {
      console.log(
        "Can't request a wallet connection because the wallet is already connected."
      );
      toast("Wallet is already connected!", { type: "info" });
    }
  };

  const handleRequestWalletDisconnection: IOnRequestWalletDisconnection = async () => {
    if (isConnected) {
      await disconnectAsync();
    } else {
      console.log(
        "Can't request a wallet disconnection because no wallet is connected."
      );
      toast("No connected wallet to disconnect from!", { type: "info" });
    }
  };

  const handleSignMessage: IOnSignMessage = async ({ event }) => {
    const eventType = event.data.data.event.type
    try {
      const message = dispatch.formatMessageForSigning({
        dispatchMessageId: event.data.dispatchMessageId,
        type: eventType,
      });
      const signature = await signMessageAsync({ message });
      dispatch.generatedSignature({
        event,
        signature,
      });
      toast(`Successfully signed message. Event type: ${eventType}`);
    } catch (error: any) {
      toast(error.message, { type: "error" });
    }
  };

  const handleNoWalletConnected: IOnNoWalletConnected = () => {
    toast("Please connect a wallet.", { type: "error" });
  };

  const tweetMessage = () => {
    const tweet = "Tweeting from a Dispatch card inside an iframe.";
    const encodedTweet = encodeURIComponent(tweet);
    const url = `https://twitter.com/intent/tweet?text=${encodedTweet}`;
    window.open(url, "_blank");
  };

  const handleRecordEventSuccess: IOnRecordEventSuccess = ({ event }) => {
    const eventType = event.data.data.event.type;
    if (eventType === "SHARE") {
      tweetMessage();
      toast(`Successfully recorded event type: ${eventType}`);
    }
  };

  const handleNetworkChange: IOnSwitchNetworkPrompt = async ({ chainId }) => {
    if (switchNetwork) {
      switchNetwork(chainId);
    } else {
      // not all wallets handle network switching via wallet-connect because we can't have nice things
      toast("Please manually switch networks.", { type: "error" });
    }
  };

  const handleGetTokenBalance: IOnGetTokenBalance = async ({ event }) => {
    try {
      const balance = await fetchBalance({
        address: event.data.walletAddress,
        token: event.data.tokenAddress,
      });
      dispatch.sendTokenBalance({
        balance: balance || undefined,
      });
    } catch (error) {
      dispatch.sendTokenBalance({
        balance: undefined,
      });
      toast(`Get balance error: ${error}`, { type: "error" });
      console.error(error);
    }
  };

  const handleExecuteContract: IOnExecuteContract = async ({
    abi,
    args,
    contractAddress,
    functionName,
    msgValue,
    src,
  }) => {
    try {
      const config = await prepareWriteContract({
        abi,
        address: contractAddress as Address,
        args,
        functionName,
        overrides: {
          value: msgValue || "0",
        },
      });

      if (config?.request?.gasLimit) {
        // add some buffer just in case
        config.request.gasLimit = BigNumber.from(config?.request?.gasLimit).mul(
          2
        );
      }
      const { hash } = await writeContract(config as any);
      dispatch.executeContract({
        src,
        status: "fulfilled",
        transactionHash: hash,
      });
    } catch (error) {
      toast(`Contract write error: ${error}`, { type: "error" });
      console.log("write to contract error:", error);
      dispatch.executeContract({
        errorMessage: (error as any)?.message,
        src,
        status: "rejected",
      });
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center mx-auto pt-10">
      {isWalletConnectOpen && (
        <WalletConnectModal
          isOpen={isWalletConnectOpen}
          setIsOpen={setIsWalletConnectOpen}
        />
      )}
      {dispatchEmbedUrl ? (
        <iframe
          allow="clipboard-read; clipboard-write"
          width={600}
          src={dispatchEmbedUrl}
          title="dispatch poll card"
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
};

export default DispatchCard;

import {
  Dispatch,
  IOnNoWalletConnected,
  IOnRecordEventSuccess,
  IOnSignMessage,
} from "@iex-xyz/sdk";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useSignMessage } from "wagmi";

interface DispatchCardProps {
  dispatchMessageId: string;
}

const DispatchCard = ({ dispatchMessageId }: DispatchCardProps) => {
  const { address: walletAddress } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [dispatch] = useState(Dispatch());
  const [dispatchEmbedUrl, setDispatchEmbedUrl] = useState<string>();

  const signMessage: IOnSignMessage = async ({ event }) => {
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

  const noWalletConnected: IOnNoWalletConnected = () => {
    toast("Please connect a wallet.", { type: "error" });
  };

  const tweetMessage = () => {
    const tweet = "Tweeting from a Dispatch card inside an iframe.";
    const encodedTweet = encodeURIComponent(tweet);
    const url = `https://twitter.com/intent/tweet?text=${encodedTweet}`;
    window.open(url, "_blank");
  };

  const recordEventSuccess: IOnRecordEventSuccess = ({ event }) => {
    const eventType = event.data.data.event.type;
    if (eventType === "SHARE") {
      tweetMessage();
      toast(`Successfully recorded event type: ${eventType}`);
    }
  };

  useEffect(() => {
    setDispatchEmbedUrl(
      dispatch.create({
        backgroundColor: "FFFFFF",
        dispatchMessageId,
        onNoWalletConnected: noWalletConnected,
        onRecordEventSuccess: recordEventSuccess,
        onSignMessage: signMessage,
        source: "dispatch-react-example",
        walletAddress,
      })
    );
    return () => dispatch.destroy();
  }, [dispatch, dispatchMessageId]);

  useEffect(() => {
    if (walletAddress) {
      dispatch.setWalletAddress(walletAddress);
    }
  }, [walletAddress]);

  return (
    <div className="container flex flex-col items-center justify-center mx-auto pt-10">
      {dispatchEmbedUrl ? (
        <iframe
          allow="clipboard-read; clipboard-write"
          height={1000}
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

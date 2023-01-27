import * as React from "react";
import { allChains, configureChains, createClient, WagmiConfig } from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(allChains, [publicProvider()]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "Dispatch React Example",
      },
    }),
    new MetaMaskConnector({
      chains,
      options: {},
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
  provider,
});

export const WagmiProvider = ({ ...props }) => {
  return <WagmiConfig client={wagmiClient}>{props.children}</WagmiConfig>;
};

import * as React from "react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, goerli, polygonMumbai } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains([mainnet, goerli, polygon, polygonMumbai], [publicProvider()]);

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

import { Dialog } from "@headlessui/react";
import { useAccount, useConnect } from "wagmi";

// @ts-ignore
import WalletConnectLogo from '../assets/walletConnect.svg';
// @ts-ignore
import CoinbaseWalletLogo from '../assets/coinbaseWallet.svg';
// @ts-ignore
import MetamaskLogo from '../assets/metaMask.svg';

const getWalletLogo = (connector: string) => {
	let logo;
	switch(connector) {
		case "coinbaseWallet":
			logo = CoinbaseWalletLogo;
			break;
		case "metaMask":
			logo = MetamaskLogo;
			break;
		case "walletConnect":
			logo = WalletConnectLogo;
			break;
		default:
			break;
	}

	return <img
		alt="wallet logo"
		className="ml-1 rounded"
		height="30px"
		width="30px"
		src={logo}
	/>
}

type WalletConnectModalProps = {
	isOpen: boolean,
	setIsOpen: (isModalOpen: boolean) => void
}

const WalletConnectModal = ({ isOpen, setIsOpen }: WalletConnectModalProps) => {
	const { connect, connectors, isLoading, isSuccess, pendingConnector } =
		useConnect();
	const { isConnected } = useAccount();

	if (isConnected) return null;

	return (
		<Dialog
			open={isOpen}
			onClose={() => {
				return setIsOpen(false);
			}}
			className="relative z-99"
		>
			<div className="fixed inset-0 bg-black/50" aria-hidden="true" />
			<div className="fixed inset-0 flex items-center justify-center p-4">
				<Dialog.Panel className="w-[325px] max-w-sm bg-gray-900 max-w-md transform text-left align-middle shadow-xl transition-all">
					<div className="mt-3 mb-3 overflow-hidden text-center sm:mt-5 flex justify-between leading-5 text-lg text-white">
						<div className="ml-4 mt-1">Choose Wallet</div>
						<button style={{ marginRight: "10px" }} onClick={() => setIsOpen(false)}>X</button>
					</div>

					{connectors.map((connector) => {
						return (
							<div key={connector.id}>
								<button
									onClick={() => {
										return connect({ connector });
									}}
									disabled={!connector.ready}
									className="relative text-base font-semibold disabled:cursor-not-allowed disabled:opacity-40 transition-colors flex items-center p-5 text-base w-full border-white text-white hover:bg-gray-500 hover:text-white hover:border-black-300 focus-within:outline-0"
								>
									{isSuccess && (
										<div className="absolute h-1 w-1 top-[35px] left-[10px] rounded bg-aqua-200" />
									)}
									{getWalletLogo(connector.id)}
									<div className="ml-4 text-sm">{connector.name}</div>
									{isLoading && connector.id === pendingConnector?.id && (
										<div className="w-full text-sm absolute right-6 mr-1 flex justify-end text-gray-400">
											<div>Connecting...</div>
										</div>
									)}
								</button>
							</div>
						);
					})}
				</Dialog.Panel>
			</div>
		</Dialog>
	);
};

export { WalletConnectModal };

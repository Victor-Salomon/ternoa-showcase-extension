import { SetStateAction } from "react";

export type ContextProviderProps = {
  children: React.ReactNode;
};

export type UserWalletType = {
  address: string;
  walletName: string;
  isConnected: boolean;
};

export type WalletContextType = {
  userWallet: UserWalletType;
  setUserWallet: React.Dispatch<SetStateAction<UserWalletType>>;
};

export type NetworkType = "Alphanet" | "Mainnet";

export type NetworkContextType = {
  network: NetworkType;
  setNetwork: React.Dispatch<SetStateAction<NetworkType>>;
};

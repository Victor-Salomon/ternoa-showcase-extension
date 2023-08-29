import { SetStateAction } from "react";

export type WalletContextProviderProps = {
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

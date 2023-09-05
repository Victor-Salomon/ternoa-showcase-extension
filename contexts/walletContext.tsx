"use client";
import { createContext, useContext, useState } from "react";
import {
  ContextProviderProps,
  WalletContextType,
  UserWalletType,
} from "./types";

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletContextProvider({
  children,
}: ContextProviderProps) {
  const [userWallet, setUserWallet] = useState<UserWalletType>({
    address: "",
    walletName: "",
    isConnected: false,
    collections:[]
  });

  return (
    <WalletContext.Provider
      value={{
        userWallet,
        setUserWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("USE_WALLET_CONTEXT_MUST_BE_USED_IN_PROVIDER");
  }
  return ctx;
}

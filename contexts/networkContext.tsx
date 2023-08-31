"use client";
import { createContext, useContext, useState } from "react";
import { ContextProviderProps, NetworkContextType, NetworkType } from "./types";

const NetworkContext = createContext<NetworkContextType | null>(null);

export function NetworkContextProvider({ children }: ContextProviderProps) {
  const [network, setNetwork] = useState<NetworkType>("Alphanet");

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkContext() {
  const ctx = useContext(NetworkContext);
  if (!ctx) {
    throw new Error("USE_NETWORK_CONTEXT_MUST_BE_USED_IN_PROVIDER");
  }
  return ctx;
}

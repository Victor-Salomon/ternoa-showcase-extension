"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ContextProviderProps, NetworkContextType, NetworkType } from "./types";
import { getApiEndpoint, initializeApi } from "ternoa-js";
import { initNetwork } from "@/lib/ternoa";

const NetworkContext = createContext<NetworkContextType | null>(null);

export function NetworkContextProvider({ children }: ContextProviderProps) {
  const [network, setNetwork] = useState<NetworkType>("Alphanet");
  const [wssEndpoint, setWssEndpoint] = useState<string>(getApiEndpoint());

  useEffect(() => {
    initNetwork(network);
    setWssEndpoint(getApiEndpoint());
  }, [network]);

  return (
    <NetworkContext.Provider
      value={{
        network,
        wss: wssEndpoint,
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

"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NetworkContextProvider } from "./networkContext";
import { WalletContextProvider } from "./walletContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 4 * 1000,
            refetchInterval: 6 * 1000,
          },
        },
      })
  );
  return (
    <NetworkContextProvider>
      <WalletContextProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WalletContextProvider>
    </NetworkContextProvider>
  );
}

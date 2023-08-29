import Header from "@/components/base/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WalletContextProvider } from "@/contexts/wallet-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ternoa Showcase",
  description: "Create an NFT with Polkadot Extension",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
          <Header />
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}

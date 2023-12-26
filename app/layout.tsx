import Header from "@/components/base/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WalletContextProvider } from "@/contexts/walletContext";
import { Separator } from "@/components/ui/separator";
import SidebarNav from "@/components/base/SidebarNav";
import Network from "@/components/base/Network";
import { NetworkContextProvider } from "@/contexts/networkContext";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/base/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ternoa Showcase",
  description: "Create an NFT with Polkadot Extension",
};

const sidebarNavItems = [
  {
    title: "Basic NFT",
    href: "/",
  },
  {
    title: "Secret NFT",
    href: "/secret",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NetworkContextProvider>
          <WalletContextProvider>
            <Header />
            <main className="container mx-auto mt-24">
              <div className="border my-10 rounded-md space-y-6 p-4 md:p-10 md:pb-16">
                <div className="space-y-0.5">
                  <h2 className="text-2xl font-bold mb-4">
                    Ternoa Builder Journey
                  </h2>
                  <p className="text-muted-foreground">
                    The adventure starts here.
                  </p>
                  <p className="text-muted-foreground">
                    Connect your Ternoa account to create Basic & Secret NFTs at
                    a glance.
                  </p>
                </div>
                <Network />
                <Separator className="my-6" />
                <div className="text-center bg-muted px-4 py-10 rounded-md md:hidden">
                  <h3 className="text-2xl font-bold mb-4 ">
                    Desktop Application Only{" "}
                  </h3>
                  <p className="text-muted-foreground">
                    Because of the Polakdot extensions is not availble on
                    mobile, this application is meant to be used on desktop
                    only. Please open it on your desktop to enjoy the full
                    experience.
                  </p>
                </div>
                <div className="hidden md:block md:flex-col space-y-8 lg:flex lg:flex-row lg:space-x-12 lg:space-y-0">
                  <aside className="lg:mx-4 lg:w-1/6">
                    <SidebarNav items={sidebarNavItems} />
                  </aside>
                  <div className="flex-1">{children}</div>
                </div>
              </div>
            </main>
            <Footer />
            <Toaster />
          </WalletContextProvider>
        </NetworkContextProvider>
      </body>
    </html>
  );
}

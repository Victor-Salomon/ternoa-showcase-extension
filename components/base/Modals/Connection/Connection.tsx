"use client";
import dynamic from "next/dynamic";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import Polkadot from "@/assets/providers/Polkadot";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getAccounts } from "@/lib/polkadot";
import { middleEllipsis } from "@/lib/utils";
import { useWalletContext } from "@/contexts/walletContext";
import { Skeleton } from "@/components/ui/skeleton";
import { getCollections } from "@/lib/indexer";

const Identicon = dynamic(() => import("@polkadot/react-identicon"), {
  ssr: false,
});

const Connection = () => {
  const { userWallet, setUserWallet } = useWalletContext();
  const [isLoadingAccounts, setIsLoadingAccounts] = useState<boolean>(true);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleAccountLogin = async (account: InjectedAccountWithMeta) => {
    const collectionIds = await getCollections(account.address);
    let formattedCollections: string[] = [];
    collectionIds.map((c) => {
      formattedCollections.push(c.collectionId);
    });
    setUserWallet({
      address: account.address,
      walletName: account.meta.name ?? "POLKADOT_ACCOUNT",
      isConnected: true,
      collections: formattedCollections,
    });
  };

  const handleAccountLogout = () => {
    setUserWallet({
      address: "",
      walletName: "",
      isConnected: false,
      collections: [],
    });
  };

  useEffect(() => {
    let shouldUpdate = true;
    const loadAccounts = async () => {
      setIsLoadingAccounts(true);
      try {
        const accounts = await getAccounts();
        if (shouldUpdate) setAccounts(accounts);
        setIsLoadingAccounts(false);
      } catch (error) {
        console.error(error);
        setIsLoadingAccounts(false);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(error as string);
        }
      }
    };

    loadAccounts();

    return () => {
      shouldUpdate = false;
      setIsLoadingAccounts(false);
    };
  }, []);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {!userWallet.isConnected ? (
            <Button variant={"outline"}>
              <Polkadot className="pe-1" />
              Connect
            </Button>
          ) : (
            <Button variant={"outline"}>
              <Identicon
                value={userWallet.address}
                size={24}
                theme="polkadot"
                className="pe-1"
              />
              <span className="from-purple-500 via-pink-500 to-blue-500 bg-gradient-to-r bg-clip-text text-transparent font-light">
                {middleEllipsis(userWallet.address, 15)}
              </span>
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] px-2 sm:px-6">
          <DialogHeader>
            {error ? (
              <>
                <DialogTitle>Connection error</DialogTitle>
                <DialogDescription>
                  Something went wrong while getting the account list.
                </DialogDescription>
              </>
            ) : userWallet.isConnected ? (
              <>
                <DialogTitle>Change account</DialogTitle>{" "}
                <DialogDescription>
                  Select another account from the following list to update your
                  login.
                </DialogDescription>
              </>
            ) : (
              <>
                <DialogTitle>Select a login account</DialogTitle>
                <DialogDescription>
                  Select one of the following account to login to the
                  application.
                </DialogDescription>
              </>
            )}
          </DialogHeader>
          {userWallet.isConnected && (
            <DialogDescription>
              Connected account:{" "}
              <span className="from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent">
                {middleEllipsis(userWallet.address, 20)}
              </span>
            </DialogDescription>
          )}
          {error ? (
            <div className="flex flex-col justify-center items-center mt-4 rounded-md bg-gradient-to-r from-pink-900 via-fuchsia-900 to-red-900 py-4">
              <div className="m-4 bg-gradient-to-r from-red-300 to-pink-600 bg-clip-text text-transparent text-base">
                {error}
              </div>
            </div>
          ) : (
            <ScrollArea className="mx-auto h-[420px] w-[350px] rounded-md border p-2 md:p-4">
              {isLoadingAccounts
                ? Array.from({ length: 6 }, (_, i) => i + 1).map((id) => (
                    <div
                      key={id}
                      className="border w-full my-1 space-x-4 rounded-md transition-all hover:bg-accent"
                    >
                      <div className="flex items-center text-left px-2 py-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex flex-col ps-2">
                          <Skeleton className="h-4 w-[220px] my-1" />
                          <Skeleton className="h-4 w-[150px] my-1" />
                        </div>
                      </div>
                    </div>
                  ))
                : accounts.map(({ address, meta }, idx) => (
                    <button
                      className="border w-full my-1 space-x-4 rounded-md transition-all hover:bg-accent"
                      key={address}
                      onClick={() => handleAccountLogin(accounts[idx])}
                    >
                      <div className="flex items-center text-left px-2 py-4">
                        <Identicon value={address} size={40} theme="polkadot" />
                        <div className="flex flex-col ps-2">
                          {meta.name && (
                            <span className="text-sm font-medium leading-none">
                              {meta.name}
                            </span>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {middleEllipsis(address, 15)}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
            </ScrollArea>
          )}
          {userWallet.isConnected && (
            <DialogFooter>
              <Button
                className="mx-2"
                variant={"outline"}
                onClick={() => handleAccountLogout()}
              >
                Logout
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Connection;

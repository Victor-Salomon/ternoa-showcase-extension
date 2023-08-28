"use client";
import dynamic from "next/dynamic";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import Polkadot from "@/assets/providers/Polkadot";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getAccounts } from "@/lib/polkadot";
import { middleEllipsis } from "@/lib/utils";

const Identicon = dynamic(() => import("@polkadot/react-identicon"), {
  ssr: false,
});

const Connection = () => {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let shouldUpdate = true;
    const loadAccounts = async () => {
      try {
        const accounts = await getAccounts();
        if (shouldUpdate) setAccounts(accounts);
      } catch (error) {
        console.error(error);
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
    };
  }, []);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"}>
            <Polkadot className="px-1" />
            Connect
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] px-2 sm:px-6">
          <DialogHeader>
            <DialogTitle>Select an account</DialogTitle>
            <DialogDescription>
              Select one of the following account to login to the application.
            </DialogDescription>
          </DialogHeader>
          {error ? (
            <div className="flex flex-col justify-center items-center mt-10 rounded-md bg-gradient-to-r from-pink-900 via-fuchsia-900 to-red-900 py-4">
              <div className="m-4 bg-clip-text bg-gradient-to-r from-red-300 to-pink-600 bg-clip-text text-transparent text-base">
                {error}
              </div>
            </div>
          ) : (
            <ScrollArea className="mx-auto h-[420px] w-[350px] rounded-md border p-4">
              {accounts.map(({ address, meta }, idx) => (
                <button
                  className="border w-full my-1 space-x-4 rounded-md transition-all hover:bg-accent"
                  key={address}
                  onClick={() => console.log(accounts[idx])}
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Connection;

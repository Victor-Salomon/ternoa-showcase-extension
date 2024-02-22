"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNetworkContext } from "@/contexts/networkContext";
import { NetworkType } from "@/contexts/types";

const Network = () => {
  const { network, setNetwork, wss } = useNetworkContext();
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between rounded-md border p-4 lg:w-4/6">
      <div className="space-y-0.5">
        <h3 className="font-bold">Select a network</h3>
        <p className="text-muted-foreground font-light text-sm">
          Current network:{" "}
          <span
            className={
              network === "Mainnet"
                ? "from-purple-500 via-pink-500 to-blue-500 bg-gradient-to-r bg-clip-text text-transparent"
                : ""
            }
          >
            {network}
          </span>
        </p>
        <p className="text-muted-foreground font-light text-sm">
          WSS: <span>{wss}</span>
        </p>
      </div>
      <div className="flex items-center space-x-2 my-4">
        <Select onValueChange={(e: NetworkType) => setNetwork(e)}>
          <SelectTrigger className="max-w-[280px]">
            <SelectValue placeholder="Update chain network" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Mainnet">Mainnet</SelectItem>
              <SelectItem value="Betanet">Betanet</SelectItem>
              <SelectItem value="Alphanet">Alphanet</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Network;

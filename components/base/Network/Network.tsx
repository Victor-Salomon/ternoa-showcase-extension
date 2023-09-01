"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNetworkContext } from "@/contexts/networkContext";

const Network = () => {
  const { network, setNetwork } = useNetworkContext();
  const switchNetwork = network === "Alphanet" ? "Mainnet" : "Alphanet";
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between rounded-md border p-4 lg:w-4/6">
      <div className="space-y-0.5">
        <h3 className="font-bold">Select a network</h3>
        <p className="text-muted-foreground">
          Current network: <span>{network}</span>
        </p>
        <p className="text-muted-foreground">
          Switch the toggle button to use the dApp on {switchNetwork}.
        </p>
      </div>
      <div className="flex items-center space-x-2 my-4">
        <Switch
          id="chain-network"
          onCheckedChange={() => setNetwork(switchNetwork)}
        />
        <Label htmlFor="chain-network">Mainnet</Label>
      </div>
    </div>
  );
};

export default Network;

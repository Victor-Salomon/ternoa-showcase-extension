"use client";
import Polkadot from "@/assets/Polkadot";
import TernoaIcon from "@/assets/Ternoa";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <nav className="container mx-auto">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center text-xl font-bold">
          <TernoaIcon />
          <div className="px-2">Ternoa</div>
        </div>
        <Button variant={"outline"} size={"sm"}>
          <Polkadot className="px-1" />
          Connect
        </Button>
      </div>
    </nav>
  );
};

export default Header;

"use client";
import TernoaIcon from "@/assets/ternoaLogo";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <nav className="container mx-auto">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center text-xl font-bold">
          <TernoaIcon />
          <div className="px-2">Ternoa</div>
        </div>
        <Button variant={"outline"} size={"sm"}>Connect</Button>
      </div>
    </nav>
  );
};

export default Header;

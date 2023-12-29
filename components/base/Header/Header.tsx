import TernoaIcon from "@/assets/providers/Ternoa";
import Connection from "../Modals/Connection";
import Link from "next/link";

const Header = () => {
  return (
    <nav className="container fixed top-0 left-0 right-0 backdrop-blur-md z-50">
      <div className="flex justify-between items-center py-4">
        <Link href={"/"} className="flex items-center text-xl font-bold">
          <TernoaIcon />
          <div className="px-2">Ternoa</div>
        </Link>

        <Connection />
      </div>
    </nav>
  );
};

export default Header;

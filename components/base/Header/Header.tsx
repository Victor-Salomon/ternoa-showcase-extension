import TernoaIcon from "@/assets/providers/Ternoa";
import Connection from "../Modals/Connection";

const Header = () => {
  return (
      <nav className="container mx-auto">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center text-xl font-bold">
            <TernoaIcon />
            <div className="px-2">Ternoa</div>
          </div>
          <Connection />
        </div>
      </nav>
  );
};

export default Header;

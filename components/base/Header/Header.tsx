import TernoaIcon from "@/assets/providers/Ternoa";
import Connection from "../Modals/Connection";

const Header = () => {
  return (
      <nav className="container fixed top-0 left-0 right-0 backdrop-blur-md">
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

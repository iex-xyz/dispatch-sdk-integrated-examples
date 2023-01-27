import { Link, useLocation } from "react-router-dom";
import { WalletConnectButton } from "./WalletConnectButton";

function Navbar() {
  const { pathname: currentPage } = useLocation();
  const activeRouteClasses = " text-blue-600 border-b-2 border-blue-600";
  const baseRouteClasses = "inline-block mr-4 hover:text-blue-600"

  return (
    <>
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Dispatch React Example</span>
          <div className="w-full md:block md:w-auto" id="navbar-default">
            <ul
              className="flex flex-row items-center p-4 mt-0 space-x-2 text-sm font-medium border-0 b">
              <li>
                <Link to="/info-card" className={currentPage === '/info-card' ? baseRouteClasses + activeRouteClasses : baseRouteClasses}>Info Card</Link>
              </li>
              <li>
                <Link to="/poll-card" className={currentPage === '/poll-card' ? baseRouteClasses + activeRouteClasses : baseRouteClasses}>Poll Card</Link>
              </li>
              <li>
                <Link to="/action-card" className={currentPage === '/action-card' ? baseRouteClasses + activeRouteClasses : baseRouteClasses}>Action Card</Link>
              </li>
              <li>
                <WalletConnectButton />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

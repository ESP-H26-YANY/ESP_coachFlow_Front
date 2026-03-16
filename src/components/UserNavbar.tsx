import { 
  Navbar, 
  NavbarBrand, 
  NavbarCollapse, 
  NavbarLink, 
  NavbarToggle, 
  Button 
} from "flowbite-react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Brand = NavbarBrand as any;
const NavLink = NavbarLink as any;

export default function UserNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar fluid rounded>
      <Brand as={Link} to="/user/dashboard">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          CoachFlow
        </span>
      </Brand>

      <div className="flex md:order-2 gap-2">
        <span className="hidden md:block self-center mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {user?.name}
        </span>
        <Button color="failure" onClick={handleLogout} size="xs">
          Déconnexion
        </Button>
        <NavbarToggle />
      </div>

      <NavbarCollapse>
        <NavLink 
          as={Link} 
          to="/user/dashboard" 
          active={location.pathname === "/user/dashboard"}
        >
          Dashboard
        </NavLink>
        <NavLink 
          as={Link} 
          to="/user/Explorer" 
          active={location.pathname === "/user/Explorer"}
        >
          Explorer
        </NavLink>
        <NavLink 
          as={Link} 
          to="/user/profil" 
          active={location.pathname === "/user/profil"}
        >
          Mon Profil
        </NavLink>
      </NavbarCollapse>
    </Navbar>
  );
}
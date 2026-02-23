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

// Contournement strict avec 'any' pour éviter l'erreur TypeScript sur les props 'to' et 'as'
const Brand = NavbarBrand as any;
const NavLink = NavbarLink as any;

export default function CoachNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar fluid rounded>
      <Brand as={Link} to="/coach/dashboard">
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
          to="/coach/dashboard" 
          active={location.pathname === "/coach/dashboard"}
        >
          Dashboard
        </NavLink>
        {/* Remplacer le "#" par la vraie route du profil coach quand elle existera */}
        <NavLink 
          as={Link} 
          to="/coach/profil" 
          active={location.pathname === "/coach/profil"}
        >
          Mon Profil
        </NavLink>
      </NavbarCollapse>
    </Navbar>
  );
}
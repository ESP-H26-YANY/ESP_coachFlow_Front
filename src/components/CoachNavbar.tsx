import { Navbar, Button } from "flowbite-react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function MyNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // IA afin de contourner le bug de typage de Flowbite-React avec TypeScript
  const Nav = Navbar as any;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Nav fluid rounded>
      <Nav.Brand as={Link} to="/dashboard">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          CoachFlow
        </span>
      </Nav.Brand>
      
      <div className="flex md:order-2">
        <Button color="failure" onClick={handleLogout} size="xs">
          Déconnexion
        </Button>
        <Nav.Toggle />
      </div>
      
      <Nav.Collapse>
        <Nav.Link as={Link} to="/dashboard" active>
          Dashboard
        </Nav.Link>
        <Nav.Link as={Link} to="#">
          Profil de {user?.name}
        </Nav.Link>
      </Nav.Collapse>
    </Nav>
  );
}
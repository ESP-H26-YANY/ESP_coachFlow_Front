import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CoachLayout from "./components/CoachLayout";
import UserLayout from "./components/UserLayout";
import RoleRoute from "./components/RoleRoute";

// Pages
import DashboardCoach from "./pages/coach/DashboardCoach";
import DashboardUser from "./pages/user/DashboardUser";
import UserProfile from "./pages/user/UserProfile";
import CoachProfile from "./pages/coach/CoachProfil";
import CoachGuide from "./pages/coach/GuideCoach";
import CoachPlanning from "./pages/coach/planingCoach";

// Logique par IA car je voulais éviter de faire du code redondant pour les routes publiques (login/register) 
// et les redirections basées sur le rôle. 
// Le composant RoleRoute gère l'accès aux routes protégées en fonction du rôle de l'utilisateur, 
// tandis que PublicRoute redirige les utilisateurs déjà connectés vers leur dashboard respectif.
export const getDefaultRoute = (role?: "coach" | "user" | string) => 
  role === "coach" ? "/coach/dashboard" : "/user/dashboard";
const PublicRoute = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (isAuthenticated && user) {
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* === ROUTES PUBLIQUES === */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* === ZONE COACH === */}
          <Route element={<RoleRoute allowedRoles={['coach']} />}>
            <Route element={<CoachLayout />}>
              <Route path="/coach/dashboard" element={<DashboardCoach />} />
              <Route path="/coach/profil" element={<CoachProfile />} />
              <Route path="/coach/guide" element={<CoachGuide />} />
              <Route path="/coach/planning" element={<CoachPlanning />} />
              
            </Route>
          </Route>

          {/* === ZONE USER === */}
          <Route element={<RoleRoute allowedRoles={['user']} />}>
            <Route element={<UserLayout />}>
              <Route path="/user/dashboard" element={<DashboardUser />} />
              <Route path="/user/profil" element={<UserProfile />} />
            </Route>
          </Route>

          <Route path="*" element={<div>Page introuvable</div>} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
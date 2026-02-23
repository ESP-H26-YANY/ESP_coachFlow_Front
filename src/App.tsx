import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CoachLayout from "./components/CoachLayout";
import UserLayout from "./components/UserLayout";


// Guard
import RoleRoute from "./components/RoleRoute";

// Pages (C'est des exemples, tu mettras tes vraies pages)
import DashboardCoach from "./pages/coach/DashboardCoach";
import DashboardUser from "./pages/user/DashboardUser";
import UserProfile from "./pages/user/UserProfile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* === ZONE COACH === */}
          {/* Protection : Seulement pour le rôle 'Coach' */}
          <Route element={<RoleRoute allowedRoles={['coach']} />}>
            {/* Si c'est un coach, on applique le CoachLayout */}
            <Route element={<CoachLayout />}>
              <Route path="/coach/dashboard" element={<DashboardCoach />} />
            </Route>
          </Route>

          {/* === ZONE USER === */}
          {/* Protection : Seulement pour le rôle 'User' */}
          <Route element={<RoleRoute allowedRoles={['user']} />}>
            {/* Si c'est un user, on applique le UserLayout */}
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
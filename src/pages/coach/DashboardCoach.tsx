import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      <p>Bienvenue, {user?.name || "Utilisateur"} !</p>
    </div>
  );
}
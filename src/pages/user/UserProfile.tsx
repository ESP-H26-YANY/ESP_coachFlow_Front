import { useAuth } from "../../context/AuthContext";

export default function UserProfile() {
const { user } = useAuth();
  return (
    <div className="">
      <h1 className="text-3xl font-bold">Mon Profile</h1>
      <p className="mt-4">Nom d'utilisateur : {user?.name}</p>
      <p className="mt-2">Email : {user?.email}</p>
      <p className="mt-2">Rôle : {user?.role}</p>
    </div>
  );
}
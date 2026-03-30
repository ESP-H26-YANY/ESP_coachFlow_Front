import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/api";
import { Button, Spinner, Alert } from "flowbite-react";

export default function UserProfile() {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleTopup = async () => {
    setIsLoading(true);
    setMessage("");
    setError("");
    try {
      await userService.topup(50);
      await refreshUser(); 
      setMessage("Fonds ajoutés avec succès ! (+50$)");
    } catch (err: any) {
      setError(err.message || "Erreur lors du rechargement.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mon Profil</h1>
      
      {error && (
        <Alert color="failure" onDismiss={() => setError("")}>
          <span className="font-medium">Erreur :</span> {error}
        </Alert>
      )}

      {message && (
        <Alert color="success" onDismiss={() => setMessage("")}>
          <span className="font-medium">Succès :</span> {message}
        </Alert>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <p className="text-lg"><strong>Nom d'utilisateur :</strong> {user?.name}</p>
        <p className="text-lg"><strong>Email :</strong> {user?.email}</p>
        <p className="text-lg"><strong>Rôle :</strong> {user?.role === "user" ? "Élève" : user?.role}</p>
        
        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Mon Portefeuille</h3>
          <p className="text-lg mb-4">
            <strong>Solde actuel : </strong> 
            <span className="text-purple-600 font-bold text-xl">{user?.wallet !== undefined ? `${user.wallet} $` : "0 $"}</span>
          </p>
          
          <Button color="purple" onClick={handleTopup} disabled={isLoading}>
            {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
            Recharger 50 $
          </Button>
        </div>
      </div>
    </div>
  );
}
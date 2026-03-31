import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/api";
import { Button, Spinner, Alert, Card, Avatar, Badge, ToggleSwitch } from "flowbite-react";

export default function UserProfile() {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

 // pour le style
  const [emailNotif, setEmailNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(false);

  const handleClaimReward = async () => {
    setIsLoading(true);
    setMessage("");
    setError("");
    try {
      await userService.claimReward();
      await refreshUser(); 
      setMessage("Récompense réclamée avec succès !");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la réclamation.");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name?: string) => name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mon Espace Personnel</h1>
      
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLONNE GAUCHE : IDENTITÉ */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <div className="flex flex-col items-center pb-4 pt-4">
              <Avatar 
                rounded 
                size="xl" 
                placeholderInitials={getInitials(user?.name)} 
                className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
              />
              <h5 className="mb-1 mt-4 text-xl font-medium text-gray-900 dark:text-white">
                {user?.name}
              </h5>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email}
              </span>
              <div className="mt-4 flex space-x-3">
                <Badge color="purple" size="sm">Élève (Utilisateur)</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* COLONNE DROITE : ACTIONS & PARAMÈTRES */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Section Portefeuille */}
          <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-4 dark:border-gray-700">
              Mon Portefeuille
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Solde actuel disponible</p>
                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {user?.wallet !== undefined ? `${user.wallet} $` : "0 $"}
                </span>
              </div>
              <Button color="purple" onClick={handleClaimReward} disabled={isLoading}>
                {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
                Réclamer ma récompense
              </Button>
            </div>
          </Card>

          {/* Section Paramètres (Visuel uniquement) */}
          <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-4 dark:border-gray-700">
              Préférences du compte (Rien ne marche, mais c'est pour le style)
            </h3>
            <div className="flex flex-col gap-4 mt-2">
              <ToggleSwitch
                checked={emailNotif}
                label="Recevoir des notifications par email"
                onChange={setEmailNotif}
                color="purple"
              />
              <ToggleSwitch
                checked={promoNotif}
                label="Recevoir les offres promotionnelles des coachs"
                onChange={setPromoNotif}
                color="purple"
              />
              <p className="text-xs text-gray-500 italic mt-2">
                Ces paramètres sont stockés localement sur votre navigateur.
              </p>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
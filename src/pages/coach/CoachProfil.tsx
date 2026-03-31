import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, Avatar, Badge, ToggleSwitch } from "flowbite-react";

export default function CoachProfile() {
  const { user } = useAuth();

  // États locaux pour simuler des préférences pour le STYLEEE
  const [emailNotif, setEmailNotif] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);

  const getInitials = (name?: string) => name ? name.charAt(0).toUpperCase() : "C";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mon Espace Coach</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLONNE GAUCHE : IDENTITÉ */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <div className="flex flex-col items-center pb-4 pt-4">
              <Avatar 
                rounded 
                size="xl" 
                placeholderInitials={getInitials(user?.name)} 
                className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
              />
              <h5 className="mb-1 mt-4 text-xl font-medium text-gray-900 dark:text-white">
                {user?.name}
              </h5>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email}
              </span>
              <div className="mt-4 flex flex-col items-center gap-2">
                <Badge color="info" size="sm">Coach Certifié</Badge>
                <span className="text-xs text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  ID: {user?.id}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* COLONNE DROITE : ACTIONS & PARAMÈTRES */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Section Portefeuille */}
          <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-4 dark:border-gray-700">
              Mon Portefeuille Professionnel
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Revenus disponibles</p>
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {user?.wallet !== undefined ? `${user.wallet} $` : "0 $"}
              </span>
              <p className="text-sm text-gray-500 italic mt-4">
                Les revenus de vos ventes sont automatiquement crédités sur ce solde à chaque achat d'un élève.
              </p>
            </div>
          </Card>

          {/* Section Paramètres (Visuel uniquement) */}
          <Card>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-4 dark:border-gray-700">
              Paramètres du compte
            </h3>
            <div className="flex flex-col gap-4 mt-2">
              <ToggleSwitch
                checked={emailNotif}
                label="M'alerter par email à chaque nouvelle vente"
                onChange={setEmailNotif}
                color="blue"
              />
              <ToggleSwitch
                checked={publicProfile}
                label="Rendre mon profil visible dans l'annuaire des coachs"
                onChange={setPublicProfile}
                color="blue"
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
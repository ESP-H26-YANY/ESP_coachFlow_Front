import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { guideService } from "../../services/api";
import { Guide } from "../../types/guide";
import { Button, Card, Spinner, Badge } from "flowbite-react";

export default function DashboardCoach() {
  const { user } = useAuth();
  
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

  useEffect(() => {
    if (user?.id) {
      fetchGuides();
    }
  }, [user]);

  const fetchGuides = async () => {
    try {
      const data = await guideService.getByUser(user!.id!);
      setGuides(data);
    } catch (err: any) {
      setError("Impossible de charger vos guides.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce guide définitivement ?")) return;

    try {
      await guideService.delete(id);
      setGuides(guides.filter((g) => g.id !== id));
    } catch (err: any) {
      alert("Erreur lors de la suppression.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  // IA a été utilisée pour de la belle CSS 
  return (
    <div className="space-y-8">
      {/* SECTION 1 : LISTE DES GUIDES (Haut du wireframe) */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mes Guides ({guides.length})
          </h2>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {guides.length === 0 && !error ? (
          <div className="text-center p-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">Vous n'avez pas encore de guide actif.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Card key={guide.id} className="max-w-sm relative flex flex-col h-full">
                
                {/* Couverture du guide */}
                {guide.coverUrl ? (
                  <img 
                    src={`${API_BASE_URL}${guide.coverUrl}`} 
                    alt={guide.title} 
                    className="h-48 w-full object-cover rounded-t-lg" 
                  />
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center rounded-t-lg text-gray-500">
                    Pas de couverture
                  </div>
                )}

                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {guide.title}
                    </h5>
                    <span className="text-lg font-bold text-purple-600">
                      {guide.price}$
                    </span>
                  </div>

                  <p className="font-normal text-sm text-gray-700 dark:text-gray-400 line-clamp-2 mb-4">
                    {guide.description}
                  </p>

                  {/* Badges Flowbite */}
                  <div className="flex gap-2 mb-4">
                    <Badge color={guide.isBeginner ? "success" : "warning"}>
                      {guide.isBeginner ? "Débutant" : "Avancé"}
                    </Badge>
                    <Badge color="gray">{guide.category}</Badge>
                  </div>

                  {/* Boutons (poussés vers le bas grâce au flex-grow du parent) */}
                  <div className="flex gap-2 mt-auto">
                    <Button 
                      size="sm" 
                      color="light" 
                      className="w-full"
                      href={`${API_BASE_URL}${guide.linkUrl}`} 
                    >
                      Ouvrir
                    </Button>
                    <Button 
                      size="sm" 
                      color="failure" 
                      className="w-full"
                      onClick={() => handleDelete(guide.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <hr className="border-gray-300 dark:border-gray-700" />

      {/* SECTION 2 : FORMULAIRE (Bas du wireframe - À faire plus tard) */}
      <section className="opacity-40 pointer-events-none">
        <h2 className="text-2xl font-bold mb-4 text-center">Créer un guide (Espace réservé)</h2>
        <div className="h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          Formulaire à venir...
        </div>
      </section>
      
    </div>
  );
}
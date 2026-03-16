import { useState, useEffect } from "react";
import { guideService } from "../../services/api";
import { Guide } from "../../types/guide";
import { Button, Card, Spinner, Badge } from "flowbite-react";

export default function Explore() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Pour reconstruire l'URL de l'image de couverture
  const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const data = await guideService.getAll();
      setGuides(data);
    } catch (err: any) {
      setError("Impossible de charger le catalogue de guides.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Explorer les guides
          </h2>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {guides.length === 0 && !error ? (
          <div className="text-center p-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">Aucun guide disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Card key={guide.id} className="max-w-sm relative flex flex-col h-full">
                
                {/* Couverture */}
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

                  <div className="flex gap-2 mb-4">
                    <Badge color={guide.isBeginner ? "success" : "warning"}>
                      {guide.isBeginner ? "Débutant" : "Avancé"}
                    </Badge>
                    <Badge color="gray">{guide.category}</Badge>
                  </div>

                  {/* Bouton d'action futur (Achat / Bibliothèque) */}
                  <div className="flex mt-auto">
                    <Button 
                      size="sm" 
                      color="purple" 
                      className="w-full"
                      onClick={() => console.log("Options à venir")}
                    >
                      Découvrir
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
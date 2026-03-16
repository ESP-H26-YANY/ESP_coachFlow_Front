import { useState, useEffect } from "react";
import { libraryService } from "../../services/api";
import { Guide } from "../../types/guide";
import { Button, Spinner } from "flowbite-react";
import GuideCard from "../../components/GuideCard";
import GuideModal from "../../components/GuideModal";

export default function DashboardUser() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      const data = await libraryService.getMine();
      // Partie pas triviale : le backend retourne une liste de "SavedGuide" qui contient moins d'infos que "Guide",
      // il faut donc faire une transformation pour que GuideCard puisse afficher les infos correctement.
      // J'ai un peu mal fait le composant GuideCard au départ en ne tenant pas compte de ce cas, du coup je dois faire cette transformation un peu moche ici,
      // On convertit "SavedGuide" en "Guide" pour que GuideCard fonctionne
      const formattedGuides: Guide[] = data.map((item) => ({
        id: item.guideId, 
        coachId: "", // Non fourni par ce endpoint
        title: item.title,
        description: "Aucune description", // Valeur par défaut manquante
        category: item.category,
        isBeginner: true, 
        linkUrl: item.linkUrl,
        coverUrl: item.coverUrl,
        price: item.price
      }));

      setGuides(formattedGuides);
    } catch (err: any) {
      setError("Impossible de charger votre bibliothèque.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromLibrary = async (guideId: any) => {
    if (!window.confirm("Voulez-vous retirer ce guide de votre bibliothèque ?")) return;
    
    try {
      await libraryService.remove(guideId);
      fetchLibrary();
    } catch (err: any) {
      alert(err.message || "Erreur lors du retrait.");
    }
  };

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ma Bibliothèque
          </h2>
        </div>

        {error && <p className="mb-4 text-center text-red-500">{error}</p>}

        {guides.length === 0 && !error ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <p className="text-gray-500">
              Vous n'avez pas encore de guide dans vos favoris.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {guides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                actions={
                  <>
                    <Button
                      size="xs"
                      color="purple"
                      className="w-full"
                    >
                      Acheter
                    </Button>

                    <Button
                      size="xs"
                      color="gray"
                      className="w-full"
                      onClick={() =>
                        setSelectedGuide(guide.id === selectedGuide?.id ? null : guide)
                      }
                    >
                      Détail
                    </Button>

                    <Button
                      size="xs"
                      color="failure"
                      className="w-full"
                      onClick={() => handleRemoveFromLibrary(guide.id)}
                    >
                      Retirer
                    </Button>
                  </>
                }
              />
            ))}
            
            <GuideModal
              show={selectedGuide !== null}
              onClose={() => setSelectedGuide(null)}
              guide={selectedGuide}
            />
          </div>
        )}
      </section>
    </div>
  );
}
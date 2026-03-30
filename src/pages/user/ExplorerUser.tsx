import { useState, useEffect } from "react";
import { guideService, libraryService } from "../../services/api";
import { Guide } from "../../types/guide";
import { Button, Spinner, Alert } from "flowbite-react";
import GuideModal from "../../components/GuideModal";
import GuideList from "../../components/GuideList";

export default function Explore() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const data = await guideService.getAll();
      setGuides(data);
    } catch (err: any) {
      setError(err.message || "Impossible de charger le catalogue de guides.");
    } finally {
      setIsLoading(false);
    }
  };

  const executeAddToLibrary = async (guideId: string) => {
    setConfirmAction(null); 
    try {
      await libraryService.add(guideId);
      setSuccessMessage("Guide ajouté à vos favoris avec succès !");
      setError("");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'ajout aux favoris.");
      setSuccessMessage("");
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
            Explorer les guides
          </h2>
        </div>

        {/* AFFICHAGE DES ERREURS ET SUCCÈS */}
        {error && (
          <Alert color="failure" className="mb-4" onDismiss={() => setError("")}>
            <span className="font-medium">Erreur :</span> {error}
          </Alert>
        )}

        {successMessage && (
          <Alert color="success" className="mb-4" onDismiss={() => setSuccessMessage("")}>
            <span className="font-medium">Succès :</span> {successMessage}
          </Alert>
        )}
        <GuideList
            guides={guides}
            emptyMessage="Aucun guide disponible pour le moment."
            renderActions={(guide) =>
              confirmAction === guide.id ? (
                // --- VUE CONFIRMATION ---
                <div className="flex flex-col gap-2 w-full text-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Ajouter aux favoris ?
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      size="xs" 
                      color="purple" 
                      className="w-full" 
                      onClick={() => executeAddToLibrary(guide.id)}
                    >
                      Oui
                    </Button>
                    <Button size="xs" color="gray" className="w-full" onClick={() => setConfirmAction(null)}>
                      Non
                    </Button>
                  </div>
                </div>
              ) : (
                // --- VUE NORMALE ---
                <div className="flex gap-2 w-full">
                  <Button
                    size="xs"
                    color="purple"
                    className="w-full"
                    onClick={() => setConfirmAction(guide.id)}
                  >
                    Favoris
                  </Button>

                  <Button
                    size="xs"
                    color="gray"
                    className="w-full"
                    onClick={() => setSelectedGuide(guide)}
                  >
                    Détails
                  </Button>
                </div>
              )
            }
          />
        

        {/* MODAL */}
        <GuideModal
          show={selectedGuide !== null}
          onClose={() => setSelectedGuide(null)}
          guide={selectedGuide}
        />
        <GuideModal
          show={selectedGuide !== null}
          onClose={() => setSelectedGuide(null)}
          guide={selectedGuide}
        />
      </section>
    </div>
  );
}
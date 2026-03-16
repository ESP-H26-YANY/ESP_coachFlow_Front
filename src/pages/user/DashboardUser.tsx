import { useState, useEffect } from "react";
import { guideService } from "../../services/api";
import { Guide } from "../../types/guide";
import { Button, Spinner } from "flowbite-react";
import GuideCard from "../../components/GuideCard";
import GuideModal from "../../components/GuideModal";

export default function Explore() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

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

        {error && <p className="mb-4 text-center text-red-500">{error}</p>}

        {guides.length === 0 && !error ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <p className="text-gray-500">
              Aucun guide disponible pour le moment.
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
                    onClick={() => console.log("Achat à venir")}
                  >
                    favoris
                  </Button>

                  <Button
                      size="xs"
                      color="gray"
                      className="w-full"
                      onClick={() =>
                        setSelectedGuide(guide.id === selectedGuide?.id ? null : guide)
                      }
                    >
                      Detail
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

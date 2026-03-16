import { useState, useEffect } from "react";
import { guideService } from "../../services/api";
import { Guide } from "../../types/guide";
import { Button, Spinner } from "flowbite-react";
import GuideCard from "../../components/GuideCard"; 

export default function Explore() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner size="xl" /></div>;

  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Explorer les guides</h2>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {guides.length === 0 && !error ? (
          <div className="text-center p-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">Aucun guide disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <GuideCard 
                key={guide.id} 
                guide={guide} 
                actions={
                  <Button size="sm" color="purple" className="w-full" onClick={() => console.log("Achat à venir")}>
                    Découvrir
                  </Button>
                } 
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
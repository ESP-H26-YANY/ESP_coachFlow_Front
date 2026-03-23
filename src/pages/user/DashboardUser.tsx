import { useState, useEffect } from "react";
import { libraryService, guideService } from "../../services/api";
import { Guide } from "../../types/guide";
import { Button, Spinner } from "flowbite-react";
import GuideCard from "../../components/GuideCard";
import GuideModal from "../../components/GuideModal";

export default function DashboardUser() {
  const [purchasedGuides, setPurchasedGuides] = useState<Guide[]>([]);
  const [savedGuides, setSavedGuides] = useState<Guide[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      
      const [purchasedData, savedData] = await Promise.all([
        libraryService.getPurchased(),
        libraryService.getMine()
      ]);
      
      const formattedPurchased: Guide[] = purchasedData.map((item) => ({
        id: item.guideId, 
        coachId: "", 
        title: item.title,
        description: "Guide acheté", 
        category: item.category,
        isBeginner: true, 
        linkUrl: item.linkUrl,
        coverUrl: item.coverUrl,
        price: item.price
      }));

      const formattedSaved: Guide[] = savedData.map((item) => ({
        id: item.guideId, 
        coachId: "", 
        title: item.title,
        description: "Sauvegardé dans les favoris", 
        category: item.category,
        isBeginner: true, 
        linkUrl: "", 
        coverUrl: item.coverUrl,
        price: item.price
      }));

      setPurchasedGuides(formattedPurchased);
      setSavedGuides(formattedSaved);
    } catch (err: any) {
      setError("Impossible de charger vos données.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (guideId: string, title: string) => {
    setIsDownloading(guideId);
    try {
      await guideService.downloadPdf(guideId, title);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsDownloading(null);
    }
  };

  const handleRemoveFromLibrary = async (guideId: string) => {
    if (!window.confirm("Voulez-vous retirer ce guide de vos favoris ?")) return;
    try {
      await libraryService.remove(guideId);
      setSavedGuides(savedGuides.filter((g) => g.id !== guideId));
    } catch (err: any) {
      alert(err.message || "Erreur lors du retrait.");
    }
  };

  const handlePurchase = async (guideId: string) => {
    if (!window.confirm("Voulez-vous acheter ce guide avec votre portefeuille ?")) return;
    
    setIsPurchasing(guideId);
    try {
      await libraryService.purchase(guideId);
      await fetchDashboardData(); 
      alert("Achat réussi ! Le guide a été ajouté à vos achats.");
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'achat. Avez-vous assez de fonds ?");
    } finally {
      setIsPurchasing(null);
    }
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Spinner size="xl" /></div>;

  return (
    <div className="space-y-12">
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* SECTION 1 : ACHATS */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2">
          Mes Achats ({purchasedGuides.length})
        </h2>
        
        {purchasedGuides.length === 0 ? (
          <p className="text-gray-500 italic">Vous n'avez pas encore acheté de guide.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {purchasedGuides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                actions={
                  <>
                    <Button
                      size="xs"
                      color="purple"
                      className="w-full"
                      disabled={isDownloading === guide.id}
                      onClick={() => handleDownload(guide.id, guide.title)}
                    >
                      {isDownloading === guide.id ? <Spinner size="sm" /> : "Lire le PDF"}
                    </Button>
                    <Button
                      size="xs"
                      color="gray"
                      className="w-full"
                      onClick={() => setSelectedGuide(guide)}
                    >
                      Détails
                    </Button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2 : FAVORIS */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2">
          Mes Favoris ({savedGuides.length})
        </h2>
        
        {savedGuides.length === 0 ? (
          <p className="text-gray-500 italic">Aucun guide dans vos favoris.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {savedGuides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                actions={
                  <>
                  <Button
                      size="xs"
                      color="purple"
                      className="w-full"
                      onClick={() => handlePurchase(guide.id)}
                    >
                      Acheter
                    </Button>

                    <Button
                      size="xs"
                      color="failure"
                      className="w-full"
                      onClick={() => handleRemoveFromLibrary(guide.id)}
                    >
                      Retirer
                    </Button>
                    <Button
                      size="xs"
                      color="gray"
                      className="w-full"
                      onClick={() => setSelectedGuide(guide)}
                    >
                      Détails
                    </Button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* MODAL PARTAGÉE */}
      <GuideModal
        show={selectedGuide !== null}
        onClose={() => setSelectedGuide(null)}
        guide={selectedGuide}
      />
    </div>
  );
}
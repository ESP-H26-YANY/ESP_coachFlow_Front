import { useState, useEffect } from "react";
import { libraryService, guideService } from "../../services/api";
import { Guide } from "../../types/guide";
import { Button, Spinner, Alert } from "flowbite-react";
import { useAuth } from "../../context/AuthContext";
import GuideModal from "../../components/GuideModal";
import GuideList from "../../components/GuideList";

export default function DashboardUser() {

  const { refreshUser } = useAuth();
  const [purchasedGuides, setPurchasedGuides] = useState<Guide[]>([]);
  const [savedGuides, setSavedGuides] = useState<Guide[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "remove" | "purchase";
    guideId: string;
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [purchasedData, savedData] = await Promise.all([
        libraryService.getPurchased(),
        libraryService.getMine(),
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
        price: item.price,
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
        price: item.price,
      }));

      setPurchasedGuides(formattedPurchased);
      setSavedGuides(formattedSaved);
    } catch (err: any) {
      setError(err.message || "Impossible de charger vos données.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (guideId: string, title: string) => {
    setIsDownloading(guideId);
    try {
      await guideService.downloadPdf(guideId, title);
    } catch (err: any) {
      setError(err.message || "Erreur lors du téléchargement.");
    } finally {
      setIsDownloading(null);
    }
  };

  const executeRemove = async (guideId: string) => {
    setConfirmAction(null); // On ferme la confirmation
    try {
      await libraryService.remove(guideId);
      setSavedGuides(savedGuides.filter((g) => g.id !== guideId));
      setSuccessMessage("Guide retiré de vos favoris.");
      setError("");
    } catch (err: any) {
      setError(err.message || "Erreur lors du retrait.");
      setSuccessMessage("");
    }
  };

  const executePurchase = async (guideId: string) => {
    setConfirmAction(null);
    setIsPurchasing(guideId);
    try {
      await libraryService.purchase(guideId);
      await fetchDashboardData();
      await refreshUser();
      setSuccessMessage("Achat réussi ! Le guide a été ajouté à vos achats.");
      setError("");
    } catch (err: any) {
      setError(
        err.message || "Erreur lors de l'achat. Avez-vous assez de fonds ?",
      );
      setSuccessMessage("");
    } finally {
      setIsPurchasing(null);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="space-y-12">
      {error && (
        <Alert color="failure" className="mb-4" onDismiss={() => setError("")}>
          <span className="font-medium">Erreur :</span> {error}
        </Alert>
      )}

      {successMessage && (
        <Alert
          color="success"
          className="mb-4"
          onDismiss={() => setSuccessMessage("")}
        >
          <span className="font-medium">Succès :</span> {successMessage}
        </Alert>
      )}

      {/* SECTION 1 : ACHATS */}
      <section>
        <h2 className="mb-6 border-b pb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Mes Achats ({purchasedGuides.length})
        </h2>

        <GuideList
          guides={purchasedGuides}
          emptyMessage="Vous n'avez pas encore acheté de guide."
          renderActions={(guide) => (
            <div className="flex w-full gap-2">
              <Button
                size="xs"
                color="purple"
                className="w-full"
                disabled={isDownloading === guide.id}
                onClick={() => handleDownload(guide.id, guide.title)}
              >
                {isDownloading === guide.id ? (
                  <Spinner size="sm" />
                ) : (
                  "Lire le PDF"
                )}
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
          )}
        />
      </section>

      {/* SECTION 2 : FAVORIS */}
      <section>
        <h2 className="mb-6 border-b pb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Mes Favoris ({savedGuides.length})
        </h2>

        <GuideList
          guides={savedGuides}
          emptyMessage="Aucun guide dans vos favoris."
          renderActions={(guide) =>
            confirmAction?.guideId === guide.id ? (
              <div className="flex w-full flex-col gap-2 text-center">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {confirmAction.type === "purchase"
                    ? "Confirmer l'achat ?"
                    : "Retirer des favoris ?"}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="xs"
                    color="purple"
                    className="w-full"
                    onClick={() =>
                      confirmAction.type === "purchase"
                        ? executePurchase(guide.id)
                        : executeRemove(guide.id)
                    }
                  >
                    Oui
                  </Button>
                  <Button
                    size="xs"
                    color="gray"
                    className="w-full"
                    onClick={() => setConfirmAction(null)}
                  >
                    Non
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex w-full gap-2">
                <Button
                  size="xs"
                  color="purple"
                  className="w-full"
                  disabled={isPurchasing === guide.id}
                  onClick={() =>
                    setConfirmAction({ type: "purchase", guideId: guide.id })
                  }
                >
                  {isPurchasing === guide.id ? (
                    <Spinner size="sm" />
                  ) : (
                    "Acheter"
                  )}
                </Button>
                <Button
                  size="xs"
                  color="failure"
                  className="w-full"
                  onClick={() =>
                    setConfirmAction({ type: "remove", guideId: guide.id })
                  }
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
              </div>
            )
          }
        />
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

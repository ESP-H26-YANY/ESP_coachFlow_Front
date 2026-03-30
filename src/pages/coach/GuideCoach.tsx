import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { guideService } from "../../services/api";
import { Guide } from "../../types/guide";
import GuideList from "../../components/GuideList";
import GuideModal from "../../components/GuideModal";
import CreateGuideForm from "../../components/CreateGuideForm";
import EditGuideForm from "../../components/EditGuideForm";
import { Button, Spinner, Alert } from "flowbite-react";

export default function GuideCoach() {
  const { user } = useAuth();

  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) fetchGuides();
  }, [user]);

  const fetchGuides = async () => {
    try {
      const data = await guideService.getByUser(user!.id!);
      setGuides(data);
    } catch (err: any) {
      setError(err.message || "Impossible de charger vos guides.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (guideId: string, title: string) => {
    setIsDownloading(guideId);
    setError("");
    try {
      await guideService.downloadPdf(guideId, title);
    } catch (err: any) {
      setError(err.message || "Erreur lors du téléchargement.");
    } finally {
      setIsDownloading(null);
    }
  };

  const executeDelete = async (id: string) => {
    setConfirmAction(null);
    try {
      await guideService.delete(id);
      setGuides(guides.filter((g) => g.id !== id));
      setSuccessMessage("Guide supprimé définitivement.");
      setError("");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression.");
      setSuccessMessage("");
    }
  };

  const handleCreateSuccess = (newGuide: Guide, msg: string) => {
    setGuides([newGuide, ...guides]);
    setSuccessMessage(msg);
    setError("");
  };

  const handleEditSuccess = (updatedGuide: Guide, msg: string) => {
    setGuides(
      guides.map((g) =>
        g.id === updatedGuide.id ? { ...g, ...updatedGuide } : g,
      ),
    );
    setSuccessMessage(msg);
    setError("");
    setEditingGuide(null);
  };

  const handleError = (msg: string) => {
    setError(msg);
    setSuccessMessage("");
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
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

     {/* LISTE DES GUIDES */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Mes Guides
        </h2>

        <GuideList
          guides={guides}
          emptyMessage="Vous n'avez pas encore de guide."
          renderActions={(guide) =>
            confirmAction === guide.id ? (
              <div className="flex w-full flex-col gap-2 text-center">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Supprimer ce guide ?
                </span>
                <div className="flex gap-2">
                  <Button
                    size="xs"
                    color="failure"
                    className="w-full"
                    onClick={() => executeDelete(guide.id)}
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
              <div className="grid w-full grid-cols-2 gap-2">
                <Button
                  size="xs"
                  color="light"
                  className="w-full border border-gray-300"
                  disabled={isDownloading === guide.id}
                  onClick={() => handleDownload(guide.id, guide.title)}
                >
                  {isDownloading === guide.id ? (
                    <Spinner size="sm" />
                  ) : (
                    "Ouvrir"
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
                <Button
                  size="xs"
                  color="info"
                  className="w-full"
                  onClick={() => setEditingGuide(guide)}
                >
                  Modifier
                </Button>
                <Button
                  size="xs"
                  color="failure"
                  className="w-full"
                  onClick={() => setConfirmAction(guide.id)}
                >
                  Supprimer
                </Button>
              </div>
            )
          }
        />
      </section>
      <hr className="border-gray-300 dark:border-gray-700" />

      {/* FORMULAIRES */}
      {editingGuide ? (
        <section className="flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-gray-800">
          <EditGuideForm
            guide={editingGuide}
            onSuccess={handleEditSuccess}
            onError={handleError}
            onCancel={() => setEditingGuide(null)}
          />
        </section>
      ) : (
        <section className="flex items-center justify-center rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
          <CreateGuideForm
            coachId={user!.id!}
            onSuccess={handleCreateSuccess}
            onError={handleError}
          />
        </section>
      )}

      {/* MODAL */}
      <GuideModal
        show={selectedGuide !== null}
        onClose={() => setSelectedGuide(null)}
        guide={selectedGuide}
      />
    </div>
  );
}

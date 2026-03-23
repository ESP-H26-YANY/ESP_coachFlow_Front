import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { guideService } from "../../services/api";
import { Guide } from "../../types/guide";
import GuideCard from "../../components/GuideCard";
import {
  Button,
  Card,
  Spinner,
  Label,
  TextInput,
  Select,
  FileInput,
  Textarea,
} from "flowbite-react";


export default function DashboardCoach() {
  const { user } = useAuth();

  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Fitness");
  const [isBeginner, setIsBeginner] = useState("true");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!file) return alert("Le fichier PDF est requis.");

    setIsSubmitting(true);
    try {
      const newGuide = await guideService.create({
        title,
        description,
        category,
        isBeginner,
        price,
        pdfFile: file,
        coachId: user!.id!,
      });

      setGuides([newGuide, ...guides]);
      setTitle("");
      setDescription("");
      setPrice("");
      setFile(null);

      alert("Guide publié avec succès !");
    } catch (err: any) {
      setError("Erreur lors de la création du guide.");
    } finally {
      setIsSubmitting(false);
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

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce guide définitivement ?"))
      return;

    try {
      await guideService.delete(id);
      setGuides(guides.filter((g) => g.id !== id));
    } catch (err: any) {
      alert("Erreur lors de la suppression.");
    }
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
      {/* LISTE DES GUIDES */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Mes Guides
        </h2>

        {guides.length === 0 ? (
          <p className="text-gray-500">Vous n'avez pas encore de guide.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {guides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                actions={
                  <>
                    <Button
                      size="sm"
                      color="light"
                      className="w-full"
                      disabled={isDownloading === guide.id}
                      onClick={() => handleDownload(guide.id, guide.title)}
                    >
                      "Ouvrir"
                    </Button>
                    <Button
                      size="xs"
                      color="gray"
                      className="w-full"
                      onClick={() =>
                        setSelectedGuide(
                          guide.id === selectedGuide?.id ? null : guide,
                        )
                      }
                    >
                      Détails
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      className="w-full"
                      onClick={() => handleDelete(guide.id)}
                    >
                      Supprimer
                    </Button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </section>

      <hr className="border-gray-300 dark:border-gray-700" />

      {/* SECTION FORMULAIRE (Bas) - Logique visuelle Login/Register */}
      <section className="flex items-center justify-center rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
        <Card className="w-full max-w-2xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            Créer un nouveau guide
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <h3 className="border-b pb-1 text-sm font-semibold text-purple-600 uppercase">
              Informations de base
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="title">Titre du guide</Label>
                </div>
                <TextInput
                  id="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Abdos 30 jours"
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="category">Catégorie</Label>
                </div>
                <TextInput
                  id="category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ex: Fitness"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="description">Description</Label>
              </div>
              <Textarea
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Un guide complet pour perdre du poids"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="level">Niveau</Label>
                </div>
                <Select
                  id="level"
                  required
                  value={isBeginner}
                  onChange={(e) => setIsBeginner(e.target.value)}
                >
                  <option value="true">Débutant</option>
                  <option value="false">Avancé</option>
                </Select>
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="price">Prix ($)</Label>
                </div>
                <TextInput
                  id="price"
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <h3 className="mt-2 border-b pb-1 text-sm font-semibold text-purple-600 uppercase">
              Le guide (PDF)
            </h3>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="file">Fichier PDF (max 10Mo)</Label>
              </div>
              <FileInput
                id="file"
                accept=".pdf"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}

            <Button type="submit" disabled={isSubmitting} color="purple">
              {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
              Publier le guide
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
}

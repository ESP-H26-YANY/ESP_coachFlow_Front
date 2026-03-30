import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { guideService } from "../../services/api";
import { Guide } from "../../types/guide";
import GuideCard from "../../components/GuideCard";
import GuideModal from "../../components/GuideModal";
import {
  Button,
  Card,
  Spinner,
  Label,
  TextInput,
  Select,
  FileInput,
  Textarea,
  Alert,
} from "flowbite-react";

export default function DashboardCoach() {
  const { user } = useAuth();

  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Fitness");
  const [isBeginner, setIsBeginner] = useState("true");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
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
      setError(err.message || "Impossible de charger vos guides.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Le fichier PDF est requis.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");
    
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

      setSuccessMessage("Guide publié avec succès !");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du guide.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (guide: Guide) => {
    setEditingGuide(guide);
    setEditTitle(guide.title);
    setEditDescription(guide.description);
    setEditCategory(guide.category);
    setEditPrice(guide.price.toString());
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuide) return;
    
    setIsUpdating(true);
    setError("");
    setSuccessMessage("");
    
    try {
      const updatedGuide = await guideService.update(editingGuide.id, {
        title: editTitle,
        description: editDescription,
        category: editCategory,
        price: Number(editPrice),
      });

      setGuides(guides.map(g => g.id === editingGuide.id ? { ...g, ...updatedGuide } : g));
      setSuccessMessage("Guide modifié avec succès !");
      setEditingGuide(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la modification du guide.");
    } finally {
      setIsUpdating(false);
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
        <Alert color="success" className="mb-4" onDismiss={() => setSuccessMessage("")}>
          <span className="font-medium">Succès :</span> {successMessage}
        </Alert>
      )}

      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Mes Guides
        </h2>

        {guides.length === 0 ? (
          <p className="text-gray-500">Vous n'avez pas encore de guide.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4.5">
            {guides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                actions={
                  confirmAction === guide.id ? (
                    <div className="flex flex-col gap-2 w-full text-center">
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
                        <Button size="xs" color="gray" className="w-full" onClick={() => setConfirmAction(null)}>
                          Non
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Button
                        size="xs"
                        color="light"
                        className="w-full border border-gray-300"
                        disabled={isDownloading === guide.id}
                        onClick={() => handleDownload(guide.id, guide.title)}
                      >
                        {isDownloading === guide.id ? <Spinner size="sm" /> : "Ouvrir"}
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
                        onClick={() => startEdit(guide)}
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
            ))}
          </div>
        )}
      </section>

      <hr className="border-gray-300 dark:border-gray-700" />

      {/* SECTION FORMULAIRE DE MODIFICATION */}
      {editingGuide && (
        <section className="flex items-center justify-center rounded-lg bg-blue-50 p-6 dark:bg-gray-800 border border-blue-200 dark:border-blue-800 mb-8">
          <Card className="w-full max-w-2xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
              Modifier le guide : {editingGuide.title}
            </h2>

            <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="editTitle">Titre du guide</Label>
                  </div>
                  <TextInput
                    id="editTitle"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>

                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="editCategory">Catégorie</Label>
                  </div>
                  <TextInput
                    id="editCategory"
                    required
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="editDescription">Description</Label>
                </div>
                <Textarea
                  id="editDescription"
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="editPrice">Prix ($)</Label>
                </div>
                <TextInput
                  id="editPrice"
                  type="number"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isUpdating} color="blue" className="w-full">
                  {isUpdating ? <Spinner size="sm" className="mr-2" /> : null}
                  Enregistrer
                </Button>
                <Button color="gray" className="w-full" onClick={() => setEditingGuide(null)}>
                  Annuler
                </Button>
              </div>
            </form>
          </Card>
        </section>
      )}

      {/* SECTION FORMULAIRE DE CRÉATION */}
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

            <Button type="submit" disabled={isSubmitting} color="purple">
              {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
              Publier le guide
            </Button>
          </form>
        </Card>
      </section>

      <GuideModal
        show={selectedGuide !== null}
        onClose={() => setSelectedGuide(null)}
        guide={selectedGuide}
      />
    </div>
  );
}
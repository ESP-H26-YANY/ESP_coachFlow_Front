import { useState } from "react";
import {
  Button,
  Card,
  Label,
  TextInput,
  Select,
  FileInput,
  Textarea,
  Spinner,
} from "flowbite-react";
import { guideService } from "../services/api";
import { CreateGuideFormProps } from "../types/props";

export default function CreateGuideForm({
  coachId,
  onSuccess,
  onError,
}: CreateGuideFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Fitness");
  const [isBeginner, setIsBeginner] = useState("true");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!file) {
      onError("Le fichier PDF est requis.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newGuide = await guideService.create({
        title,
        description,
        category,
        isBeginner,
        price,
        pdfFile: file,
        coachId,
      });

      setTitle("");
      setDescription("");
      setPrice("");
      setFile(null);

      onSuccess(newGuide, "Guide publié avec succès !");
    } catch (err: any) {
      onError(err.message || "Erreur lors de la création du guide.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            <Label htmlFor="file">Fichier PDF </Label>
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
  );
}

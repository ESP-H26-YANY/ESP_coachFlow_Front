import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Label,
  TextInput,
  Textarea,
  Spinner,
} from "flowbite-react";
import { guideService } from "../services/api";
import { EditGuideFormProps } from "../types/props";

export default function EditGuideForm({
  guide,
  onSuccess,
  onCancel,
  onError,
}: EditGuideFormProps) {
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setEditTitle(guide.title);
    setEditDescription(guide.description);
    setEditCategory(guide.category);
    setEditPrice(guide.price.toString());
  }, [guide]);

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const updatedGuide = await guideService.update(guide.id, {
        title: editTitle,
        description: editDescription,
        category: editCategory,
        price: Number(editPrice),
      });

      onSuccess(updatedGuide, "Guide modifié avec succès !");
    } catch (err: any) {
      onError(err.message || "Erreur lors de la modification du guide.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
        Modifier le guide : {guide.title}
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
          <Button
            type="submit"
            disabled={isUpdating}
            color="blue"
            className="w-full"
          >
            {isUpdating ? <Spinner size="sm" className="mr-2" /> : null}
            Enregistrer
          </Button>
          <Button color="gray" className="w-full" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </form>
    </Card>
  );
}

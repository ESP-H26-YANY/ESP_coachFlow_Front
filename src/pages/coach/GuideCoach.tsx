import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { guideService } from "../../services/api";
import { Guide } from "../../types/guide";
import { Button, Card, Spinner, Badge, Label, TextInput,Select, FileInput} from "flowbite-react";

// pour voir les fichiers PDF, j'ai utilisé le lien direct fourni par l'API (stocké dans linkUrl) qui pointe vers le fichier sur le serveur.
const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

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
      coachId: user!.id!
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

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce guide définitivement ?")) return;

    try {
      await guideService.delete(id);
      setGuides(guides.filter((g) => g.id !== id));
    } catch (err: any) {
      alert("Erreur lors de la suppression.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  // IA a été utilisée pour
  return (
    <div className="space-y-8">
      {/* LISTE DES GUIDES */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mes Guides ({guides.length})
          </h2>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {guides.length === 0 && !error ? (
          <div className="text-center p-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">Vous n'avez pas encore de guide actif.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Card key={guide.id} className="max-w-sm relative flex flex-col h-full">
                
                {/* Couverture du guide */}
                {guide.coverUrl ? (
                  <img 
                    src={`${API_BASE_URL}${guide.coverUrl}`} 
                    alt={guide.title} 
                    className="h-48 w-full object-cover rounded-t-lg" 
                  />
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center rounded-t-lg text-gray-500">
                    Pas de couverture
                  </div>
                )}

                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {guide.title}
                    </h5>
                    <span className="text-lg font-bold text-purple-600">
                      {guide.price}$
                    </span>
                  </div>

                  <p className="font-normal text-sm text-gray-700 dark:text-gray-400 line-clamp-2 mb-4">
                    {guide.description}
                  </p>

                  {/* Badges Flowbite TROP BEAU */}
                  <div className="flex gap-2 mb-4">
                    <Badge color={guide.isBeginner ? "success" : "warning"}>
                      {guide.isBeginner ? "Débutant" : "Avancé"}
                    </Badge>
                    <Badge color="gray">{guide.category}</Badge>
                  </div>

                  {/* Boutons */}
                  <div className="flex gap-2 mt-auto">
                    <Button 
                      size="sm" 
                      color="light" 
                      className="w-full"
                      href={`${API_BASE_URL}${guide.linkUrl}`} 
                    >
                      Ouvrir
                    </Button>
                    <Button 
                      size="sm" 
                      color="failure" 
                      className="w-full"
                      onClick={() => handleDelete(guide.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <hr className="border-gray-300 dark:border-gray-700" />

    {/* SECTION FORMULAIRE (Bas) - Logique visuelle Login/Register */}
      <section className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <Card className="max-w-2xl w-full">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Créer un nouveau guide
          </h2>
          
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            <h3 className="font-semibold text-sm text-purple-600 uppercase border-b pb-1">Informations de base</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <TextInput 
                id="description" 
                required 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Ex: Un guide complet pour perdre du poids"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="level">Niveau</Label>
                </div>
                <Select id="level" required value={isBeginner} onChange={(e) => setIsBeginner(e.target.value)}>
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

            <h3 className="font-semibold text-sm text-purple-600 uppercase border-b pb-1 mt-2">Le guide (PDF)</h3>
            
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

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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
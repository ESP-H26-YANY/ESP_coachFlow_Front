import { Modal } from "flowbite-react";
import { Guide } from "../types/guide";

interface GuideModalProps {
  show: boolean;
  onClose: () => void;
  guide: Guide | null;
}

export default function GuideModal({ show, onClose, guide }: GuideModalProps) {
  if (!guide) return null;

  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "";

  // Modal fait par IA car je ne sais pas comment faire un affichage propre, il est non obligatoire pour la validation du projet,
  //  mais je trouve que ça apporte un vrai plus pour l'expérience utilisateur.
  return (
    <Modal show={show} onClose={onClose} size="2xl" dismissible>
      {/* On remplace les composants Flowbite capricieux par une simple div */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
        
        {/* En-tête fait main avec bouton de fermeture */}
        <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Détails du guide
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl font-bold"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Corps du modal */}
        <div className="space-y-5">
          {/* Image complète */}
          {guide.coverUrl ? (
            <img 
              src={`${API_BASE_URL}${guide.coverUrl}`} 
              alt={guide.title} 
              className="w-full h-64 md:h-80 object-cover rounded-lg" 
            />
          ) : (
            <div className="w-full h-64 md:h-80 bg-gray-50 flex items-center justify-center rounded-lg dark:bg-gray-700">
              <span className="text-gray-400">Sans image</span>
            </div>
          )}

          {/* Titre + Prix */}
          <div className="flex justify-between items-start gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {guide.title}
            </h2>
            <span className="text-xl font-semibold text-gray-900 dark:text-white whitespace-nowrap">
              {guide.price} $
            </span>
          </div>

          {/* Badges simples */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {guide.isBeginner ? "Débutant" : "Avancé"}
            </span>
            <span className="rounded bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {guide.category}
            </span>
          </div>

          {/* Description complète */}
          <div className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
            {guide.description}
          </div>
        </div>
      </div>
    </Modal>
  );
}
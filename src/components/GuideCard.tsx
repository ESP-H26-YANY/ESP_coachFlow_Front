import { Card, Badge } from "flowbite-react";
import { Guide } from "../types/guide";
import { ReactNode } from "react";

interface GuideCardProps {
  guide: Guide;
  actions?: ReactNode; 
}
// Aidé par IA pour un bon component de carte de guide.
export default function GuideCard({ guide, actions }: GuideCardProps) {
  const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

  return (
    <Card className="max-w-sm relative flex flex-col h-full">
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

        <div className="flex gap-2 mb-4">
          <Badge color={guide.isBeginner ? "success" : "warning"}>
            {guide.isBeginner ? "Débutant" : "Avancé"}
          </Badge>
          <Badge color="gray">{guide.category}</Badge>
        </div>

        {actions && (
          <div className="flex gap-2 mt-auto">
            {actions}
          </div>
        )}
      </div>
    </Card>
  );
}
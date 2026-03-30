import { GuideListProps } from "../types/props";
import GuideCard from "./GuideCard";


export default function GuideList({
  guides,
  emptyMessage = "Aucun guide disponible.",
  renderActions,
}: GuideListProps) {
  if (guides.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {guides.map((guide) => (
        <GuideCard
          key={guide.id}
          guide={guide}
          actions={renderActions ? renderActions(guide) : undefined}
        />
      ))}
    </div>
  );
}
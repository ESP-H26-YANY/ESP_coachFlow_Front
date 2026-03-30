import { ReactNode } from "react";
import { Guide } from "./guide";

export interface GuideListProps {
  guides: Guide[];
  emptyMessage?: string;
  renderActions?: (guide: Guide) => ReactNode;
}

export interface CreateGuideFormProps {
  coachId: string;
  onSuccess: (newGuide: Guide, message: string) => void;
  onError: (message: string) => void;
}

export interface EditGuideFormProps {
  guide: Guide;
  onSuccess: (updatedGuide: Guide, message: string) => void;
  onCancel: () => void;
  onError: (message: string) => void;
}
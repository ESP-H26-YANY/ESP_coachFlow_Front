export interface Guide {
  id: string;
  coachId: string;
  title: string;
  description: string;
  category: string;
  isBeginner: boolean;
  linkUrl: string;
  coverUrl?: string; 
  price: number;
}

export interface SavedGuide {
  guideId: string;
  title: string;
  category: string;
  price: number;
  coverUrl: string;
  linkUrl: string;
  savedAt: string;
}

export interface CreateGuideDTO {
  title: string;
  description: string;
  category: string;
  isBeginner: string; 
  price: string;
  pdfFile: File;
  coachId: string;
}
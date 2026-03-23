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
  savedAt: string;
}

export interface PurchasedGuide {
  guideId: string;
  title: string;
  category: string;
  price: number;
  coverUrl: string;
  linkUrl: string;
  purchasedAt: string;
}
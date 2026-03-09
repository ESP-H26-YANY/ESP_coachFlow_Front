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
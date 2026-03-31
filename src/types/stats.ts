export interface TopSeller {
  id: string;
  title: string;
  sales: number;
}

export interface CoachStats {
  financials: {
    currentWalletBalance: number;
    totalLifetimeEarnings: number;
    revenueLast30Days: number;
  };
  sales: {
    totalActiveGuides: number;
    totalGuidesSold: number;
    salesLast30Days: number;
    totalUniqueCustomers: number;
  };
  engagement: {
    totalWishlisted: number;
    mostWishlistedGuideId: string;
    mostWishlistedGuide: string;
    conversionRatePercentage: number;
  };
  topBestSellers: TopSeller[];
}
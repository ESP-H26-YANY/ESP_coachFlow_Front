import { useState, useEffect } from "react";
import { userService } from "../../services/api";
import { CoachStats } from "../../types/stats";
import { Card, Spinner, Alert } from "flowbite-react";

export default function DashboardCoach() {
  const [stats, setStats] = useState<CoachStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await userService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Impossible de charger les statistiques.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="failure">
        <span className="font-medium">Erreur :</span> {error}
      </Alert>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Aperçu de l'activité
      </h1>

      {/* SECTION 1 : REVENUS (Mise en avant) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="border-l-4 border-l-purple-500">
          <h5 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
            Revenus (30 derniers jours)
          </h5>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.financials.revenueLast30Days} $
          </span>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <h5 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
            Gains Totaux (Historique)
          </h5>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.financials.totalLifetimeEarnings} $
          </span>
        </Card>
      </div>

      {/* SECTION 2 : KPIS VENTES & ENGAGEMENT */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <h5 className="text-xs font-medium uppercase text-gray-500">Ventes (30j)</h5>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.sales.salesLast30Days}
          </span>
          <span className="text-sm text-gray-500">
            Total : {stats.sales.totalGuidesSold}
          </span>
        </Card>

        <Card>
          <h5 className="text-xs font-medium uppercase text-gray-500">Clients Uniques</h5>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.sales.totalUniqueCustomers}
          </span>
        </Card>

        <Card>
          <h5 className="text-xs font-medium uppercase text-gray-500">Mises en favoris</h5>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.engagement.totalWishlisted}
          </span>
        </Card>

        <Card>
          <h5 className="text-xs font-medium uppercase text-gray-500">Taux de conversion</h5>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.engagement.conversionRatePercentage}%
          </span>
        </Card>
      </div>

      {/* SECTION 3 : TOPS ET CATALOGUE */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Palmarès des ventes */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Top 3 Bestsellers
            </h5>
          </div>
          <div className="flow-root">
            {stats.topBestSellers.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Aucune vente enregistrée.</p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats.topBestSellers.map((guide, index) => (
                  <li key={guide.id} className="py-3 sm:py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 text-lg font-bold text-gray-400">
                        #{index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {guide.title}
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        {guide.sales} ventes
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        {/* Focus Catalogue & Engagement */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-800">
            <h5 className="text-lg font-bold text-gray-900 dark:text-white">
              Le plus désiré (Favoris)
            </h5>
            {stats.engagement.mostWishlistedGuide ? (
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {stats.engagement.mostWishlistedGuide}
              </p>
            ) : (
              <p className="text-sm text-gray-500 italic">Aucun guide en favoris actuellement.</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Ce guide génère le plus d'attente. Idéal pour lancer une promotion !
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium uppercase text-gray-500">Guides en ligne</h5>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.sales.totalActiveGuides}
                </span>
              </div>
            </div>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { 
  getActivePlacesCount, 
  getActivePartnerCount, 
  getPendingTasksCount 
} from "@/services/admin";

// --- SVG Icons for a Professional Look ---
const Icons = {
  MapPin: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  Users: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Storefront: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5-.615a3.001 3.001 0 013.75-.615m12.75 0a3.001 3.001 0 01-3.75-.615" />
    </svg>
  ),
  Tag: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  ),
  Card: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  )
};

// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, icon, loading, highlight = false }: any) => (
  <div className={`relative overflow-hidden bg-white rounded-2xl border ${highlight ? 'border-orange-200 shadow-orange-50' : 'border-gray-200'} p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
          {loading ? (
            <span className="inline-block w-16 h-8 bg-gray-100 rounded animate-pulse" />
          ) : (
            value
          )}
        </h3>
      </div>
      <div className={`p-3 rounded-xl ${highlight ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-600'}`}>
        {icon}
      </div>
    </div>
  </div>
);

export default function DashboardHome() {
  const [stats, setStats] = useState({
    activePlaces: 0,
    activePartners: 0,
    pendingPlaces: 0,
    pendingOffers: 0,
    pendingSubscriptions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        const [placesRes, partnersRes, pendingRes] = await Promise.all([
          getActivePlacesCount(),
          getActivePartnerCount(),
          getPendingTasksCount()
        ]);

        setStats({
          activePlaces: placesRes.activePlacesCount || 0,
          activePartners: partnersRes.activePartnerCount || 0,
          pendingPlaces: pendingRes.pendingPlacesCount || 0,
          pendingOffers: pendingRes.pendingOffersCount || 0,
          pendingSubscriptions: pendingRes.pendingSubscriptionsCount || 0,
        });

      } catch (error) {
        console.error("Failed to load dashboard statistics", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Today's date for a nice dashboard touch
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back, Admin</h1>
          <p className="text-gray-500 mt-1">Here's your system overview for {currentDate}.</p>
        </div>
      </div>

      {/* Overview Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <StatCard 
            title="Total Active Locations" 
            value={stats.activePlaces} 
            icon={Icons.MapPin} 
            loading={isLoading} 
          />
          <StatCard 
            title="Active Partners" 
            value={stats.activePartners} 
            icon={Icons.Users} 
            loading={isLoading} 
          />
        </div>
      </section>

      {/* Action Required Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Action Required</h2>
          <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-0.5 rounded-full border border-red-100">
            Pending Approvals
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard 
            title="Pending Places" 
            value={stats.pendingPlaces} 
            icon={Icons.Storefront} 
            loading={isLoading}
            highlight={stats.pendingPlaces > 0} 
          />
          <StatCard 
            title="Pending Offers" 
            value={stats.pendingOffers} 
            icon={Icons.Tag} 
            loading={isLoading}
            highlight={stats.pendingOffers > 0} 
          />
          <StatCard 
            title="Pending Subscriptions" 
            value={stats.pendingSubscriptions} 
            icon={Icons.Card} 
            loading={isLoading}
            highlight={stats.pendingSubscriptions > 0} 
          />
        </div>
      </section>

    </div>
  );
}
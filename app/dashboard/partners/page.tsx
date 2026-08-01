"use client";

import { useState, useEffect } from "react";
import { getPartners } from "@/services/admin";
import Link from "next/link";

export default function PartnersList() {
  // Search State
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // Data State
  const [partners, setPartners] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const data = await getPartners(activeSearch, page);
        setPartners(data.partners || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch partners", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, [page, activeSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchInput); // Trigger the useEffect
    setPage(0); // Reset to first page on new search
  };

  const handleClear = () => {
    setSearchInput("");
    setActiveSearch(""); // Trigger the useEffect to fetch all
    setPage(0);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-black">Partner Directory</h1>

      {/* Search Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Search Partners
            </label>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by mobile number, name, or email..."
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition font-semibold text-black"
            />
          </div>

          <button 
            type="submit" 
            className="w-full md:w-auto bg-black text-orange-500 px-8 py-3 rounded-lg font-extrabold hover:bg-gray-800 transition"
          >
            Search
          </button>
          
          <button 
            type="button"
            onClick={handleClear}
            className="w-full md:w-auto bg-gray-100 text-gray-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
          >
            Clear
          </button>
        </form>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-500 font-semibold animate-pulse">Loading partners...</div>
        ) : partners.length === 0 ? (
          <div className="py-20 text-center text-gray-500 bg-gray-50">
            <span className="text-4xl block mb-2">🔍</span>
            No partners found matching "{activeSearch}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-black tracking-wider border-b border-gray-200">
                  <th className="p-5">Partner Name</th>
                  <th className="p-5">Mobile Number</th>
                  <th className="p-5">Email</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-5">
                      <p className="font-bold text-black">{partner.firstName} {partner.lastName}</p>
                      <p className="text-xs text-gray-400 font-mono">ID: #{partner.id}</p>
                    </td>
                    <td className="p-5 font-medium">{partner.mobileNumber}</td>
                    <td className="p-5 text-gray-600">{partner.email}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        partner.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {partner.enabled ? "ACTIVE" : "DISABLED"}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <Link 
                        href={`/dashboard/partners/${partner.id}`}
                        className="inline-block bg-black text-orange-500 px-4 py-2 rounded font-bold text-sm hover:bg-gray-800 transition"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-6 py-2 bg-white border border-gray-200 text-black font-semibold rounded-lg disabled:opacity-50 hover:bg-gray-50 transition">Previous</button>
          <span className="text-gray-500 font-bold">Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="px-6 py-2 bg-white border border-gray-200 text-black font-semibold rounded-lg disabled:opacity-50 hover:bg-gray-50 transition">Next</button>
        </div>
      )}
    </div>
  );
}
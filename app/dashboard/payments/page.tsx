"use client";

import { useState, useEffect } from "react";
import { searchPaymentHistory } from "@/services/admin";

export default function PaymentHistory() {
  // Search Inputs
  const [mobileQuery, setMobileQuery] = useState("");
  const [refQuery, setRefQuery] = useState("");
  
  // Data State
  const [groupedPayments, setGroupedPayments] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const fetchPayments = async (currentPage = 0) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await searchPaymentHistory(mobileQuery, refQuery, currentPage);
      const fetchedPayments = data.payments || [];
      
      // Group the flat payments array by User ID
      const grouped = fetchedPayments.reduce((acc: any, currentPayment: any) => {
        const userId = currentPayment.user?.id || "unknown";
        
        if (!acc[userId]) {
          acc[userId] = {
            user: currentPayment.user,
            totalAmount: 0,
            paymentCount: 0,
            records: [] // Store all individual payments here
          };
        }
        
        acc[userId].records.push(currentPayment);
        acc[userId].totalAmount += currentPayment.amount;
        acc[userId].paymentCount += 1;
        
        return acc;
      }, {});

      setGroupedPayments(Object.values(grouped));
      setTotalPages(data.totalPages || 1);
      setPage(currentPage);
    } catch (error) {
      console.error("Failed to fetch payments", error);
      setGroupedPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments(0);
  };

  useEffect(() => {
    fetchPayments(0);
  }, []);

  const handleView = (group: any) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-black">Payment History</h1>

      {/* Search Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Mobile Number
            </label>
            <input
              type="text"
              value={mobileQuery}
              onChange={(e) => setMobileQuery(e.target.value)}
              placeholder="e.g. 0705757003"
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition font-semibold"
            />
          </div>
          
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Reference Number
            </label>
            <input
              type="text"
              value={refQuery}
              onChange={(e) => setRefQuery(e.target.value)}
              placeholder="e.g. LS4800239"
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition font-semibold"
            />
          </div>

          <button type="submit" className="w-full md:w-auto bg-black text-orange-500 px-8 py-3 rounded-lg font-extrabold hover:bg-gray-800 transition">
            Search
          </button>
          
          <button 
            type="button"
            onClick={() => {
              setMobileQuery("");
              setRefQuery("");
              fetchPayments(0); 
            }}
            className="w-full md:w-auto bg-gray-100 text-gray-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
          >
            Clear
          </button>
        </form>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-500 font-semibold animate-pulse">Aggregating records...</div>
        ) : hasSearched && groupedPayments.length === 0 ? (
          <div className="py-20 text-center text-gray-500 bg-gray-50">
            <span className="text-4xl block mb-2">🔍</span>
            No payments found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-black tracking-wider border-b border-gray-200">
                  <th className="p-5">Partner Details</th>
                  <th className="p-5">Total Amount</th>
                  <th className="p-5">Transactions</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {groupedPayments.map((group) => (
                  <tr key={group.user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-5">
                      <p className="font-bold text-black text-lg">{group.user.firstName} {group.user.lastName}</p>
                      <p className="text-sm text-gray-500 font-medium">{group.user.mobileNumber}</p>
                    </td>
                    <td className="p-5">
                      <p className="text-xl font-black text-orange-500">Rs. {group.totalAmount}</p>
                    </td>
                    <td className="p-5">
                      <span className="bg-gray-200 text-gray-800 font-bold px-3 py-1 rounded-full text-xs">
                        {group.paymentCount} {group.paymentCount === 1 ? "Payment" : "Payments"}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => handleView(group)}
                        className="px-4 py-2 bg-black text-orange-500 font-bold text-xs rounded hover:bg-gray-800 transition"
                      >
                        View Details
                      </button>
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
          <button 
            disabled={page === 0} 
            onClick={() => fetchPayments(page - 1)} 
            className="px-6 py-2 bg-white border border-gray-200 text-black font-semibold rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
          >
            Previous
          </button>
          <span className="text-gray-500 font-bold">Page {page + 1} of {totalPages}</span>
          <button 
            disabled={page >= totalPages - 1} 
            onClick={() => fetchPayments(page + 1)} 
            className="px-6 py-2 bg-white border border-gray-200 text-black font-semibold rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* --- DETAILED VIEW MODAL --- */}
      {isModalOpen && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-2xl font-black uppercase tracking-wide">
                Transaction Details
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-black font-bold text-2xl transition">&times;</button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Partner Summary Card */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-orange-50 p-6 rounded-xl border border-orange-100 gap-4">
                <div>
                  <h3 className="text-2xl font-black text-black">{selectedGroup.user.firstName} {selectedGroup.user.lastName}</h3>
                  <p className="text-gray-600 font-semibold">{selectedGroup.user.mobileNumber} | {selectedGroup.user.email}</p>
                  <p className="text-xs text-gray-400 font-mono mt-1">Partner ID: #{selectedGroup.user.id}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">Total Contributions</p>
                  <p className="text-4xl font-black text-orange-500">Rs. {selectedGroup.totalAmount}</p>
                </div>
              </div>

              {/* Transactions Sub-Table */}
              <div>
                <h4 className="font-bold text-lg mb-4 flex items-center justify-between">
                  Payment Records
                  <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full font-bold">
                    {selectedGroup.paymentCount} entries
                  </span>
                </h4>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                      <tr>
                        <th className="p-4">Ref No.</th>
                        <th className="p-4">Plan</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Active Period</th>
                        <th className="p-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedGroup.records.map((record: any) => (
                        <tr key={record.id} className="hover:bg-gray-50 transition">
                          <td className="p-4 font-mono font-bold text-black">{record.referenceNumber}</td>
                          <td className="p-4">{record.plan.replace("_", " ")}</td>
                          <td className="p-4 font-black text-orange-500">Rs. {record.amount}</td>
                          <td className="p-4 text-gray-600 text-xs font-medium">
                            {record.startDate ? new Date(record.startDate).toLocaleDateString() : 'N/A'} <br/> 
                            to {record.endDate ? new Date(record.endDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="p-4 text-right">
                            <span className={`px-2 py-1 rounded text-[10px] uppercase font-black tracking-wider ${
                              record.status === "APPROVED" ? "bg-green-100 text-green-700" : 
                              record.status === "PENDING" ? "bg-orange-100 text-orange-800" : 
                              "bg-red-100 text-red-700"
                            }`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-white flex justify-end">
              <button onClick={closeModal} className="px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition">
                Close View
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { getPartnerDetails, updatePartnerStatus } from "@/services/admin";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PartnerDetails() {
  const params = useParams();
  const partnerId = Number(params.id);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Extracted fetch function to reuse after status update
  const fetchDetails = async () => {
    try {
      const response = await getPartnerDetails(partnerId);
      setData(response);
    } catch (error) {
      console.error("Failed to fetch partner details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (partnerId) fetchDetails();
  }, [partnerId]);

  // Handle the Status Toggle Action
  const handleToggleStatus = async () => {
    const currentStatus = data.partnerInfo.enabled;
    const newStatus = !currentStatus;

    // Safety confirmation dialog
    if (!confirm(`Are you sure you want to ${newStatus ? 'ACTIVATE' : 'DEACTIVATE'} this partner account?`)) {
      return;
    }

    setIsUpdatingStatus(true);
    try {
      await updatePartnerStatus(partnerId, newStatus);
      await fetchDetails(); // Refresh data to show new status immediately
    } catch (error) {
      console.error("Failed to update status", error);
      alert("An error occurred while updating the status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-500 font-semibold animate-pulse">Loading partner profile...</div>;
  }

  if (!data || !data.partnerInfo) {
    return <div className="py-20 text-center text-red-500 font-bold">Partner not found.</div>;
  }

  const { partnerInfo, places, paymentHistory } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Back Button */}
      <div>
        <Link href="/dashboard/partners" className="text-orange-500 font-bold text-sm hover:underline mb-4 inline-block">
          &larr; Back to Directory
        </Link>
        <h1 className="text-3xl font-extrabold text-black">Partner Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden gap-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 opacity-10 rounded-bl-full pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center z-10 w-full md:w-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-3xl font-black text-gray-400 border-4 border-white shadow-md">
            {partnerInfo.firstName[0]}{partnerInfo.lastName?.[0] || ""}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold">{partnerInfo.firstName} {partnerInfo.lastName}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${partnerInfo.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {partnerInfo.enabled ? "ACTIVE" : "DISABLED"}
              </span>
            </div>
            <p className="text-gray-500 font-mono text-sm mb-4">Account ID: #{partnerInfo.id}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mobile</p>
                <p className="font-semibold">{partnerInfo.mobileNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</p>
                <p className="font-semibold">{partnerInfo.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* STATUS ACTION BUTTON */}
        <div className="z-10 w-full md:w-auto mt-4 md:mt-0">
          <button 
            onClick={handleToggleStatus}
            disabled={isUpdatingStatus}
            className={`w-full md:w-auto px-6 py-3 font-bold rounded-lg text-sm transition-colors border shadow-sm disabled:opacity-50 ${
              partnerInfo.enabled 
                ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
                : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            }`}
          >
            {isUpdatingStatus ? "Updating..." : (partnerInfo.enabled ? "Deactivate Account" : "Activate Account")}
          </button>
        </div>
      </div>

      {/* Two Column Layout for Places and Payments */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Registered Places */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
            Registered Places
            <span className="bg-gray-200 text-gray-700 text-sm py-1 px-3 rounded-full">{places?.length || 0}</span>
          </h3>
          <div className="space-y-4">
            {places && places.length > 0 ? places.map((place: any) => (
              <div key={place.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                {place.businessLogo ? (
                  <img src={place.businessLogo} alt={place.name} className="w-16 h-16 rounded-md object-cover border border-gray-200" />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-xl">🏪</div>
                )}
                <div>
                  <h4 className="font-bold text-lg">{place.name}</h4>
                  <p className="text-sm text-gray-500">{place.address}, {place.city?.name}</p>
                  <span className={`inline-block mt-2 text-xs font-bold px-2 py-1 rounded ${place.active ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-800"}`}>
                    {place.active ? "ACTIVE LISTING" : "PENDING APPROVAL"}
                  </span>
                </div>
              </div>
            )) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500 text-sm">No places registered yet.</div>
            )}
          </div>
        </div>

        {/* Payment History */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
            Payment History
            <span className="bg-gray-200 text-gray-700 text-sm py-1 px-3 rounded-full">{paymentHistory?.length || 0}</span>
          </h3>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {paymentHistory && paymentHistory.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                  <tr>
                    <th className="p-4">Plan / Ref</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paymentHistory.map((payment: any) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <p className="font-bold text-black">{payment.plan.replace("_", " ")}</p>
                        <p className="text-xs text-gray-400 font-mono">{payment.referenceNumber}</p>
                      </td>
                      <td className="p-4 font-black">Rs. {payment.amount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          payment.status === "APPROVED" ? "bg-green-100 text-green-700" : 
                          payment.status === "PENDING" ? "bg-orange-100 text-orange-800" : 
                          "bg-red-100 text-red-700"
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-gray-500 text-sm bg-gray-50">No payment history found.</div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
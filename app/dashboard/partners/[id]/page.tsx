"use client";

import { useState, useEffect, useRef } from "react";
import { getPartnerDetails, updatePartnerStatus } from "@/services/admin";
import Link from "next/link";
import { useParams } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Set Mapbox access token from environment variables
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

export default function PartnerDetails() {
  const params = useParams();
  const partnerId = Number(params.id);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  // State to hold place selected for Map Modal
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

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
 // 1. Opens the confirmation modal instead of browser confirm()
  const handleToggleStatusClick = () => {
    // Note: fallback to 'enabled' if 'active' is undefined based on previous context
    const currentStatus = data.partnerInfo.active ?? data.partnerInfo.active; 
    const newStatus = !currentStatus;
    
    setPendingStatus(newStatus);
    setStatusError(null); // Reset errors
    setIsConfirmModalOpen(true);
  };

  // 2. Executes the API call from inside the modal
  const confirmToggleStatus = async () => {
    if (pendingStatus === null) return;
    
    setIsUpdatingStatus(true);
    setStatusError(null);
    
    try {
      await updatePartnerStatus(partnerId, pendingStatus);
      await fetchDetails();
      setIsConfirmModalOpen(false); // Close modal on success
    } catch (error) {
      console.error("Failed to update status", error);
      setStatusError("An error occurred while updating the status. Please try again."); // Show error in modal instead of alert()
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 font-semibold animate-pulse">
        Loading partner profile...
      </div>
    );
  }

  if (!data || !data.partnerInfo) {
    return (
      <div className="py-20 text-center text-red-500 font-bold">
        Partner not found.
      </div>
    );
  }

  const { partnerInfo, places, paymentHistory } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Back Button */}
      <div>
        <Link
          href="/dashboard/partners"
          className="text-orange-500 font-bold text-sm hover:underline mb-4 inline-block"
        >
          &larr; Back to Directory
        </Link>
        <h1 className="text-3xl font-extrabold text-black">Partner Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden gap-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 opacity-10 rounded-bl-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center z-10 w-full md:w-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-3xl font-black text-gray-400 border-4 border-white shadow-md">
            {partnerInfo.firstName[0]}
            {partnerInfo.lastName?.[0] || ""}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold">
                {partnerInfo.firstName} {partnerInfo.lastName}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  partnerInfo.active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {partnerInfo.active ? "ACTIVE" : "DISABLED"}
              </span>
            </div>
            <p className="text-gray-500 font-mono text-sm mb-4">
              Account ID: #{partnerInfo.id}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Mobile
                </p>
                <p className="font-semibold">{partnerInfo.mobileNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Email
                </p>
                <p className="font-semibold">{partnerInfo.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* STATUS ACTION BUTTON */}
        <div className="z-10 w-full md:w-auto mt-4 md:mt-0">
          {/* Change onClick to handleToggleStatusClick */}
<button
  onClick={handleToggleStatusClick}
  disabled={isUpdatingStatus}
  className={`w-full md:w-auto px-6 py-3 font-bold rounded-lg text-sm transition-colors border shadow-sm disabled:opacity-50 ${
    (data.partnerInfo.active ?? data.partnerInfo.active)
      ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
      : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
  }`}
>
  {(data.partnerInfo.active ?? data.partnerInfo.active)
    ? "Deactivate Account"
    : "Activate Account"}
</button>
        </div>
      </div>

      {/* Two Column Layout for Places and Payments */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Registered Places */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
            Registered Places
            <span className="bg-gray-200 text-gray-700 text-sm py-1 px-3 rounded-full">
              {places?.length || 0}
            </span>
          </h3>
          <div className="space-y-4">
            {places && places.length > 0 ? (
              places.map((place: any) => (
                <div
                  key={place.id}
                  className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-start gap-4"
                >
                  {place.businessLogo ? (
                    <img
                      src={place.businessLogo}
                      alt={place.name}
                      className="w-16 h-16 rounded-md object-cover border border-gray-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-xl flex-shrink-0">
                      🏪
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{place.name}</h4>
                    <p className="text-sm text-gray-500">
                      {place.address}, {place.city?.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span
                        className={`inline-block text-xs font-bold px-2 py-1 rounded ${
                          place.active
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {place.active ? "ACTIVE LISTING" : "PENDING APPROVAL"}
                      </span>

                      {/* VIEW ON MAP BUTTON */}
                      <button
                        onClick={() => setSelectedPlace(place)}
                        className="text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1 rounded transition-colors border border-orange-200 flex items-center gap-1"
                      >
                        📍 View on Map
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500 text-sm">
                No places registered yet.
              </div>
            )}
          </div>
        </div>

        {/* Payment History */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
            Payment History
            <span className="bg-gray-200 text-gray-700 text-sm py-1 px-3 rounded-full">
              {paymentHistory?.length || 0}
            </span>
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
                        <p className="font-bold text-black">
                          {payment.plan.replace("_", " ")}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          {payment.referenceNumber}
                        </p>
                      </td>
                      <td className="p-4 font-black">
                        Rs. {payment.amount}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            payment.status === "APPROVED"
                              ? "bg-green-100 text-green-700"
                              : payment.status === "PENDING"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-gray-500 text-sm bg-gray-50">
                No payment history found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAP MODAL POPUP */}
      {selectedPlace && (
        <MapModal
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      {/* CUSTOM STATUS CONFIRMATION MODAL */}
      {isConfirmModalOpen && pendingStatus !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200">
            
            <div className="mb-6">
              <h3 className="text-xl font-black text-gray-900 mb-2">Confirm Action</h3>
              <p className="text-gray-600 text-sm">
                Are you sure you want to <strong className={pendingStatus ? "text-green-600" : "text-red-600"}>
                  {pendingStatus ? "ACTIVATE" : "DEACTIVATE"}
                </strong> this partner account?
              </p>
            </div>

            {/* Error Message Display inside Modal */}
            {statusError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-bold">
                {statusError}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isUpdatingStatus}
                className="px-5 py-2.5 font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleStatus}
                disabled={isUpdatingStatus}
                className={`px-5 py-2.5 font-bold rounded-lg transition flex justify-center items-center min-w-[120px] disabled:opacity-50 ${
                  pendingStatus
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isUpdatingStatus ? "Processing..." : "Yes, Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Map Modal Component
function MapModal({ place, onClose }: { place: any; onClose: () => void }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Handle lat/lng property naming safely (lat/latitude, lng/longitude)
    const lng = Number(place.longitude ?? place.lng ?? 0);
    const lat = Number(place.latitude ?? place.lat ?? 0);

    // Mapbox expects coordinates in [longitude, latitude] order
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 16, // High zoom level as requested
    });

    // Add navigation controls (Zoom +/- buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add Marker on location
    const marker = new mapboxgl.Marker({ color: "#f97316" })
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h4 style="font-weight:bold;margin-bottom:2px">${place.name}</h4><p style="margin:0;font-size:12px;color:#666">${place.address || ""}</p>`
        )
      )
      .addTo(map);

    // Automatically open popup on load
    marker.togglePopup();

    // Cleanup on unmount
    return () => map.remove();
  }, [place]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{place.name}</h3>
            <p className="text-xs text-gray-500">{place.address}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Map Container */}
        <div className="w-full h-[400px] relative">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        
      </div>
      
    </div>

    
  );
}
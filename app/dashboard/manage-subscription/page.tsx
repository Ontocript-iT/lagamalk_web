"use client";

import { useState } from "react";
import { requestSubscription, approveSubscription, updatePlaceCount } from "@/services/admin"; // Added updatePlaceCount

export default function AdminSubscriptionPage() {
    // Request Form State
    const [userId, setUserId] = useState("");
    const [plan, setPlan] = useState("ONE_MONTH");
    const [placesCount, setPlacesCount] = useState<number>(0);

    // Approve Form State
    const [referenceNumber, setReferenceNumber] = useState("");

    // Update Places Form State
    const [updateUserId, setUpdateUserId] = useState("");
    const [addPlacesCount, setAddPlacesCount] = useState<number>(0);
    const [updateDetails, setUpdateDetails] = useState<any>(null);

    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [requestDetails, setRequestDetails] = useState<any>(null);

    // Handle requesting a subscription
    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        setRequestDetails(null);
        setUpdateDetails(null);

        try {
            const res = await requestSubscription(userId, plan, placesCount);
            console.log("Request Response:", res);
            setSuccess("Subscription requested successfully!");
            setRequestDetails(res);

            // Auto-fill the approve form for convenience
            if (res?.referenceNumber) {
                setReferenceNumber(res.referenceNumber);
            }
        } catch (err: any) {
            setError(err.message || "An error occurred while requesting.");
        } finally {
            setLoading(false);
        }
    };

    // Handle approving a subscription
    const handleApprove = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!referenceNumber) return;

        setLoading(true);
        setError("");
        setSuccess("");
        setUpdateDetails(null);

        try {
            await approveSubscription(referenceNumber);
            setSuccess(`Subscription ${referenceNumber} approved successfully!`);
            setReferenceNumber(""); // clear after success
        } catch (err: any) {
            setError(err.message || "An error occurred while approving.");
        } finally {
            setLoading(false);
        }
    };

    // Handle updating place count
    const handleUpdatePlaces = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!updateUserId || addPlacesCount <= 0) return;

        setLoading(true);
        setError("");
        setSuccess("");
        setUpdateDetails(null);
        setRequestDetails(null);

        try {
            const res = await updatePlaceCount(updateUserId, addPlacesCount);
            setSuccess(res.message || "Place count successfully added!");
            setUpdateDetails(res);

            // Clear inputs after success
            setUpdateUserId("");
            setAddPlacesCount(0);
        } catch (err: any) {
            setError(err.message || "An error occurred while updating place count.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto md:p-4">
            <h1 className="text-3xl font-extrabold mb-8 text-black">Subscription Management</h1>

            {/* Global Notifications */}
            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl font-bold shadow-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl font-bold shadow-sm">
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- 1. REQUEST SUBSCRIPTION FORM --- */}
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-xl font-black uppercase tracking-wide mb-6 text-black">
                        Request Subscription
                    </h2>
                    <form onSubmit={handleRequest} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                User ID / Mobile Number
                            </label>
                            <input
                                type="text"
                                required
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="e.g. 0706786773"
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition font-semibold text-black"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Subscription Plan
                            </label>
                            <select
                                value={plan}
                                onChange={(e) => setPlan(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition font-semibold text-black"
                            >
                                <option value="ONE_MONTH">1 Month</option>
                                <option value="THREE_MONTHS">3 Months</option>
                                <option value="SIX_MONTHS">6 Months</option>
                                <option value="ONE_YEAR">1 Year</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Additional Places Count
                            </label>
                            <input
                                type="number"
                                min="0"
                                required
                                value={placesCount}
                                onChange={(e) => setPlacesCount(Number(e.target.value))}
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition font-semibold text-black"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-orange-500 px-8 py-3 mt-4 rounded-lg font-extrabold hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            {loading ? "Processing..." : "Create Request"}
                        </button>
                    </form>

                    {/* Show calculation result details after request */}
                    {requestDetails && (
                        <div className="mt-8 bg-orange-50 p-6 rounded-xl border border-orange-100 flex flex-col gap-3">
                            <h3 className="text-sm font-black text-black uppercase tracking-wide mb-1">Request Summary</h3>

                            <div className="flex justify-between items-center border-b border-orange-200/60 pb-2">
                                <span className="text-gray-600 font-semibold text-sm">Ref Number:</span>
                                <span className="font-mono font-bold text-black">{requestDetails.referenceNumber}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-orange-200/60 pb-2">
                                <span className="text-gray-600 font-semibold text-sm">Base Amount:</span>
                                <span className="font-bold text-black">Rs. {requestDetails.baseAmount}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-orange-200/60 pb-2">
                                <span className="text-gray-600 font-semibold text-sm">Places Cost:</span>
                                <span className="font-bold text-black">Rs. {requestDetails.additionalPlacesCost}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-orange-200/60 pb-2">
                                <span className="text-gray-600 font-semibold text-sm">Total Places:</span>
                                <span className="font-bold text-black">{requestDetails.totalPlacesAllowed}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-gray-800 font-black uppercase text-xs tracking-wider">Total Amount:</span>
                                <span className="text-2xl font-black text-orange-600">Rs. {requestDetails.totalAmount}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column (Approve & Update) */}
                <div className="space-y-8 h-fit">

                    {/* --- 2. APPROVE SUBSCRIPTION FORM --- */}
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-black uppercase tracking-wide mb-6 text-black">
                            Approve Subscription
                        </h2>
                        <form onSubmit={handleApprove} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Reference Number
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={referenceNumber}
                                    onChange={(e) => setReferenceNumber(e.target.value)}
                                    placeholder="e.g. LS4646935"
                                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition font-semibold text-black"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !referenceNumber}
                                className="w-full bg-black text-green-400 px-8 py-3 mt-4 rounded-lg font-extrabold hover:bg-gray-800 transition disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Approve Subscription"}
                            </button>
                        </form>
                    </div>

                    {/* --- 3. ADD PLACES FORM --- */}
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-black uppercase tracking-wide mb-6 text-black">
                            Add Allowed Places
                        </h2>
                        <form onSubmit={handleUpdatePlaces} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    User ID / Mobile Number
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={updateUserId}
                                    onChange={(e) => setUpdateUserId(e.target.value)}
                                    placeholder="e.g. 0715385959"
                                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-semibold text-black"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Places to Add
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={addPlacesCount}
                                    onChange={(e) => setAddPlacesCount(Number(e.target.value))}
                                    placeholder="e.g. 5"
                                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-semibold text-black"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || addPlacesCount <= 0 || !updateUserId}
                                className="w-full bg-black text-blue-400 px-8 py-3 mt-4 rounded-lg font-extrabold hover:bg-gray-800 transition disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Update Place Count"}
                            </button>
                        </form>

                        {/* Show update summary details */}
                        {updateDetails && (
                            <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col gap-3">
                                <h3 className="text-sm font-black text-black uppercase tracking-wide mb-1">Update Summary</h3>

                                <div className="flex justify-between items-center border-b border-blue-200/60 pb-2">
                                    <span className="text-gray-600 font-semibold text-sm">Previous Total:</span>
                                    <span className="font-bold text-black">{updateDetails.previousPlacesCount} Places</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-blue-200/60 pb-2">
                                    <span className="text-gray-600 font-semibold text-sm">Places Added:</span>
                                    <span className="font-bold text-black">+{updateDetails.placesAdded}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-gray-800 font-black uppercase text-xs tracking-wider">New Total Allowed:</span>
                                    <span className="text-2xl font-black text-blue-600">{updateDetails.newTotalPlaces}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
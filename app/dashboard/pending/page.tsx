"use client";

import { useState, useEffect } from "react";
import {
  getPendingPlaces, getPendingOffers, getPendingSubscriptions,
  approvePlace, updateOfferStatus, approveSubscription,
  searchSubscriptionByRef, updatePlaceDetails, searchCategoriesApi, searchCitiesApi // <-- Added updatePlaceDetails
} from "@/services/admin";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRef } from "react";

// Set Mapbox access token from environment variables
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
export default function PendingApprovals() {
  // Tab & Data State
  const [activeTab, setActiveTab] = useState<"places" | "offers" | "subscriptions">("places");
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Map State
  const [selectedPlaceMap, setSelectedPlaceMap] = useState<any>(null);

  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [cityResults, setCityResults] = useState<any[]>([]);

  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [categoryResults, setCategoryResults] = useState<any[]>([]);
  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Edit Place State
  const [isEditingPlace, setIsEditingPlace] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [editError, setEditError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === "places") {
        response = await getPendingPlaces(page);
        setData(response.places || []);
      } else if (activeTab === "offers") {
        response = await getPendingOffers(page);
        setData(response.offers || []);
      } else if (activeTab === "subscriptions") {
        response = await getPendingSubscriptions(page);
        setData(response.subscriptions || []);
      }
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setSearchQuery("");
  }, [activeTab, page]);




  // Handle City Search Typing
  const handleCitySearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setCitySearchQuery(query);
    setEditFormData({ ...editFormData, cityName: query }); // Keep form sync

    if (query.length > 2) {
      try {
        const res = await searchCitiesApi(query);
        setCityResults(res.data || []);
      } catch (err) {
        console.error("City search failed", err);
      }
    } else {
      setCityResults([]);
    }
  };

// Handle Category Search Typing
  const handleCategorySearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setCategorySearchQuery(query);
    setEditFormData({ ...editFormData, categoryName: query });

    if (query.length > 2) {
      try {
        const res = await searchCategoriesApi(query);
        // Flatten parent/subcategories for easy dropdown selection
        let flatCategories: any[] = [];
        res.data?.forEach((parent: any) => {
          flatCategories.push({ id: parent.id, name: parent.name, type: "Main" });
          if (parent.subCategories) {
            parent.subCategories.forEach((sub: any) => {
              flatCategories.push({ id: sub.id, name: sub.name, type: "Sub", parentName: parent.name });
            });
          }
        });
        setCategoryResults(flatCategories);
      } catch (err) {
        console.error("Category search failed", err);
      }
    } else {
      setCategoryResults([]);
    }
  };

// Selection Handlers
  const selectCity = (city: any) => {
    setEditFormData({ ...editFormData, cityId: city.id, cityName: city.name, latitude: city.latitude, longitude: city.longitude });
    setCitySearchQuery(city.name);
    setCityResults([]); // Close dropdown
  };

  const selectCategory = (category: any) => {
    setEditFormData({ ...editFormData, categoryId: category.id, categoryName: category.name });
    setCategorySearchQuery(category.name);
    setCategoryResults([]); // Close dropdown
  };

// Update toggleEditPlace to preset the search inputs
// Add these two lines inside your existing toggleEditPlace function when setting editFormData:
// setCitySearchQuery(selectedItem.city?.name || "");
// setCategorySearchQuery(selectedItem.category?.name || "");


  // Actions
  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsEditingPlace(false);
    setEditError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setIsEditingPlace(false);
  };

  const handleApprovePlace = async (id: number) => {
    setIsProcessing(true);
    try {
      await approvePlace(id);
      closeModal();
      fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveOffer = async (id: number) => {
    setIsProcessing(true);
    await updateOfferStatus(id, "APPROVED");
    setIsProcessing(false);
    closeModal();
    fetchData();
  };

  const handleApproveSubscription = async (refNum: string) => {
    setIsProcessing(true);
    await approveSubscription(refNum);
    setIsProcessing(false);
    closeModal();
    fetchData();
  };

  const handleSearchSubscription = async () => {
    if (!searchQuery.trim()) {
      fetchData();
      return;
    }
    setLoading(true);
    try {
      const response = await searchSubscriptionByRef(searchQuery);
      if (response && response.status === "success" && response.data) {
        setData([response.data]);
        setTotalPages(1);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Search failed", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // --- EDIT PLACE FUNCTIONS ---
  const toggleEditPlace = () => {
    if (!isEditingPlace) {
      setEditFormData({
        name: selectedItem.name || "",
        description: selectedItem.description || "",
        address: selectedItem.address || "",
        latitude: selectedItem.latitude ?? "",
        longitude: selectedItem.longitude ?? "",
        phoneNumber: selectedItem.phoneNumber || "",
        whatsappNumber: selectedItem.whatsappNumber || "",
        website: selectedItem.website || "",
        businessLogo: selectedItem.businessLogo || "",
        cityId: selectedItem.city?.id || selectedItem.cityId || "",
        categoryId: selectedItem.category?.id || selectedItem.categoryId || "",
        cityName: selectedItem.city?.name || "",
        categoryName: selectedItem.category?.name || "",
        openTime: selectedItem.openTime?.substring(0, 5) || "",
        closeTime: selectedItem.closeTime?.substring(0, 5) || "",
        availableServices: selectedItem.availableServices?.join(", ") || "",
        hashtags: selectedItem.hashtags?.join(", ") || "",
        mediaGallery: selectedItem.mediaGallery?.join(",\n") || "",
        customFields: selectedItem.customFields ? JSON.stringify(selectedItem.customFields, null, 2) : "{}",
      });
    }
    setEditError("");
    setIsEditingPlace(!isEditingPlace);
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSavePlace = async () => {
    setIsProcessing(true);
    setEditError("");
    try {
      let parsedCustomFields = {};
      try {
        parsedCustomFields = JSON.parse(editFormData.customFields || "{}");
      } catch {
        throw new Error("Invalid JSON format in Custom Fields.");
      }

      // Safely parse IDs and coordinates
      const parsedCityId = editFormData.cityId ? Number(editFormData.cityId) : null;
      const parsedCategoryId = editFormData.categoryId ? Number(editFormData.categoryId) : null;
      const parsedLat = editFormData.latitude ? parseFloat(editFormData.latitude) : null;
      const parsedLng = editFormData.longitude ? parseFloat(editFormData.longitude) : null;

      const payload = {
        name: editFormData.name,
        description: editFormData.description,
        address: editFormData.address,
        latitude: parsedLat,
        longitude: parsedLng,
        phoneNumber: editFormData.phoneNumber,
        whatsappNumber: editFormData.whatsappNumber,
        website: editFormData.website,
        businessLogo: editFormData.businessLogo,
        cityId: parsedCityId,
        categoryId: parsedCategoryId,
        openTime: editFormData.openTime || null,
        closeTime: editFormData.closeTime || null,
        availableServices: editFormData.availableServices ? editFormData.availableServices.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        hashtags: editFormData.hashtags ? editFormData.hashtags.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        mediaGallery: editFormData.mediaGallery ? editFormData.mediaGallery.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        customFields: parsedCustomFields,
      };

      await updatePlaceDetails(selectedItem.id, payload);

      // Update local state cleanly so the UI refreshes instantly with new names & data
      setSelectedItem({
        ...selectedItem,
        ...payload,
        city: {
          id: parsedCityId,
          name: editFormData.cityName || selectedItem.city?.name
        },
        category: {
          id: parsedCategoryId,
          name: editFormData.categoryName || selectedItem.category?.name
        }
      });

      setIsEditingPlace(false);
      fetchData(); // Refreshes table in the background
    } catch (err: any) {
      setEditError(err.message || "Failed to save place updates.");
    } finally {
      setIsProcessing(false);
    }
  };
  return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-black">Pending Approvals</h1>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 mb-6">
          {(["places", "offers", "subscriptions"] as const).map((tab) => (
              <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setPage(0); }}
                  className={`py-3 px-8 text-sm font-bold uppercase tracking-wider transition-all duration-200 rounded-t-lg ${
                      activeTab === tab
                          ? "bg-black text-orange-500"
                          : "text-gray-500 hover:bg-gray-100 hover:text-black"
                  }`}
              >
                {tab}
              </button>
          ))}
        </div>

        {/* Search Bar for Subscriptions */}
        {activeTab === "subscriptions" && (
            <div className="mb-6 flex items-center gap-3">
              <input
                  type="text"
                  placeholder="Search by Reference No. (e.g. LS9147684)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubscription()}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              <button
                  onClick={handleSearchSubscription}
                  className="px-6 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition"
              >
                Search
              </button>
              {searchQuery && (
                  <button
                      onClick={() => { setSearchQuery(""); fetchData(); }}
                      className="px-6 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition"
                  >
                    Clear
                  </button>
              )}
            </div>
        )}

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
              <div className="py-20 text-center text-gray-500 font-semibold animate-pulse">Loading {activeTab}...</div>
          ) : data.length === 0 ? (
              <div className="py-20 text-center text-gray-500 bg-gray-50">
                <span className="text-4xl block mb-2">🎉</span>
                {searchQuery ? "No subscriptions found for that reference." : `All caught up! No pending ${activeTab} at the moment.`}
              </div>
          ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-black tracking-wider border-b border-gray-200">
                    {activeTab === "places" && (
                        <>
                          <th className="p-4">Place Name</th>
                          <th className="p-4">Location</th>
                          <th className="p-4">Partner</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </>
                    )}
                    {activeTab === "offers" && (
                        <>
                          <th className="p-4">Offer Title</th>
                          <th className="p-4">Discount</th>
                          <th className="p-4">Host / Place</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </>
                    )}
                    {activeTab === "subscriptions" && (
                        <>
                          <th className="p-4">Reference No.</th>
                          <th className="p-4">Plan / Amount</th>
                          <th className="p-4">User</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </>
                    )}
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                  {data.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">

                        {/* PLACES ROW */}
                        {activeTab === "places" && (
                            <>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  {item.businessLogo ? (
                                      <img src={item.businessLogo} alt="logo" className="w-10 h-10 rounded object-cover border" />
                                  ) : (
                                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">🏪</div>
                                  )}
                                  <div>
                                    <p className="font-bold text-black">{item.name}</p>
                                    <p className="text-xs text-gray-400">ID: #{item.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <p className="text-sm font-medium">{item.city?.name || `City ID: ${item.cityId}`}</p>
                                <p className="text-xs text-gray-500 truncate max-w-[150px]">{item.address}</p>
                              </td>
                              <td className="p-4">
                                <p className="text-sm font-medium">{item.createdBy?.firstName}</p>
                                <p className="text-xs text-gray-500">{item.phoneNumber}</p>
                              </td>
                            </>
                        )}

                        {/* OFFERS ROW */}
                        {activeTab === "offers" && (
                            <>
                              <td className="p-4">
                                <p className="font-bold text-black">{item.title}</p>
                                <p className="text-xs text-gray-400">ID: #{item.id}</p>
                              </td>
                              <td className="p-4">
                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">{item.discountTag}</span>
                              </td>
                              <td className="p-4">
                                <p className="text-sm font-medium">{item.hostedBy?.firstName}</p>
                                <p className="text-xs text-gray-500">{item.place?.name}</p>
                              </td>
                            </>
                        )}

                        {/* SUBSCRIPTIONS ROW */}
                        {activeTab === "subscriptions" && (
                            <>
                              <td className="p-4 font-mono text-sm">{item.referenceNumber}</td>
                              <td className="p-4">
                                <p className="font-bold text-black">{item.plan}</p>
                                <p className="text-sm font-black text-orange-500">Rs. {item.amount}</p>
                              </td>
                              <td className="p-4">
                                <p className="text-sm font-medium">{item.user?.firstName}</p>
                                <p className="text-xs text-gray-500">{item.user?.mobileNumber}</p>
                              </td>
                            </>
                        )}

                        {/* COMMON STATUS & ACTIONS */}
                        <td className="p-4 text-center">
                      <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {item.status || "Pending"}
                      </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => handleView(item)} className="px-3 py-1.5 bg-gray-100 text-gray-700 font-semibold text-xs rounded hover:bg-gray-200 transition">
                            View Details
                          </button>
                          {item.status !== "APPROVED" && (
                              <button
                                  onClick={() => {
                                    if (activeTab === "places") handleApprovePlace(item.id);
                                    if (activeTab === "offers") handleApproveOffer(item.id);
                                    if (activeTab === "subscriptions") handleApproveSubscription(item.referenceNumber);
                                  }}
                                  className="px-3 py-1.5 bg-black text-orange-500 font-bold text-xs rounded hover:bg-gray-800 transition"
                              >
                                Approve
                              </button>
                          )}
                        </td>

                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>

        {/* Pagination */}
        {!searchQuery && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-5 py-2 bg-white border border-gray-200 text-black font-semibold rounded-lg disabled:opacity-50 hover:bg-gray-50 transition">Previous</button>
              <span className="text-gray-500 font-bold">Page {page + 1} of {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="px-5 py-2 bg-white border border-gray-200 text-black font-semibold rounded-lg disabled:opacity-50 hover:bg-gray-50 transition">Next</button>
            </div>
        )}

        {/* --- DETAILED VIEW MODAL --- */}
        {isModalOpen && selectedItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8 flex flex-col relative">

                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                  <h2 className="text-2xl font-black uppercase tracking-wide">
                    {isEditingPlace ? "Edit Place Details" : `Review ${activeTab.slice(0, -1)} Details`}
                  </h2>
                  <button onClick={closeModal} className="text-gray-400 hover:text-black font-bold text-2xl transition">&times;</button>
                </div>

                {/* Error Message */}
                {editError && (
                    <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg font-semibold">
                      {editError}
                    </div>
                )}

                {/* Modal Body */}
                <div className="p-6 space-y-8">

                  {/* --- PLACES EDIT MODE --- */}
                  {activeTab === "places" && isEditingPlace && (
                      <div className="space-y-6">
                        {/* Basic Place Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Place Name</label>
                            <input
                                type="text"
                                name="name"
                                value={editFormData.name}
                                onChange={handleFormChange}
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 font-semibold text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Business Logo URL</label>
                            <input
                                type="text"
                                name="businessLogo"
                                value={editFormData.businessLogo}
                                onChange={handleFormChange}
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 font-semibold text-black"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                value={editFormData.description}
                                onChange={handleFormChange}
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 font-semibold text-black"
                            />
                          </div>
                        </div>

                        {/* Location & Categorization (Searchable Dropdowns) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-orange-50/40 p-4 rounded-xl border border-orange-100">

                          {/* CITY SEARCH */}
                          <div className="relative">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                              City <span className="text-orange-600 font-black">({editFormData.cityName || "None"})</span>
                            </label>
                            <input
                                type="text"
                                value={citySearchQuery}
                                onChange={handleCitySearch}
                                placeholder="Type to search city..."
                                className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 font-bold text-black"
                            />

                            {/* City Dropdown */}
                            {cityResults.length > 0 && (
                                <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-xl max-h-60 overflow-y-auto">
                                  {cityResults.map((city) => (
                                      <li
                                          key={city.id}
                                          onClick={() => selectCity(city)}
                                          className="p-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-0 transition"
                                      >
                                        <p className="font-bold text-sm text-black">{city.name}</p>
                                        <p className="text-[10px] text-gray-500 font-mono">Lat: {city.latitude} | Lng: {city.longitude}</p>
                                      </li>
                                  ))}
                                </ul>
                            )}
                          </div>

                          {/* CATEGORY SEARCH */}
                          <div className="relative">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                              Category <span className="text-orange-600 font-black">(ID: {editFormData.categoryName || "None"})</span>
                            </label>
                            <input
                                type="text"
                                value={categorySearchQuery}
                                onChange={handleCategorySearch}
                                placeholder="Type to search category..."
                                className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 font-bold text-black"
                            />

                            {/* Category Dropdown */}
                            {categoryResults.length > 0 && (
                                <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-xl max-h-60 overflow-y-auto">
                                  {categoryResults.map((cat) => (
                                      <li
                                          key={cat.id}
                                          onClick={() => selectCategory(cat)}
                                          className="p-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-0 transition flex flex-col gap-1"
                                      >
                                        <p className="font-bold text-sm text-black">{cat.name}</p>
                                        {cat.type === "Sub" ? (
                                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded w-fit uppercase font-black">
                IN: {cat.parentName}
              </span>
                                        ) : (
                                            <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded w-fit uppercase font-black">
                Main Category
              </span>
                                        )}
                                      </li>
                                  ))}
                                </ul>
                            )}
                          </div>
                        </div>

                        {/* Address & Coordinates */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={editFormData.address}
                                onChange={handleFormChange}
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 font-semibold text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                name="latitude"
                                value={editFormData.latitude}
                                onChange={handleFormChange}
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 font-semibold text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                name="longitude"
                                value={editFormData.longitude}
                                onChange={handleFormChange}
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 font-semibold text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Website</label>
                            <input
                                type="text"
                                name="website"
                                value={editFormData.website}
                                onChange={handleFormChange}
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 font-semibold text-black"
                            />
                          </div>
                        </div>

                        {/* Contact & Hours */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={editFormData.phoneNumber}
                                onChange={handleFormChange}
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 font-semibold text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp</label>
                            <input
                                type="text"
                                name="whatsappNumber"
                                value={editFormData.whatsappNumber}
                                onChange={handleFormChange}
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 font-semibold text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Open Time (HH:mm)</label>
                            <input
                                type="time"
                                name="openTime"
                                value={editFormData.openTime}
                                onChange={handleFormChange}
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 font-semibold text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Close Time (HH:mm)</label>
                            <input
                                type="time"
                                name="closeTime"
                                value={editFormData.closeTime}
                                onChange={handleFormChange}
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 font-semibold text-black"
                            />
                          </div>
                        </div>

                        {/* Lists (Services, Hashtags, Media Gallery, Custom Fields) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Available Services (Comma separated)</label>
                            <textarea
                                name="availableServices"
                                rows={2}
                                value={editFormData.availableServices}
                                onChange={handleFormChange}
                                placeholder="Free Wi-Fi, Swimming Pool, Spa"
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 font-semibold text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hashtags (Comma separated)</label>
                            <textarea
                                name="hashtags"
                                rows={2}
                                value={editFormData.hashtags}
                                onChange={handleFormChange}
                                placeholder="#travel, #beach, #luxury"
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 font-semibold text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Media Gallery URLs (Comma separated)</label>
                            <textarea
                                name="mediaGallery"
                                rows={3}
                                value={editFormData.mediaGallery}
                                onChange={handleFormChange}
                                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 font-semibold text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Custom Fields (JSON format)</label>
                            <textarea
                                name="customFields"
                                rows={3}
                                value={editFormData.customFields}
                                onChange={handleFormChange}
                                placeholder='{"managerName": "John Doe", "acceptedCards": "Visa"}'
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg font-mono text-xs focus:outline-none focus:border-orange-500 text-black"
                            />
                          </div>
                        </div>
                      </div>
                  )}
                  {/* --- PLACES VIEW MODE --- */}
                  {activeTab === "places" && !isEditingPlace && (
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Left Column: Logo & Partner / Contact Info */}
                          <div className="w-full md:w-1/3 space-y-4">
                            <img
                                src={selectedItem.businessLogo || "/placeholder.jpg"}
                                alt={selectedItem.name}
                                className="w-full h-48 object-cover rounded-xl border border-gray-200 shadow-sm"
                            />

                            {/* Partner Information Card */}
                            {selectedItem.createdBy && (
                                <div className="bg-orange-50/60 border border-orange-100 p-4 rounded-xl space-y-1">
                                  <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 block">Submitted By Partner</span>
                                  <p className="font-bold text-black text-sm">{selectedItem.createdBy.firstName} {selectedItem.createdBy.lastName}</p>
                                  <p className="text-xs text-gray-600 font-medium">{selectedItem.createdBy.mobileNumber} | {selectedItem.createdBy.email}</p>
                                </div>
                            )}

                            {/* Quick Contact & Hours Box */}
                            <div className="space-y-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <p><strong>📞 Phone:</strong> {selectedItem.phoneNumber || "N/A"}</p>
                              {selectedItem.whatsappNumber && <p><strong>💬 WhatsApp:</strong> {selectedItem.whatsappNumber}</p>}
                              {selectedItem.website && (
                                  <p className="truncate">
                                    <strong>🌐 Web:</strong>{" "}
                                    <a href={selectedItem.website} target="_blank" rel="noreferrer" className="text-orange-600 hover:underline">
                                      {selectedItem.website}
                                    </a>
                                  </p>
                              )}
                              <p><strong>🕒 Hours:</strong> {selectedItem.openTime?.substring(0, 5) || "N/A"} - {selectedItem.closeTime?.substring(0, 5) || "N/A"}</p>
                            </div>
                          </div>

                          {/* Right Column: Place Overview, Category, City, Description */}
                          <div className="w-full md:w-2/3 space-y-5">
                            <div>
                              {/* Category & City Badges (Names instead of IDs) */}
                              <div>
                                {/* Category & City Badges */}
                                <div className="flex flex-wrap items-center gap-2 mb-2">
    <span className="bg-black text-orange-500 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
      {selectedItem.category?.name || "Uncategorized"}
    </span>
                                  <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
      📍 {selectedItem.city?.name || "Unknown City"}
    </span>
                                </div>

                                <h3 className="text-2xl font-black text-black">{selectedItem.name}</h3>

                                {/* ADDRESS & MAP BUTTON */}
                                <div className="flex items-center gap-3 mt-1">
                                  <p className="text-sm text-gray-500 font-medium">{selectedItem.address}</p>
                                  {(selectedItem.latitude && selectedItem.longitude) && (
                                      <button
                                          onClick={() => setSelectedPlaceMap(selectedItem)}
                                          className="text-[10px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded transition-colors border border-orange-200 flex items-center gap-1 uppercase tracking-wider shadow-sm"
                                      >
                                        📍 View on Map
                                      </button>
                                  )}
                                </div>
                              </div>
                              <h3 className="text-2xl font-black text-black">{selectedItem.name}</h3>
                              <p className="text-sm text-gray-500 font-medium">{selectedItem.address}</p>
                            </div>

                            {/* Description */}
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Description</h4>
                              <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {selectedItem.description}
                              </p>
                            </div>

                            {/* Services */}
                            {selectedItem.availableServices?.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Available
                                    Services</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedItem.availableServices.map((svc: string, i: number) => (
                                        <span key={i}
                                              className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-lg border border-gray-200">
                  ✓ {svc}
                </span>
                                    ))}
                                  </div>
                                </div>
                            )}

                            {/* Hashtags */}
                            {selectedItem.hashtags?.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Hashtags</h4>
                                  <div className="flex flex-wrap gap-1.5">
                                    {selectedItem.hashtags.map((tag: string, i: number) => (
                                        <span key={i} className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded">
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
                                    ))}
                                  </div>
                                </div>
                            )}

                            {/* Custom Fields */}
                            {selectedItem.customFields && Object.keys(selectedItem.customFields).length > 0 && (
                                <div>
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Additional Metadata</h4>
                                  <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(selectedItem.customFields).map(([key, value]: any, i) => (
                                        <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{key}</span>
                                          <span className="font-bold text-sm text-black break-all">{value}</span>
                                        </div>
                                    ))}
                                  </div>
                                </div>
                            )}
                          </div>
                        </div>

                        {/* Media Gallery */}
                        {selectedItem.mediaGallery?.length > 0 && (
                            <div className="pt-4 border-t border-gray-100">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Media Gallery ({selectedItem.mediaGallery.length})</h4>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {selectedItem.mediaGallery.map((img: string, i: number) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt={`Gallery ${i}`}
                                        className="w-full h-28 object-cover rounded-xl border border-gray-200 shadow-sm hover:scale-105 transition-transform duration-200"
                                    />
                                ))}
                              </div>
                            </div>
                        )}
                      </div>
                  )}

                  {/* OFFERS MODAL CONTENT (UNCHANGED) */}
                  {activeTab === "offers" && (
                      <div className="space-y-6">
                        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
                          <h3 className="text-3xl font-extrabold text-black mb-2">{selectedItem.title}</h3>
                          <span className="inline-block bg-orange-500 text-black font-black px-4 py-1 rounded shadow-sm mb-4">
                      {selectedItem.discountTag}
                    </span>
                          <p className="text-lg text-gray-700">{selectedItem.description}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <h4 className="font-bold text-gray-400 uppercase text-xs mb-3">Host & Place Details</h4>
                            <p className="font-semibold">Host: {selectedItem.hostedBy?.firstName} {selectedItem.hostedBy?.lastName}</p>
                            <p className="text-sm text-gray-500 mb-4">Email: {selectedItem.hostedBy?.email}</p>

                            <p className="font-semibold">Place: {selectedItem.place?.name}</p>
                            <p className="text-sm text-gray-500">{selectedItem.place?.address}, {selectedItem.place?.city?.name}</p>
                          </div>

                          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <h4 className="font-bold text-gray-400 uppercase text-xs mb-3">Offer Conditions</h4>
                            <p className="text-sm mb-2"><strong>Starts:</strong> {new Date(selectedItem.scheduleStartDate).toLocaleString()}</p>
                            <p className="text-sm mb-4"><strong>Ends:</strong> {new Date(selectedItem.validUntil).toLocaleString()}</p>

                            {selectedItem.customFields && Object.keys(selectedItem.customFields).length > 0 && (
                                <div className="space-y-2 pt-4 border-t">
                                  {Object.entries(selectedItem.customFields).map(([key, value]: any, i) => (
                                      <p key={i} className="text-sm"><strong>{key}:</strong> {value}</p>
                                  ))}
                                </div>
                            )}
                          </div>
                        </div>
                      </div>
                  )}

                  {/* SUBSCRIPTIONS MODAL CONTENT (UNCHANGED) */}
                  {activeTab === "subscriptions" && (
                      <div className="space-y-6">
                        <div className="text-center bg-gray-50 py-10 rounded-xl border border-gray-100">
                          <h3 className="text-gray-500 font-bold uppercase tracking-widest mb-2">Plan Selected</h3>
                          <p className="text-3xl font-black mb-2">{selectedItem.plan.replace("_", " ")}</p>
                          <p className="text-5xl font-black text-orange-500">Rs. {selectedItem.amount}</p>
                          <p className="text-sm text-gray-400 mt-4 font-mono">Reference: {selectedItem.referenceNumber}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-5 border border-gray-200 rounded-lg">
                            <h4 className="font-bold text-gray-400 uppercase text-xs mb-3">User Details</h4>
                            <p className="font-semibold">{selectedItem.user?.firstName} {selectedItem.user?.lastName}</p>
                            <p className="text-sm">Mobile: {selectedItem.user?.mobileNumber}</p>
                            <p className="text-sm">Email: {selectedItem.user?.email}</p>
                          </div>
                          <div className="p-5 border border-gray-200 rounded-lg">
                            <h4 className="font-bold text-gray-400 uppercase text-xs mb-3">Timeline</h4>
                            <p className="text-sm"><strong>Created:</strong> {new Date(selectedItem.createdAt).toLocaleString()}</p>
                            <p className="text-sm"><strong>Start Date:</strong> {new Date(selectedItem.startDate).toLocaleString()}</p>
                            <p className="text-sm"><strong>End Date:</strong> {new Date(selectedItem.endDate).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                  )}
                </div>

                {/* Modal Footer (Action Buttons) */}
                <div className="p-6 border-t border-gray-100 bg-white rounded-b-2xl flex justify-between items-center gap-4">

                  {/* Left Side: Edit Toggle for Places */}
                  <div>
                    {activeTab === "places" && (
                        <button
                            onClick={toggleEditPlace}
                            disabled={isProcessing}
                            className={`px-6 py-3 font-bold rounded-lg transition ${
                                isEditingPlace ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                            }`}
                        >
                          {isEditingPlace ? "Cancel Edit" : "Edit Details"}
                        </button>
                    )}
                  </div>

                  {/* Right Side: Primary Actions */}
                  <div className="flex gap-4">
                    <button onClick={closeModal} disabled={isProcessing} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition">
                      Close
                    </button>

                    {isEditingPlace ? (
                        <button
                            onClick={handleSavePlace}
                            disabled={isProcessing}
                            className="px-8 py-3 bg-blue-600 text-white font-extrabold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 shadow-sm"
                        >
                          {isProcessing ? "Saving..." : "Save Changes"}
                        </button>
                    ) : (
                        selectedItem.status !== "APPROVED" && (
                            <button
                                disabled={isProcessing}
                                onClick={() => {
                                  if (activeTab === "places") handleApprovePlace(selectedItem.id);
                                  if (activeTab === "offers") handleApproveOffer(selectedItem.id);
                                  if (activeTab === "subscriptions") handleApproveSubscription(selectedItem.referenceNumber);
                                }}
                                className="px-8 py-3 bg-black text-orange-500 font-extrabold rounded-lg hover:bg-gray-900 transition disabled:opacity-50 shadow-sm"
                            >
                              {isProcessing ? "Processing..." : `Approve ${activeTab.slice(0, -1)}`}
                            </button>
                        )
                    )}
                  </div>
                </div>

              </div>
            </div>
        )}
        {selectedPlaceMap && (
            <MapModal
                place={selectedPlaceMap}
                onClose={() => setSelectedPlaceMap(null)}
            />
        )}
      </div>
  );
}

// Map Modal Component
function MapModal({ place, onClose }: { place: any; onClose: () => void }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const lng = Number(place.longitude ?? place.lng ?? 0);
    const lat = Number(place.latitude ?? place.lat ?? 0);

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 16,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    const marker = new mapboxgl.Marker({ color: "#f97316" })
        .setLngLat([lng, lat])
        .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<h4 style="font-weight:bold;margin-bottom:2px">${place.name}</h4><p style="margin:0;font-size:12px;color:#666">${place.address || ""}</p>`
            )
        )
        .addTo(map);

    marker.togglePopup();

    return () => map.remove();
  }, [place]);

  return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">

          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
            <div>
              <h3 className="text-lg font-black text-gray-900">{place.name}</h3>
              <p className="text-xs text-gray-500 font-medium">{place.address}</p>
            </div>
            <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-lg transition-colors"
            >
              &times;
            </button>
          </div>

          {/* Map Container */}
          <div className="w-full h-[450px] relative">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>
        </div>
      </div>
  );
}
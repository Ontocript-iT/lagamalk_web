"use client";

import { useState, useEffect } from "react";
import { searchCities, getPlacesByCity, getOffersByCity } from "@/services/admin";

export default function CityExplorer() {
  // City Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  // Data State
  const [activeTab, setActiveTab] = useState<"places" | "offers">("places");
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Debounced City Search
  useEffect(() => {
    const fetchCities = async () => {
      if (searchQuery.length < 2) {
        setCityOptions([]);
        return;
      }
      
      try {
        const res = await searchCities(searchQuery, 0, 5);
        if (res.status === 200 && Array.isArray(res.data)) {
          setCityOptions(res.data);
        } else {
          setCityOptions([]);
        }
      } catch (error) {
        console.error("Failed to fetch cities", error);
        setCityOptions([]);
      }
    };

    const timeoutId = setTimeout(() => fetchCities(), 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch Data when City, Tab, or Page changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCity) return;
      
      setLoading(true);
      try {
        let response;
        if (activeTab === "places") {
          response = await getPlacesByCity(selectedCity.id, page);
          setData(response.places || []);
        } else {
          response = await getOffersByCity(selectedCity.id, page);
          setData(response.offers || []);
        }
        setTotalPages(response.totalPages || 1);
      } catch (error) {
        console.error(`Failed to fetch ${activeTab}`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCity, activeTab, page]);

  const handleCitySelect = (city: any) => {
    setSelectedCity(city);
    setSearchQuery(city.name);
    setIsDropdownOpen(false);
    setPage(0);
    setData([]);
  };

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-black">City Explorer</h1>

      {/* City Search Autocomplete */}
      <div className="mb-10 relative max-w-md z-20">
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
          Search Location
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsDropdownOpen(true);
            if (e.target.value === "") setSelectedCity(null);
          }}
          placeholder="Type a city name (e.g. Colombo)..."
          className="w-full bg-white border-2 border-gray-200 p-4 rounded-lg focus:outline-none focus:border-orange-500 transition shadow-sm text-lg font-semibold"
        />
        
        {/* Dropdown Results */}
        {isDropdownOpen && cityOptions.length > 0 && (
          <ul className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden divide-y divide-gray-100">
            {cityOptions.map((city) => (
              <li 
                key={city.id}
                onClick={() => handleCitySelect(city)}
                className="p-4 hover:bg-orange-50 cursor-pointer transition flex items-center gap-3"
              >
                <span className="text-xl">📍</span>
                <div>
                  <p className="font-bold text-black">{city.name}</p>
                  <p className="text-xs text-gray-400 font-mono">Lat: {city.latitude} | Lng: {city.longitude}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main Content Area */}
      {selectedCity ? (
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">Showing results for <span className="text-orange-500">{selectedCity.name}</span></h2>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 border-b border-gray-200 mb-6">
            {(["places", "offers"] as const).map((tab) => (
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

          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="py-20 text-center text-gray-500 font-semibold animate-pulse">Fetching data for {selectedCity.name}...</div>
            ) : data.length === 0 ? (
              <div className="py-20 text-center bg-gray-50">
                <span className="text-4xl block mb-3 text-gray-300">📭</span>
                <p className="text-gray-500 font-medium">No {activeTab} found in {selectedCity.name}.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-black tracking-wider border-b border-gray-200">
                      {activeTab === "places" && (
                        <>
                          <th className="p-4">Place Name</th>
                          <th className="p-4">Address</th>
                          <th className="p-4">Partner</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </>
                      )}
                      {activeTab === "offers" && (
                        <>
                          <th className="p-4">Offer Title</th>
                          <th className="p-4">Discount</th>
                          <th className="p-4">Host</th>
                          <th className="p-4">Valid Until</th>
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
                                  <img src={item.businessLogo} alt="logo" className="w-10 h-10 rounded object-cover border border-gray-200" />
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
                              <p className="text-sm font-medium truncate max-w-[200px]">{item.address}</p>
                            </td>
                            <td className="p-4">
                              <p className="text-sm font-medium">{item.createdBy?.firstName}</p>
                              <p className="text-xs text-gray-500">{item.phoneNumber}</p>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${item.active ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-800"}`}>
                                {item.active ? "Active" : "Pending"}
                              </span>
                            </td>
                          </>
                        )}

                        {/* OFFERS ROW */}
                        {activeTab === "offers" && (
                          <>
                            <td className="p-4">
                              <p className="font-bold text-black truncate max-w-[250px]">{item.title}</p>
                              <p className="text-xs text-gray-400">ID: #{item.id}</p>
                            </td>
                            <td className="p-4">
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">{item.discountTag}</span>
                            </td>
                            <td className="p-4">
                              <p className="text-sm font-medium">{item.hostedBy?.firstName}</p>
                              <p className="text-xs text-gray-500 truncate max-w-[150px]">{item.hostedBy?.email}</p>
                            </td>
                            <td className="p-4">
                              <p className="text-sm font-medium">{new Date(item.validUntil).toLocaleDateString()}</p>
                            </td>
                          </>
                        )}

                        {/* ACTION BUTTON */}
                        <td className="p-4 text-right">
                          <button onClick={() => handleView(item)} className="px-4 py-2 bg-black text-orange-500 font-bold text-xs rounded hover:bg-gray-800 transition">
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
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-5 py-2 bg-white border border-gray-200 text-black font-semibold rounded-lg disabled:opacity-50 hover:bg-gray-50 transition">Previous</button>
              <span className="text-gray-500 font-bold">Page {page + 1} of {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="px-5 py-2 bg-white border border-gray-200 text-black font-semibold rounded-lg disabled:opacity-50 hover:bg-gray-50 transition">Next</button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-32 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
          <span className="text-5xl block mb-4">🌍</span>
          <h3 className="text-xl font-bold text-gray-400">Search and select a city to explore</h3>
        </div>
      )}

      {/* --- DETAILED VIEW MODAL --- */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-2xl font-black uppercase tracking-wide">
                {activeTab.slice(0, -1)} Details
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-black font-bold text-2xl transition">&times;</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* PLACES MODAL CONTENT */}
              {activeTab === "places" && (
                <>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                      <img src={selectedItem.businessLogo || "/placeholder.jpg"} alt="Logo" className="w-full h-48 object-cover rounded-xl border border-gray-200 mb-4 shadow-sm" />
                      <h3 className="text-2xl font-extrabold text-black">{selectedItem.name}</h3>
                      <p className="text-gray-500 mb-4">{selectedItem.address}, {selectedItem.city?.name}</p>
                      
                      <div className="space-y-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                        <p><strong>📞 Phone:</strong> {selectedItem.phoneNumber}</p>
                        {selectedItem.whatsappNumber && <p><strong>💬 WhatsApp:</strong> {selectedItem.whatsappNumber}</p>}
                        {selectedItem.website && <p><strong>🌐 Web:</strong> {selectedItem.website}</p>}
                        <p><strong>🕒 Open:</strong> {selectedItem.openTime || "N/A"} - {selectedItem.closeTime || "N/A"}</p>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-2/3 space-y-6">
                      <div>
                        <h4 className="font-bold text-lg border-b pb-2 mb-2">Description</h4>
                        <p className="text-gray-600">{selectedItem.description}</p>
                      </div>
                      
                      {selectedItem.availableServices?.length > 0 && (
                        <div>
                          <h4 className="font-bold text-lg border-b pb-2 mb-2">Services</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedItem.availableServices.map((svc: string, i: number) => (
                              <span key={i} className="bg-black text-white text-xs px-3 py-1 rounded-full">{svc}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedItem.customFields && Object.keys(selectedItem.customFields).length > 0 && (
                        <div>
                          <h4 className="font-bold text-lg border-b pb-2 mb-2">Additional Info</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(selectedItem.customFields).map(([key, value]: any, i) => (
                              <div key={i} className="bg-gray-50 p-3 rounded border border-gray-100">
                                <span className="block text-xs font-bold text-gray-400 uppercase">{key}</span>
                                <span className="font-semibold text-sm">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedItem.mediaGallery?.length > 0 && (
                    <div>
                      <h4 className="font-bold text-lg border-b pb-2 mb-4">Media Gallery</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedItem.mediaGallery.map((img: string, i: number) => (
                          <img key={i} src={img} alt={`Gallery ${i}`} className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm hover:scale-105 transition-transform" />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* OFFERS MODAL CONTENT */}
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
                      <h4 className="font-bold text-gray-400 uppercase text-xs mb-3">Host Details</h4>
                      <p className="font-semibold">{selectedItem.hostedBy?.firstName} {selectedItem.hostedBy?.lastName}</p>
                      <p className="text-sm text-gray-500 mb-4">Email: {selectedItem.hostedBy?.email}</p>
                      
                      <h4 className="font-bold text-gray-400 uppercase text-xs mb-3">Status</h4>
                      <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${selectedItem.status === 'APPROVED' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {selectedItem.status}
                      </span>
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
            </div>

            <div className="p-6 border-t border-gray-100 bg-white flex justify-end">
              <button onClick={closeModal} className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition">
                Close View
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper to get headers with the auth token
const getHeaders = () => {
  const token = localStorage.getItem("token");
  console.log("Using token:", token); // Debugging line
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// --- GET REQUESTS (Paginated) ---

export async function getPartners(search = "", page = 0, size = 10) {
  // If there is a search term, append it to the URL
  const url = search 
    ? `${API_URL}/api/admin/partners?search=${encodeURIComponent(search)}&page=${page}&size=${size}`
    : `${API_URL}/api/admin/partners?page=${page}&size=${size}`;

  const res = await fetch(url, { headers: getHeaders() });
  return res.json();
}

export async function getPartnerDetails(id: number) {
  const res = await fetch(`${API_URL}/api/admin/partners/${id}`, { headers: getHeaders() });
  return res.json();
}

export async function getPendingPlaces(page = 0, size = 10) {
  const res = await fetch(`${API_URL}/api/admin/pending/places?page=${page}&size=${size}`, { headers: getHeaders() });
  return res.json();
}

export async function getPendingOffers(page = 0, size = 10) {
  const res = await fetch(`${API_URL}/api/admin/pending/offers?page=${page}&size=${size}`, { headers: getHeaders() });
  return res.json();
}

export async function getPendingSubscriptions(page = 0, size = 10) {
  const res = await fetch(`${API_URL}/api/admin/pending/subscriptions?page=${page}&size=${size}`, { headers: getHeaders() });
  return res.json();
}

// --- UPDATE/APPROVE ACTIONS ---

export async function approvePlace(id: number) {
  const res = await fetch(`${API_URL}/api/places/updatePlaceStatus/${id}?isActive=true`, {
    method: "PUT",
    headers: getHeaders(),
  });
  return res.json();
}

export async function updateOfferStatus(id: number, status: string) {
  const res = await fetch(`${API_URL}/api/offers/${id}/status?status=${status}`, {
    method: "PUT",
    headers: getHeaders(),
  });
  return res.json();
}

export async function approveSubscription(referenceNumber: string) {
  const res = await fetch(`${API_URL}/api/admin/subscriptions/approve/${referenceNumber}`, {
    method: "PUT",
    headers: getHeaders(),
  });
  return res.json();
}

export async function searchCities(query: string, page = 0, size = 5) {
  const res = await fetch(`${API_URL}/api/data/cities?search=${query}&page=${page}&size=${size}`, {
    // Removed getHeaders() to prevent sending the Authorization token
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
}

export async function getPlacesByCity(cityId: number, page = 0, size = 10) {
  const res = await fetch(`${API_URL}/api/admin/cities/${cityId}/places?page=${page}&size=${size}`, {
    headers: getHeaders(),
  });
  return res.json();
}

export async function getOffersByCity(cityId: number, page = 0, size = 10) {
  const res = await fetch(`${API_URL}/api/admin/cities/${cityId}/offers?page=${page}&size=${size}`, {
    headers: getHeaders(),
  });
  return res.json();
}

// Add this to your services/admin.ts file

export async function searchPaymentHistory(mobile: string, reference: string, page = 0, size = 10) {
  let url = `${API_URL}/api/admin/partners/payments?page=${page}&size=${size}`;
  
  if (mobile) url += `&mobile=${encodeURIComponent(mobile)}`;
  if (reference) url += `&reference=${encodeURIComponent(reference)}`;

  const res = await fetch(url, { headers: getHeaders() });
  return res.json();
}

export async function updatePartnerStatus(partnerId: number, status: boolean) {
  const res = await fetch(`${API_URL}/api/admin/partners/${partnerId}/status?status=${status}`, {
    method: "PUT",
    headers: getHeaders(),
  });
  return res.json();
}

export const getPendingSubscriptions1 = async (page: number, mobile: string = "", reference: string = "") => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  
  const params = new URLSearchParams({
    page: page.toString(),
    size: "10"
  });

  // Search parameters තිබේ නම් පමණක් URL එකට එකතු කිරීම
  if (mobile) params.append("mobile", mobile);
  if (reference) params.append("reference", reference);

  const response = await fetch(`${API_URL}/api/admin/partners/payments?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch subscriptions");
  }

  return await response.json();
};


export const searchSubscriptionByRef = async (refNum: string) => {
  // Retrieve your auth token (adjust this based on where your app stores it)
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

  const response = await fetch(`${API_URL}/api/admin/subscriptions/search/${refNum}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Add the Authorization header here
      "Authorization": `Bearer ${token}` 
    }
  });

  if (!response.ok) {
    throw new Error("Failed to search subscription");
  }
  
  return response.json();
};


// Fetch Active Places Count
export const getActivePlacesCount = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const response = await fetch(`${API_URL}/api/admin/getActivePlacesCount`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Failed to fetch active places");
  return response.json();
};

// Fetch Active Partner Count
export const getActivePartnerCount = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const response = await fetch(`${API_URL}/api/admin/getActivePartnerCount`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Failed to fetch active partners");
  return response.json();
};

// Fetch Pending Tasks Count
export const getPendingTasksCount = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const response = await fetch(`${API_URL}/api/admin/getPendingPlacesAndOffersAndSubscriptionsCount`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Failed to fetch pending tasks");
  return response.json();
};

export async function requestSubscription(phoneNumber: string, plan: string, placesCount: number) {
  // Matches backend route: /api/subscriptions/request/{id}?plan={plan}&placesCount={placesCount}
  const url = `${API_URL}/api/subscriptions/request/${phoneNumber}?plan=${plan}&placesCount=${placesCount}`;

  // Note: Assuming the backend expects a POST request for creation.
  // Change method to 'GET' if your backend uses @GetMapping.
  const res = await fetch(url, {
    method: "POST",
    headers: getHeaders()
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to request subscription.");
  }

  return data;
}

/**
 * Approve a pending subscription by reference number
 */
export async function approveSubscription1(referenceNumber: string) {
  // Matches backend route: /api/admin/subscriptions/approve/{referenceNumber}
  const url = `${API_URL}/api/admin/subscriptions/approve/${referenceNumber}`;

  // Note: Assuming POST or PUT. Update if your backend requires something else.
  const res = await fetch(url, {
    method: "POST",
    headers: getHeaders()
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to approve subscription.");
  }

  return data || { success: true };
}

/**
 * Add more places to an existing user's active subscription
 */
export async function updatePlaceCount(userId: string, newPlaceCount: number) {
  // Matches backend route: /api/places/updatePlaceCountByUserMobile/{userIdentifier}?newPlaceCount={newPlaceCount}
  const url = `${API_URL}/api/places/updatePlaceCountByUserMobile/${userId}?newPlaceCount=${newPlaceCount}`;

  // Using POST or PUT depending on your backend (POST is a safe default for custom actions)
  const res = await fetch(url, {
    method: "PUT", // Change to "PUT" if your Spring controller uses @PutMapping
    headers: getHeaders()
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to update place count.");
  }

  return data;
}

/**
 * Update Place Details
 */
export async function updatePlaceDetails(placeId: number | string, placeData: any) {
  const url = `${API_URL}/api/places/updatePlaceDetails/${placeId}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(placeData)
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to update place details.");
  }

  return data;
}

export async function searchCitiesApi(query: string) {
  const url = `${API_URL}/api/data/cities?search=${encodeURIComponent(query)}&page=0&size=10`;
  const res = await fetch(url, { headers: getHeaders() });
  return res.json();
}

export async function searchCategoriesApi(query: string) {
  const url = `${API_URL}/api/data/categories?search=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: getHeaders() });
  return res.json();
}
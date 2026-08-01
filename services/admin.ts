const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper to get headers with the auth token
const getHeaders = () => {
  const token = localStorage.getItem("token");
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
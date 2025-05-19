import { getToken } from "../utils/auth-helper.js";

const API_BASE_URL = "https://story-api.dicoding.dev/v1";

const createStoryFormData = (storyData) => {
  const formData = new FormData();
  formData.append("description", storyData.description);
  formData.append("photo", storyData.photo);
  if (storyData.lat) formData.append("lat", storyData.lat);
  if (storyData.lon) formData.append("lon", storyData.lon);
  return formData;
};

const fetchWithToken = async (url, options = {}) => {
  const token = getToken();
  const requiresAuth = options.requiresAuth !== false;

  if (requiresAuth && !token) {
    throw new Error("Authentication required");
  }

  const headers = options.headers ? { ...options.headers } : {};

  if (requiresAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,

    requiresAuth: undefined,
  };

  const response = await fetch(url, config);
  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error(responseJson.message || "Something went wrong");
  }

  return responseJson;
};

const apiService = {
  register: async (user) => {
    return fetchWithToken(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      requiresAuth: false,
    });
  },

  login: async (credentials) => {
    return fetchWithToken(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      requiresAuth: false,
    });
  },

  getAllStories: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.size) queryParams.append("size", params.size);
    if (params.location) queryParams.append("location", params.location);

    const url = `${API_BASE_URL}/stories?${queryParams.toString()}`;
    return fetchWithToken(url);
  },

  getStoryDetail: async (id) => {
    const url = `${API_BASE_URL}/stories/${id}`;
    return fetchWithToken(url);
  },

  addStory: async (storyData) => {
    const formData = createStoryFormData(storyData);
    return fetchWithToken(`${API_BASE_URL}/stories`, {
      method: "POST",
      body: formData,
    });
  },

  addStoryAsGuest: async (storyData) => {
    const formData = createStoryFormData(storyData);
    return fetchWithToken(`${API_BASE_URL}/stories/guest`, {
      method: "POST",
      body: formData,
      requiresAuth: false,
    });
  },

  subscribeNotification: async (subscription) => {
    return fetchWithToken(`${API_BASE_URL}/notifications/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });
  },

  unsubscribeNotification: async (endpoint) => {
    return fetchWithToken(`${API_BASE_URL}/notifications/subscribe`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ endpoint }),
    });
  },
};

export default apiService;
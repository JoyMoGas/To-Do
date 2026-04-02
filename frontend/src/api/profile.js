import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.split('activities')[0] : "http://127.0.0.1:8000/api/";

export const getProfile = async () => {
  const response = await axios.get(`${API_BASE_URL}users/profile/`);
  return response.data;
};

export const updateProfile = async (formData) => {
  const response = await axios.put(`${API_BASE_URL}users/profile/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const searchUsers = async (query) => {
  const response = await axios.get(`${API_BASE_URL}users/search/?q=${query}`);
  return response.data;
};

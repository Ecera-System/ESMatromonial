import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/users`;

export const getAllUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`);
  return response.data;
};

export const searchUsers = async (query) => {
  try {
    const response = await axios.get(
      `${API_URL}/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};

import axios from 'axios';
const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/users`;

export const getAllUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`);
  return response.data;
}; 
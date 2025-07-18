// Assuming you have an axios instance configured
import axios from "axios";
export const getMatchedUsers = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/feed/matched-users`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching matched users:", error);
    throw error;
  }
};

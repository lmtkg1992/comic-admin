import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Centralized API base URL

export const fetchStories = async (page = 1, size = 10, searchTerm = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/beapi/stories/list?page=${page}&size=${size}`, {
      params: {
        search: searchTerm || undefined,
      },
    });

    const { list, totalCount } = response.data.data;
    return {
      stories: list,
      totalPages: Math.ceil(totalCount / size),
    };
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }
};
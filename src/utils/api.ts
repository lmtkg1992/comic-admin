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

export const fetchChapters = async (storyId: string, page = 1, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/beapi/chapters/list/${storyId}?page=${page}&size=${size}`);
    const { list, totalCount } = response.data.data;
    return {
      chapters: list,
      totalPages: Math.ceil(totalCount / size),
    };
  } catch (error) {
    console.error("Error fetching chapters:", error);
    throw error;
  }
};

export const fetchCategories = async (page = 1, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/beapi/categories/list?page=${page}&size=${size}`);
    const { list, totalCount } = response.data.data;
    return {
      categories: list,
      totalPages: Math.ceil(totalCount / size),
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchAuthors = async (page = 1, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/beapi/authors/list?page=${page}&size=${size}`);
    const { list, totalCount } = response.data.data;
    return {
      authors: list,
      totalPages: Math.ceil(totalCount / size),
    };
  } catch (error) {
    console.error("Error fetching authors:", error);
    throw error;
  }
};
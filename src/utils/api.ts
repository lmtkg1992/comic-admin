import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL; // Centralized API base URL

// Tạo axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: if 401 Unauthorized, remove token from localStorage
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code && error.code === "ERR_NETWORK") {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }
    return Promise.reject(error);
  }
);


// Stories

export const fetchStories = async (page = 1, size = 10, searchTerm = "") => {
  try {
    const response = await axiosInstance.get(`/beapi/stories/list?page=${page}&size=${size}`, {
      params: {
        search: searchTerm || undefined,
      },
    });

    const { list, total } = response.data.data;
    return {
      stories: list,
      totalPages: Math.ceil(total / size),
    };
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }
};

export const fetchStoryDetail = async (storyId: string) => {
  const response = await axiosInstance.get(`/beapi/stories/detail/${storyId}`);
  return response.data.data;
};

export const updateStory = async (storyId: string, payload: any) => {
  const response = await axiosInstance.put(`/beapi/stories/update/${storyId}`, payload);
  return response.data;
};

export const createStory = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`/beapi/stories/create`, payload);
    return response.data.data.story_id;
  } catch (error) {
    console.error("Error creating story:", error);
    throw error;
  }
};

export const deleteStory = async (storyId: string) => {
  try {
    const response = await axiosInstance.delete(`/beapi/stories/delete/${storyId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting story:", error);
    throw error;
  }
};

// Chapters

export const fetchChapters = async (storyId: string, page = 1, size = 10) => {
  try {
    const response = await axiosInstance.get(`/beapi/chapters/list/${storyId}?page=${page}&size=${size}`);
    const { list, total } = response.data.data;
    return {
      chapters: list,
      totalPages: Math.ceil(total / size),
    };
  } catch (error) {
    console.error("Error fetching chapters:", error);
    throw error;
  }
};

export const fetchChapterDetail = async (chapterId: string) => {
  const response = await axiosInstance.get(`/beapi/chapters/detail/${chapterId}`);
  return response.data.data;
};

export const updateChapter = async (chapterId: string, payload: any) => {
  const response = await axiosInstance.put(`/beapi/chapters/update/${chapterId}`, payload);
  return response.data;
};

export const deleteChapter = async (chapterId: string) => {
  const response = await axiosInstance.delete(`/beapi/chapters/delete/${chapterId}`);
  return response.data;
};

export const createChapter = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`/beapi/chapters/create`, payload);
    return response.data.data.chapter_id;
  } catch (error) {
    console.error("Error creating chapter:", error);
    throw error;
  }
};

// Categories

export const fetchCategories = async (page = 1, size = 10) => {
  try {
    const response = await axiosInstance.get(`/beapi/categories/list?page=${page}&size=${size}`);
    const { list, total } = response.data.data;
    return {
      categories: list,
      totalPages: Math.ceil(total / size),
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchCategoryDetail = async (categoryId: string) => {
  const response = await axiosInstance.get(`/beapi/categories/detail/${categoryId}`);
  return response.data.data;
};

export const updateCategory = async (categoryId: string, payload: any) => {
  const response = await axiosInstance.put(`/beapi/categories/update/${categoryId}`, payload);
  return response.data;
};

export const deleteCategory = async (categoryId: string) => {
  const response = await axiosInstance.delete(`/beapi/categories/delete/${categoryId}`);
  return response.data;
};

export const createCategory = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`/beapi/categories/create`, payload);
    return response.data.data.category_id;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Authors

export const fetchAuthors = async (page = 1, size = 10) => {
  try {
    const response = await axiosInstance.get(`/beapi/authors/list?page=${page}&size=${size}`);
    const { list, total } = response.data.data;
    return {
      authors: list,
      totalPages: Math.ceil(total / size),
    };
  } catch (error) {
    console.error("Error fetching authors:", error);
    throw error;
  }
};

export const fetchAuthorDetail = async (authorId: string) => {
  const response = await axiosInstance.get(`/beapi/authors/detail/${authorId}`);
  return response.data.data;
};

export const updateAuthor = async (authorId: string, payload: any) => {
  const response = await axiosInstance.put(`/beapi/authors/update/${authorId}`, payload);
  return response.data;
};

export const deleteAuthor = async (authorId: string) => {
  const response = await axiosInstance.delete(`/beapi/authors/delete/${authorId}`);
  return response.data;
};

export const createAuthor = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`/beapi/authors/create`, payload);
    return response.data.data.author_id;
  } catch (error) {
    console.error("Error creating author:", error);
    throw error;
  }
};

export const adminLogin = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/beapi/admin_auth/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const adminMe = async () => {
  try {
    const response = await axiosInstance.get("/beapi/admin/me");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching admin me:", error);
    throw error;
  }
};

// File Media

export const uploadFile = async (file: File, entityType: string) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post(
      `/beapi/file_media/upload?entity_type=${entityType}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
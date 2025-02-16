import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL; // Centralized API base URL

// Stories

export const fetchStories = async (page = 1, size = 10, searchTerm = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/beapi/stories/list?page=${page}&size=${size}`, {
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
  const response = await axios.get(`${API_BASE_URL}/beapi/stories/detail/${storyId}`);
  return response.data.data;
};

export const updateStory = async (storyId: string, payload: any) => {
  const response = await axios.put(`${API_BASE_URL}/beapi/stories/update/${storyId}`, payload);
  return response.data;
};

export const createStory = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/beapi/stories/create`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.data.story_id;
  } catch (error) {
    console.error("Error creating story:", error);
    throw error;
  }
};

export const deleteStory = async (storyId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/beapi/stories/delete/${storyId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting story:", error);
    throw error;
  }
};

// Chapters

export const fetchChapters = async (storyId: string, page = 1, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/beapi/chapters/list/${storyId}?page=${page}&size=${size}`);
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
  const response = await axios.get(`${API_BASE_URL}/beapi/chapters/detail/${chapterId}`);
  return response.data.data;
};

export const updateChapter = async (chapterId: string, payload: any) => {
  const response = await axios.put(`${API_BASE_URL}/beapi/chapters/update/${chapterId}`, payload);
  return response.data;
};

export const deleteChapter = async (chapterId: string) => {
  const response = await axios.delete(`${API_BASE_URL}/beapi/chapters/delete/${chapterId}`);
  return response.data;
};

export const createChapter = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/beapi/chapters/create`, payload);
    return response.data.data.chapter_id;
  } catch (error) {
    console.error("Error creating chapter:", error);
    throw error;
  }
};

// Categories

export const fetchCategories = async (page = 1, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/beapi/categories/list?page=${page}&size=${size}`);
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
  const response = await axios.get(`${API_BASE_URL}/beapi/categories/detail/${categoryId}`);
  return response.data.data;
};

export const updateCategory = async (categoryId: string, payload: any) => {
  const response = await axios.put(`${API_BASE_URL}/beapi/categories/update/${categoryId}`, payload);
  return response.data;
};

export const deleteCategory = async (categoryId: string) => {
  const response = await axios.delete(`${API_BASE_URL}/beapi/categories/delete/${categoryId}`);
  return response.data;
};

export const createCategory = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/beapi/categories/create`, payload);
    return response.data.data.category_id;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Authors

export const fetchAuthors = async (page = 1, size = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/beapi/authors/list?page=${page}&size=${size}`);
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
  const response = await axios.get(`${API_BASE_URL}/beapi/authors/detail/${authorId}`);
  return response.data.data;
};

export const updateAuthor = async (authorId: string, payload: any) => {
  const response = await axios.put(`${API_BASE_URL}/beapi/authors/update/${authorId}`, payload);
  return response.data;
};

export const deleteAuthor = async (authorId: string) => {
  const response = await axios.delete(`${API_BASE_URL}/beapi/authors/delete/${authorId}`);
  return response.data;
};

export const createAuthor = async (payload: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/beapi/authors/create`, payload);
    return response.data.data.author_id;
  } catch (error) {
    console.error("Error creating author:", error);
    throw error;
  }
};

// File Media

export const uploadFile = async (file: File, entityType: string) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/beapi/file_media/upload?entity_type=${entityType}`,
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
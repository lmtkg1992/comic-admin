"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Select from "react-select";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { fetchStoryDetail, fetchCategories, fetchAuthors, updateStory, uploadFile } from "@/utils/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditStoryPage = () => {
  const searchParams = useSearchParams();
  const storyId = searchParams.get("storyId");
  const [story, setStory] = useState<any>(null);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: "",
    is_active: "true",
    description: "",
    status: "ongoing",
    is_full: "false",
    is_hot: "false",
    source: "",
    translator: "",
    author_id: "",
    path_image_obj: null,
    publish_date: new Date(),
    updated_date: new Date(),
  });

  useEffect(() => {
    if (!storyId) return;

    const adjustDateForTimezone = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      date.setHours(date.getHours() + 7);
      return date;
    };

    const loadData = async () => {
      try {
        const storyDetail = await fetchStoryDetail(storyId);
        const allCategories = await fetchCategories(1, 100);
        const allAuthors = await fetchAuthors(1, 100);

        if (!storyDetail) {
          throw new Error("Story details not found");
        }

        setStory(storyDetail);
        setCategories(
          allCategories.categories.map((category: any) => ({
            value: category.category_id,
            label: category.title,
          }))
        );
        setAuthors(allAuthors.authors);
        setFormData({
          ...formData,
          ...storyDetail,
          author_id: storyDetail?.author?.author_id || "",
          publish_date: adjustDateForTimezone(storyDetail.publish_date),
          updated_date: adjustDateForTimezone(storyDetail.updated_date),
        });

        setSelectedCategories(
          storyDetail?.categories?.map((cat: any) => ({
            value: cat.category_id,
            label: cat.category_name,
          })) || []
        );
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [storyId]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (selectedOptions: any) => {
    setSelectedCategories(selectedOptions || []);
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const response = await uploadFile(file, "stories_cover");
      if (response?.data) {
        const { file_id, path } = response.data;
        setFormData({
          ...formData,
          path_image_obj: { file_id, path },
        });
        alert("File uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!storyId) return;

    try {
      const categoryIds = selectedCategories.map((category: any) => category.value);

      const allowedFields = [
        "title",
        "description",
        "publish_date",
        "updated_date",
        "is_active",
        "status",
        "is_full",
        "is_hot",
        "translator",
        "source",
        "author_id",
        "path_image",
      ];

      const cleanedData = Object.keys(formData)
        .filter((key) => allowedFields.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = formData[key];
          return obj;
        }, {});

      const payload = {
        ...cleanedData,
        categories: categoryIds,
        is_active: formData.is_active === "true",
        is_full: formData.is_full === "true",
        is_hot: formData.is_hot === "true",
        publish_date: formData.publish_date.toISOString().replace("T", " ").slice(0, 19),
        updated_date: formData.updated_date.toISOString().replace("T", " ").slice(0, 19),
      };

      if (formData.path_image_obj?.file_id) {
        payload.path_image = formData.path_image_obj.file_id;
      }

      await updateStory(storyId, payload);
      alert("Story updated successfully!");
    } catch (error) {
      console.error("Error updating story:", error);
      alert("Failed to update story.");
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Story</h1>
        {story ? (
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
              />
            </div>

            {/* Is Active */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Is Active</label>
              <select
                name="is_active"
                value={formData.is_active}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
                rows={5}
              />
            </div>

            {/* Path Image */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Cover Image</label>
              {formData.path_image_obj?.path && (
                <div className="mb-2">
                  <img
                    src={formData.path_image_obj.path}
                    alt="Cover"
                    className="w-40 h-60 object-cover rounded"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 cursor-pointer"
              />
              {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
            </div>


            {/* Categories */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Categories</label>
              <Select
                isMulti
                options={categories}
                value={selectedCategories}
                onChange={handleCategoryChange}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>

            {/* Author */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Author</label>
              <select
                name="author_id"
                value={formData.author_id}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
              >
                {authors.map((author: any) => (
                  <option key={author.author_id} value={author.author_id}>
                    {author.title}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Publish Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Publish Date</label>
              <DatePicker
                selected={formData.publish_date}
                onChange={(date: Date | null) => setFormData({ ...formData, publish_date: date })}                
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm:ss"
                className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
              />
            </div>

            {/* Updated Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Updated Date</label>
              <DatePicker
                selected={formData.updated_date}
                onChange={(date: Date | null) => setFormData({ ...formData, updated_date: date })}
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm:ss"
                className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
              />
            </div>

            {/* Is Full */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Is Full</label>
              <select
                name="is_full"
                value={formData.is_full}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Is Hot */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Is Hot</label>
              <select
                name="is_hot"
                value={formData.is_hot}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Source */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Source</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
              />
            </div>

            {/* Translator */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Translator</label>
              <input
                type="text"
                name="translator"
                value={formData.translator}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
              />
            </div>


            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default EditStoryPage;
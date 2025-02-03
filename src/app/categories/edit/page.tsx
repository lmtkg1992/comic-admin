"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { fetchCategoryDetail, updateCategory } from "@/utils/api";

const EditCategoryPage = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const [category, setCategory] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    title: "",
    priority: 0,
    type_category: "category",
    description: "",
  });

  useEffect(() => {
    if (!categoryId) return;

    const loadData = async () => {
      try {
        const categoryDetail = await fetchCategoryDetail(categoryId);
        if (!categoryDetail) {
          throw new Error("Category details not found");
        }
        setCategory(categoryDetail);
        setFormData({
          title: categoryDetail.title || "",
          priority: categoryDetail.priority || 0,
          type_category: categoryDetail.type_category || "category",
          description: categoryDetail.description || "",
        });
      } catch (error) {
        console.error("Error loading category details:", error);
      }
    };

    loadData();
  }, [categoryId]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!categoryId) return;

    try {
      const payload = {
        title: formData.title,
        priority: Number(formData.priority),
        type_category: formData.type_category,
        description: formData.description,
      };

      await updateCategory(categoryId, payload);
      alert("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category.");
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
        {category ? (
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
                required
              />
            </div>

            {/* Priority */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Priority</label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
                required
              />
            </div>

            {/* Type Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Type Category</label>
              <select
                name="type_category"
                value={formData.type_category}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
                required
              >
                <option value="category">Category</option>
                <option value="good_list">Good List</option>
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
                rows={4}
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <p>Loading category details...</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default EditCategoryPage;
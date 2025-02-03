"use client";

import { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { createCategory } from "@/utils/api";
import { useRouter } from "next/navigation";

const CreateCategoryPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    title: "",
    priority: 0,
    type_category: "category",
    description: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      category_id: "auto",
      increment_id: 1,
      title: formData.title,
      url_key: "auto",
      priority: Number(formData.priority),
      type_category: formData.type_category,
      description: formData.description,
    };

    try {
      const categoryId = await createCategory(payload);
      alert("Category created successfully!");
      router.push(`/categories/edit?categoryId=${categoryId}`);
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category.");
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create Category</h1>
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
            ></textarea>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
          >
            Create Category
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default CreateCategoryPage;
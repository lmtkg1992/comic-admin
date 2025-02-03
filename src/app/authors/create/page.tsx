"use client";

import { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { createAuthor } from "@/utils/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

const CreateAuthorPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    created_date: new Date(),
    updated_date: new Date(),
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const payload = {
        author_id: "auto",
        title: formData.title,
        url_key: "auto",
        description: formData.description,
        created_date: formData.created_date.toISOString().replace("T", " ").slice(0, 19),
        updated_date: formData.updated_date.toISOString().replace("T", " ").slice(0, 19),
      };

      const authorId = await createAuthor(payload);
      alert("Author created successfully!");
      router.push(`/authors/edit?authorId=${authorId}`);
    } catch (error) {
      console.error("Error creating author:", error);
      alert("Failed to create author.");
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create Author</h1>
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

          {/* Created Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Created Date</label>
            <DatePicker
              selected={formData.created_date}
              onChange={(date: Date | null) => setFormData({ ...formData, created_date: date })}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm:ss"
              className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
              required
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
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
          >
            Create Author
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default CreateAuthorPage;
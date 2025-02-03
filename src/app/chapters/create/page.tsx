"use client";

import { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { createChapter } from "@/utils/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useRouter } from "next/navigation";

// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const CreateChapterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    story_id: "",
    title: "",
    short_title: "",
    ordered: 0,
    status: "draft", // default status; adjust as needed
    content: "",
    created_date: new Date(),
    updated_date: new Date(),
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Helper function to format date into "YYYY-MM-DD HH:mm:ss"
    const formatDate = (date: Date) =>
      date.toISOString().replace("T", " ").slice(0, 19);

    // Create the payload following the API requirements
    const payload = {
      chapter_id: "auto",
      increment_id: 1,
      story_id: formData.story_id,
      title: formData.title,
      short_title: formData.short_title,
      url_key: "auto",
      ordered: Number(formData.ordered),
      status: formData.status,
      content: formData.content,
      created_date: formatDate(formData.created_date),
      updated_date: formatDate(formData.updated_date),
    };

    try {
      const chapterId = await createChapter(payload);
      alert("Chapter created successfully!");
      // Redirect to the edit page (or any page you prefer) for the newly created chapter
      router.push(`/chapters/edit?chapterId=${chapterId}`);
    } catch (error) {
      console.error("Error creating chapter:", error);
      alert("Failed to create chapter.");
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create Chapter</h1>
        <form onSubmit={handleSubmit}>
          {/* Story ID */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Story ID</label>
            <input
              type="text"
              name="story_id"
              value={formData.story_id}
              onChange={handleInputChange}
              placeholder="Enter the Story ID"
              className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
              required
            />
          </div>

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

          {/* Short Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Short Title</label>
            <input
              type="text"
              name="short_title"
              value={formData.short_title}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
              required
            />
          </div>

          {/* Order */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Order</label>
            <input
              type="number"
              name="ordered"
              value={formData.ordered}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
              required
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
              required
            >
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Content</label>
            <ReactQuill
              value={formData.content}
              onChange={(content) =>
                setFormData({ ...formData, content })
              }
              theme="snow"
            />
          </div>

          {/* Created Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Created Date
            </label>
            <DatePicker
              selected={formData.created_date}
              onChange={(date: Date | null) =>
                setFormData({
                  ...formData,
                  created_date: date || new Date(),
                })
              }
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm:ss"
              className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
              required
            />
          </div>

          {/* Updated Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Updated Date
            </label>
            <DatePicker
              selected={formData.updated_date}
              onChange={(date: Date | null) =>
                setFormData({
                  ...formData,
                  updated_date: date || new Date(),
                })
              }
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
            Create Chapter
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default CreateChapterPage;
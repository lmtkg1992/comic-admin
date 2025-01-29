"use client";

import { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { createStory } from "@/utils/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useRouter } from "next/navigation";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const CreateStoryPage = () => {
  const router = useRouter();
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
    publish_date: new Date(),
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
        story_id: "auto",
        increment_id: 1,
        title: formData.title,
        url_key: "auto",
        is_active: formData.is_active === "true",
        path_image: "",
        author: {
            author_id: "auto",
            url_key: "auto",
            author_title: "",
        },
        description: formData.description,
        publish_date: formData.publish_date.toISOString().replace("T", " ").slice(0, 19),
        updated_date: formData.updated_date.toISOString().replace("T", " ").slice(0, 19),
        status: formData.status,
        is_full: formData.is_full === "true",
        is_hot: formData.is_hot === "true",
        total_chapters: 0,
        source: formData.source,
        translator: formData.translator,
        categories: [],
      };

      const storyId = await createStory(payload);
      alert("Story created successfully!");
      router.push(`/stories/edit?storyId=${storyId}`);
    } catch (error) {
      console.error("Error creating story:", error);
      alert("Failed to create story.");
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create Story</h1>
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

          {/* Description (Quill.js) */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <ReactQuill
              value={formData.description}
              onChange={(content) => setFormData({ ...formData, description: content })}
              theme="snow"
            />
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
            Create Story
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default CreateStoryPage;
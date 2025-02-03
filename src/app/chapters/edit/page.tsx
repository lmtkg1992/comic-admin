"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { fetchChapterDetail, updateChapter } from "@/utils/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill to prevent SSR issues.
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const EditChapterPage = () => {
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapterId");

  const [chapter, setChapter] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    title: "",
    short_title: "",
    ordered: 0,
    status: "draft",
    content: "",
    created_date: new Date(),
    updated_date: new Date(),
  });

  useEffect(() => {
    if (!chapterId) return;

    // Adjust the date string for your timezone if needed.
    const adjustDateForTimezone = (dateString: string) => {
      if (!dateString) return new Date();
      const date = new Date(dateString);
      date.setHours(date.getHours() + 7);
      return date;
    };

    const loadData = async () => {
      try {
        const chapterDetail = await fetchChapterDetail(chapterId);
        if (!chapterDetail) {
          throw new Error("Chapter details not found");
        }
        setChapter(chapterDetail);
        setFormData({
          ...formData,
          ...chapterDetail,
          created_date: adjustDateForTimezone(chapterDetail.created_date),
          updated_date: adjustDateForTimezone(chapterDetail.updated_date),
        });
      } catch (error) {
        console.error("Error loading chapter details:", error);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!chapterId) return;

    try {
      // Helper function to format date into "YYYY-MM-DD HH:mm:ss"
      const formatDate = (date: Date) =>
        date.toISOString().replace("T", " ").slice(0, 19);

      const payload = {
        title: formData.title,
        short_title: formData.short_title,
        ordered: Number(formData.ordered),
        status: formData.status,
        content: formData.content,
        created_date: formatDate(formData.created_date),
        updated_date: formatDate(formData.updated_date),
      };

      await updateChapter(chapterId, payload);
      alert("Chapter updated successfully!");
    } catch (error) {
      console.error("Error updating chapter:", error);
      alert("Failed to update chapter.");
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Chapter</h1>
        {chapter ? (
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Title
              </label>
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
              <label className="block text-sm font-medium mb-2">
                Short Title
              </label>
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
              <label className="block text-sm font-medium mb-2">
                Order
              </label>
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
              <label className="block text-sm font-medium mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
                required
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Content */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Content
              </label>
              <ReactQuill
                value={formData.content}
                onChange={(content) =>
                  setFormData((prev: any) => ({ ...prev, content }))
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
                  setFormData((prev: any) => ({
                    ...prev,
                    created_date: date,
                  }))
                }
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm:ss"
                className="w-full p-3 rounded-md border border-stroke dark:border-strokedark"
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
                  setFormData((prev: any) => ({
                    ...prev,
                    updated_date: date,
                  }))
                }
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm:ss"
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
          <p>Loading chapter details...</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default EditChapterPage;
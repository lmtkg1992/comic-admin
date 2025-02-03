"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { fetchAuthorDetail, updateAuthor } from "@/utils/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditAuthorPage = () => {
  const searchParams = useSearchParams();
  const authorId = searchParams.get("authorId");

  const [author, setAuthor] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    created_date: new Date(),
    updated_date: new Date(),
  });

  useEffect(() => {
    if (!authorId) return;

    const adjustDateForTimezone = (dateString: string) => {
      if (!dateString) return new Date();
      const date = new Date(dateString);
      date.setHours(date.getHours() + 7);
      return date;
    };

    const loadData = async () => {
      try {
        const authorDetail = await fetchAuthorDetail(authorId);
        if (!authorDetail) {
          throw new Error("Author details not found");
        }
        setAuthor(authorDetail);
        setFormData({
          title: authorDetail.title || "",
          description: authorDetail.description || "",
          created_date: adjustDateForTimezone(authorDetail.created_date),
          updated_date: adjustDateForTimezone(authorDetail.updated_date),
        });
      } catch (error) {
        console.error("Error loading author details:", error);
      }
    };

    loadData();
  }, [authorId]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!authorId) return;

    try {
      const formatDate = (date: Date) =>
        date.toISOString().replace("T", " ").slice(0, 19);

      const payload = {
        title: formData.title,
        description: formData.description,
        created_date: formatDate(formData.created_date),
        updated_date: formatDate(formData.updated_date),
      };

      await updateAuthor(authorId, payload);
      alert("Author updated successfully!");
    } catch (error) {
      console.error("Error updating author:", error);
      alert("Failed to update author.");
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Author</h1>
        {author ? (
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
                onChange={(date: Date | null) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    created_date: date || new Date(),
                  }))
                }
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
                onChange={(date: Date | null) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    updated_date: date || new Date(),
                  }))
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
              Save Changes
            </button>
          </form>
        ) : (
          <p>Loading author details...</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default EditAuthorPage;
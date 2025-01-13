"use client";

import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import { fetchStories } from "@/utils/api"; // Import from utils

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 10; // Corresponds to API size

  useEffect(() => {
    const getStories = async () => {
      try {
        const { stories, totalPages } = await fetchStories(currentPage, storiesPerPage, searchTerm);
        setStories(stories);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    getStories();
  }, [currentPage, searchTerm]);

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Stories</h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full p-3 rounded-md border border-stroke dark:border-strokedark focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Stories Table */}
        <div className="rounded-lg border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow-lg">
          <table className="w-full table-auto">
            <thead className="bg-gray-2 dark:bg-meta-4">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Title</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Active</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Status</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Author</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Publish Date</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Full</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Hot</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Total Chapters</th>
              </tr>
            </thead>
            <tbody>
              {stories.length > 0 ? (
                stories.map((story: any) => (
                  <tr
                    key={story.story_id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-100 dark:hover:bg-meta-4"
                  >
                    <td className="px-4 py-4 text-sm text-black dark:text-white">{story.title}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{story.is_active ? "Yes" : "No"}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{story.status || "N/A"}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{story.author?.author_title || "Unknown"}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{new Date(story.publish_date).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{story.is_full ? "Yes" : "No"}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{story.is_hot ? "Yes" : "No"}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{story.total_chapters}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-sm text-body dark:text-bodydark">
                    No stories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
      </div>
    </DefaultLayout>
  );
};

export default StoriesPage;
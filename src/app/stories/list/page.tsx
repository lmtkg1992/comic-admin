"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import { deleteStory, fetchStories } from "@/utils/api";

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 10;

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

  const handleDelete = async (storyId: string) => {
    if (confirm("Are you sure you want to delete this story?")) {
      try {
        await deleteStory(storyId);
        setStories(stories.filter((story: any) => story.story_id !== storyId));
        alert("Story deleted successfully.");
      } catch (error) {
        console.error("Error deleting story:", error);
        alert("Failed to delete story.");
      }
    }
  };

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
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Story ID</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Title</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Active</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Status</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Author</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Publish Date</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Full</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Hot</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Total Chapters</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stories.length > 0 ? (
                stories.map((story: any) => (
                  <tr
                    key={story.story_id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-100 dark:hover:bg-meta-4"
                  >
                    <td className="px-4 py-4 text-sm text-black dark:text-white">{story.story_id}</td>
                    <td className="px-4 py-4 text-sm text-black dark:text-white">{story.title}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{story.is_active ? "Yes" : "No"}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{story.status || "N/A"}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{story.author?.author_title || "Unknown"}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{new Date(story.publish_date).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{story.is_full ? "Yes" : "No"}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{story.is_hot ? "Yes" : "No"}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{story.total_chapters}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">
                      <Link
                        href={`/stories/edit?storyId=${story.story_id}`}
                        className="mr-2 px-3 py-1 bg-primary text-white rounded-md"
                      >
                        View
                      </Link>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded-md"
                        onClick={() => handleDelete(story.story_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-4 py-6 text-center text-sm text-body dark:text-bodydark">
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
"use client";

import { useState } from "react";
import { storiesData } from "@/data/stories";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination"; // Import the Pagination component

const StoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 2;

  // **Filter and Paginate Stories**
  const filteredStories = storiesData.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = filteredStories.slice(indexOfFirstStory, indexOfLastStory);

  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);

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
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">
                  Title
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">
                  Author
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStories.length > 0 ? (
                currentStories.map((story) => (
                  <tr
                    key={story.id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-100 dark:hover:bg-meta-4"
                  >
                    <td className="px-4 py-4 text-sm text-black dark:text-white">{story.title}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{story.author}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{story.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-sm text-body dark:text-bodydark">
                    No stories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </DefaultLayout>
  );
};

export default StoriesPage;
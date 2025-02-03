"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import { fetchChapters, deleteChapter } from "@/utils/api";

const ChaptersPage = () => {
  const [chapters, setChapters] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchStoryId, setSearchStoryId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const chaptersPerPage = 10;

  const router = useRouter();

  const handleSearch = () => {
    setCurrentPage(1);
    fetchChaptersData(searchStoryId, 1, chaptersPerPage);
  };

  const fetchChaptersData = async (storyId: string, page = 1, size = 10) => {
    try {
      const { chapters, totalPages } = await fetchChapters(storyId, page, size);
      setChapters(chapters);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  const handleView = (chapterId: string) => {
    router.push(`/chapters/edit?chapterId=${chapterId}`);
  };

  const handleDelete = async (chapterId: string) => {
    if (confirm("Are you sure you want to delete this chapter?")) {
      try {
        await deleteChapter(chapterId);
        setChapters((prevChapters) =>
          prevChapters.filter((chapter: any) => chapter.chapter_id !== chapterId)
        );
      } catch (error) {
        console.error("Error deleting chapter:", error);
      }
    }
  };

  useEffect(() => {
    if (searchStoryId) {
      fetchChaptersData(searchStoryId, currentPage, chaptersPerPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Chapters</h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter story ID..."
            className="w-full p-3 rounded-md border border-stroke dark:border-strokedark focus:ring-2 focus:ring-primary"
            value={searchStoryId}
            onChange={(e) => setSearchStoryId(e.target.value)}
          />
          <button
            className="mt-2 px-4 py-2 bg-primary text-white rounded-md"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* Chapters Table */}
        <div className="rounded-lg border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow-lg">
          <table className="w-full table-auto">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Title</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">URL Key</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Order</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Status</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Created Date</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chapters.length > 0 ? (
                chapters.map((chapter: any) => (
                  <tr
                    key={chapter.chapter_id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <td className="px-4 py-4 text-sm text-black dark:text-white">{chapter.title}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{chapter.url_key}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{chapter.ordered}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{chapter.status}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">
                      {new Date(chapter.created_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">
                      <button
                        className="mr-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                        onClick={() => handleView(chapter.chapter_id)}
                      >
                        View
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                        onClick={() => handleDelete(chapter.chapter_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-body dark:text-bodydark">
                    No chapters found.
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

export default ChaptersPage;
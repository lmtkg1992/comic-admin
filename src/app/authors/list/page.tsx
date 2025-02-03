"use client";

import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import { fetchAuthors } from "@/utils/api";

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const authorsPerPage = 10; // Corresponds to API size

  useEffect(() => {
    const getAuthors = async () => {
      try {
        const { authors, totalPages } = await fetchAuthors(currentPage, authorsPerPage);
        setAuthors(authors);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    getAuthors();
  }, [currentPage]);

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Authors</h1>

        {/* Authors Table */}
        <div className="rounded-lg border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow-lg">
          <table className="w-full table-auto">
            <thead className="bg-gray-2 dark:bg-meta-4">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Author ID</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Title</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">URL Key</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {authors.length > 0 ? (
                authors.map((author: any) => (
                  <tr
                    key={author.author_id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-100 dark:hover:bg-meta-4"
                  >
                    <td className="px-4 py-4 text-sm text-black dark:text-white">{author.author_id}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{author.title}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{author.url_key}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">
                      {new Date(author.created_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-body dark:text-bodydark">
                    No authors found.
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

export default AuthorsPage;
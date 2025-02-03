"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import { fetchCategories, deleteCategory } from "@/utils/api";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10; // Corresponds to API size
  const router = useRouter();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const { categories, totalPages } = await fetchCategories(currentPage, categoriesPerPage);
        setCategories(categories);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, [currentPage]);

  const handleView = (categoryId: string) => {
    router.push(`/categories/edit?categoryId=${categoryId}`);
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(categoryId);
        setCategories((prevCategories) =>
          prevCategories.filter((category: any) => category.category_id !== categoryId)
        );
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Categories</h1>

        {/* Categories Table */}
        <div className="rounded-lg border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow-lg">
          <table className="w-full table-auto">
            <thead className="bg-gray-2 dark:bg-meta-4">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Category ID</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Title</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">URL Key</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Type</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Priority</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category: any) => (
                  <tr
                    key={category.category_id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-100 dark:hover:bg-meta-4"
                  >
                    <td className="px-4 py-4 text-sm text-black dark:text-white">{category.category_id}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{category.title}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{category.url_key}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{category.type_category}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">{category.priority}</td>
                    <td className="px-4 py-4 text-sm text-body dark:text-bodydark">
                      <button
                        className="mr-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                        onClick={() => handleView(category.category_id)}
                      >
                        View
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                        onClick={() => handleDelete(category.category_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-body dark:text-bodydark">
                    No categories found.
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

export default CategoriesPage;
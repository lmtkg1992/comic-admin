Guide for Generating List Page for an Entity

Overview

This guide outlines the structure and implementation details required to generate a list page for an entity dynamically. The list page should include fetching data via API, displaying records in a table, supporting pagination, search functionality, and providing actions (edit, delete, view) for each record.

Entity Details

Entity Name: {entity_name}

API Endpoint (GET List): {get_list}

API Response Model:
{
  "data": {
    "list": [
      {
        "id": "uuid",
        "title": "string",
        "is_active": "boolean",
        "status": "string",
        "author": {
          "author_id": "uuid",
          "author_title": "string"
        },
        "publish_date": "string (ISO 8601 UTC)",
        "is_full": "boolean",
        "is_hot": "boolean",
        "total_chapters": "number"
      }
    ],
    "total": "number"
  }
}

Required Features

Fetching data: Retrieve records from {get_list}.

Pagination: Support paginated API calls.

Search: Filter results based on search term.

Actions:

View/Edit (/stories/edit?storyId=<id>)

Delete (Trigger API call, confirm before action)

Formatting:

Convert UTC publish_date to locale format (toLocaleDateString()).

Display is_active, is_full, is_hot as Yes/No.

File Structure

Page Location: src/app/{entity_name}/list/page.tsx

Required Components:

DefaultLayout (layout wrapper)

Pagination (custom component for pagination controls)

fetch{EntityName}List (API utility for data retrieval)

Example Code Structure

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import { fetch{EntityName}List } from "@/utils/api";

const {EntityName}ListPage = () => {
  const [records, setRecords] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const getRecords = async () => {
      try {
        const { list, total } = await fetch{EntityName}List(currentPage, recordsPerPage, searchTerm);
        setRecords(list);
        setTotalPages(Math.ceil(total / recordsPerPage));
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    getRecords();
  }, [currentPage, searchTerm]);

  const handleDelete = (recordId: string) => {
    console.log("Delete record:", recordId);
  };

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{EntityName}</h1>
        
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-3 rounded-md border border-stroke dark:border-strokedark focus:ring-2 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <table className="w-full table-auto mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Active</th>
              <th>Status</th>
              <th>Author</th>
              <th>Publish Date</th>
              <th>Full</th>
              <th>Hot</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((record: any) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.title}</td>
                  <td>{record.is_active ? "Yes" : "No"}</td>
                  <td>{record.status || "N/A"}</td>
                  <td>{record.author?.author_title || "Unknown"}</td>
                  <td>{new Date(record.publish_date).toLocaleDateString()}</td>
                  <td>{record.is_full ? "Yes" : "No"}</td>
                  <td>{record.is_hot ? "Yes" : "No"}</td>
                  <td>
                    <Link href={`/{entity_name}/edit?storyId=${record.id}`}>Edit</Link>
                    <button onClick={() => handleDelete(record.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9}>No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
        
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </DefaultLayout>
  );
};

export default {EntityName}ListPage;

API Utility (api.ts)


export const fetch{EntityName}List = async (page = 1, size = 10, searchTerm = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/{entity_api_path}?page=${page}&size=${size}&search=${searchTerm}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};


Notes

Replace {entity_name} with the actual entity name (e.g., stories).

Replace {get_list} with the actual API endpoint.

Ensure API response matches expected model structure.

Maintain consistency in component styling and structure.
Guide for AI Agent to Code an Edit Page for Entity

Overview

This guide instructs the AI Agent on how to create an Edit Page for an entity in a Next.js project. The page enables users to modify entity details using various form fields, including text inputs, dropdowns, a rich-text editor (Quill.js), a date-time picker, and an image uploader.

Features to Implement

Fetch entity details: Retrieve entity data using an API call when the page loads.

Form fields:

Text input fields for simple properties.

Dropdowns for boolean values and relational data.

A Quill.js rich-text editor for the description field.

DateTime pickers using react-datepicker for publish_date and updated_date.

File upload functionality for images.

Data pre-processing:

Convert stored GMT+0 timestamps to local time (GMT+7).

Handle category selection using react-select.

Submission process:

Validate and format the data before sending it to the API.

Convert publish_date and updated_date to the correct format (yyyy-MM-dd HH:mm:ss).

Extract file_id from the uploaded file response and store it in path_image.

Prevent SSR issues:

Use dynamic imports for react-quill to avoid server-side rendering errors.


Page Structure

1. Import Dependencies

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Select from "react-select";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { fetchEntityDetail, fetchCategories, fetchAuthors, updateEntity, uploadFile } from "@/utils/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });


2. Define State and Fetch Data

const EditEntityPage = () => {
  const searchParams = useSearchParams();
  const entityId = searchParams.get("entityId");
  const [entity, setEntity] = useState(null);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    is_active: "true",
    description: "",
    status: "ongoing",
    is_full: "false",
    is_hot: "false",
    source: "",
    translator: "",
    author_id: "",
    path_image_obj: null,
    publish_date: new Date(),
    updated_date: new Date(),
  });

  useEffect(() => {
    if (!entityId) return;
    const adjustDateForTimezone = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      date.setHours(date.getHours() + 7);
      return date;
    };

    const loadData = async () => {
      try {
        const entityDetail = await fetchEntityDetail(entityId);
        const allCategories = await fetchCategories(1, 100);
        const allAuthors = await fetchAuthors(1, 100);
        setEntity(entityDetail);
        setCategories(allCategories.map((cat) => ({ value: cat.id, label: cat.name })));
        setAuthors(allAuthors);
        setFormData({
          ...formData,
          ...entityDetail,
          author_id: entityDetail?.author?.id || "",
          publish_date: adjustDateForTimezone(entityDetail.publish_date),
          updated_date: adjustDateForTimezone(entityDetail.updated_date),
        });
        setSelectedCategories(entityDetail?.categories?.map((cat) => ({ value: cat.id, label: cat.name })) || []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [entityId]);

3. Handle Input Changes

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

4. Handle Category Selection
const handleCategoryChange = (selectedOptions) => {
  setSelectedCategories(selectedOptions || []);
};

5. Handle File Upload

const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setUploading(true);
  try {
    const response = await uploadFile(file, "entity_cover");
    if (response?.data) {
      const { file_id, path } = response.data;
      setFormData({ ...formData, path_image_obj: { file_id, path } });
      alert("File uploaded successfully!");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("Failed to upload file.");
  } finally {
    setUploading(false);
  }
};

6. Handle Form Submission

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!entityId) return;
  try {
    const categoryIds = selectedCategories.map((category) => category.value);
    const payload = {
      ...formData,
      categories: categoryIds,
      is_active: formData.is_active === "true",
      is_full: formData.is_full === "true",
      is_hot: formData.is_hot === "true",
      publish_date: formData.publish_date.toISOString().replace("T", " ").slice(0, 19),
      updated_date: formData.updated_date.toISOString().replace("T", " ").slice(0, 19),
    };
    if (formData.path_image_obj?.file_id) {
      payload.path_image = formData.path_image_obj.file_id;
    }
    await updateEntity(entityId, payload);
    alert("Entity updated successfully!");
  } catch (error) {
    console.error("Error updating entity:", error);
    alert("Failed to update entity.");
  }
};

7. Rendering the Form

Use <ReactQuill> for the description field.

Use <DatePicker> for publish_date and updated_date.

Render <Select> for categories.

Include an image preview and file upload.

Conclusion

This guide provides a structured approach to building an edit page for any entity with a similar structure. Ensure API endpoints match the entity model and customize the form fields as needed.


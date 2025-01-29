Guide for AI Agent to Code a Create Page for Entity

Overview

This guide instructs the AI Agent on how to create a Create Page for an entity in a Next.js project. The page allows users to input entity details using various form fields, including text inputs, dropdowns, a rich-text editor (Quill.js), and a date-time picker.

Features to Implement

Form Fields:

Text input fields for simple properties.

Dropdowns for boolean values and relational data.

A Quill.js rich-text editor for the description field.

DateTime pickers using react-datepicker for publish_date and updated_date.

Submission Process:

Validate and format the data before sending it to the API.

Convert publish_date and updated_date to the correct format (yyyy-MM-dd HH:mm:ss).

Send a POST request to create a new entity.

Redirect the user to the Edit Page after a successful creation.

Prevent SSR Issues:

Use dynamic imports for react-quill to avoid server-side rendering errors.

Page Structure

1. Import Dependencies

import { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { createEntity } from "@/utils/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useRouter } from "next/navigation";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

2. Define State and Handle Input

const [formData, setFormData] = useState({
  title: "",
  is_active: "true",
  description: "",
  status: "ongoing",
  is_full: "false",
  is_hot: "false",
  source: "",
  translator: "",
  publish_date: new Date(),
  updated_date: new Date(),
});

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

3. Handle Form Submission

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      story_id: "auto",
      increment_id: 1,
      title: formData.title,
      url_key: "auto",
      is_active: formData.is_active === "true",
      path_image: "",
      author: {
          author_id: "auto",
          url_key: "auto",
          author_title: "",
      },
      description: formData.description,
      publish_date: formData.publish_date.toISOString().replace("T", " ").slice(0, 19),
      updated_date: formData.updated_date.toISOString().replace("T", " ").slice(0, 19),
      status: formData.status,
      is_full: formData.is_full === "true",
      is_hot: formData.is_hot === "true",
      total_chapters: 0,
      source: formData.source,
      translator: formData.translator,
      categories: [],
    };

    const entityId = await createEntity(payload);
    alert("Entity created successfully!");
    router.push(`/entities/edit?entityId=${entityId}`);
  } catch (error) {
    console.error("Error creating entity:", error);
    alert("Failed to create entity.");
  }
};

4. Rendering the Form

<DefaultLayout>
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Create Entity</h1>
    <form onSubmit={handleSubmit}>
      <label className="block text-sm font-medium mb-2">Title</label>
      <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-3 rounded-md border" />
      
      <label className="block text-sm font-medium mb-2">Description</label>
      <ReactQuill value={formData.description} onChange={(content) => setFormData({ ...formData, description: content })} theme="snow" />
      
      <label className="block text-sm font-medium mb-2">Publish Date</label>
      <DatePicker selected={formData.publish_date} onChange={(date) => setFormData({ ...formData, publish_date: date })} showTimeSelect dateFormat="yyyy-MM-dd HH:mm:ss" className="w-full p-3 rounded-md border" />
      
      <button type="submit" className="px-6 py-2 bg-primary text-white rounded-md">Create Entity</button>
    </form>
  </div>
</DefaultLayout>
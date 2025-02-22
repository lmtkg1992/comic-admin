"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/utils/api";
const SignIn = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Ví dụ gọi API đăng nhập (bạn có thể thay đổi URL và xử lý token theo nhu cầu)
      const res = await adminLogin(username, password);

      if (res.error === false) {
        // Assuming the API returns a token, save it to localStorage, then redirect
        localStorage.setItem("token", res.token);
        router.push("/stories/list");
      } else {
        setErrorMsg("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMsg("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Sign In
        </h2>

        {errorMsg && (
          <div className="mb-4 text-center text-red-500">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-primary dark:bg-gray-700 dark:text-white"
              placeholder="Enter your username"
              value={username}
              onChange={(e) =>  setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-primary dark:bg-gray-700 dark:text-white"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export", // Ensure it's set to "export" for static builds
    trailingSlash: true,
    images: {
      unoptimized: true, // Ensure images work in static builds
    },
  };
  
  export default nextConfig;
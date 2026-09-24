const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/olympic-english-lab" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isGitHubPages
    ? {
        output: "export",
        trailingSlash: true,
        basePath,
      }
    : {}),
  images: {
    unoptimized: isGitHubPages,
  },
};

export default nextConfig;

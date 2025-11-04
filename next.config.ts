import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure pdf-parse is properly bundled for Vercel serverless functions
  // This prevents Turbopack from bundling it incorrectly
  serverExternalPackages: ["pdf-parse"],

  // Optional: If you want to disable Turbopack in dev mode (use Webpack instead), uncomment:
  // This might help if you continue to have issues with pdf-parse
  // experimental: {
  //   turbo: false,
  // },
};

export default nextConfig;

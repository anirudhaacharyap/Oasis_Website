import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  reactCompiler: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Stay inside this repo. A package-lock.json in a parent folder would otherwise
  // be treated as the workspace root.
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;

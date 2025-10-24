import path from "node:path";
import nextConfig from "./packages/eslint-config/nextj.js";
import reactConfig from "./packages/eslint-config/react-internal.js";
import baseConfig from "./packages/eslint-config/base.js";

/**
 * Smart config switcher: applies based on project path
 */
export default [
  {
    files: ["apps/web/**", "apps/admin/**"],
    ...nextConfig,
  },
  {
    files: ["packages/ui/**", "packages/components/**"],
    ...reactConfig,
  },
  {
    files: ["packages/utils/**", "packages/db/**"],
    ...baseConfig,
  },
];

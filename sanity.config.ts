"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./src/sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "your-project-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "default",
  title: "Havi's Candy Studio",
  projectId,
  dataset,
  basePath: "/studio",
  releases: {
    enabled: false,
  },
  scheduledDrafts: {
    enabled: false,
  },
  apps: {
    canvas: {
      enabled: false,
    },
  },
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});

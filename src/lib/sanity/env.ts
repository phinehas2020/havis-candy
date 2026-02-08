export const sanityEnv = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-02-08",
  token: process.env.SANITY_API_READ_TOKEN,
};

export const hasSanityConfig = Boolean(
  sanityEnv.projectId && sanityEnv.dataset,
);

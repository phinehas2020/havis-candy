import "server-only";

import { createClient } from "next-sanity";

import { sanityEnv } from "@/lib/sanity/env";

const writeToken = process.env.SANITY_API_WRITE_TOKEN;

export const sanityWriteClient =
  sanityEnv.projectId && sanityEnv.dataset && writeToken
    ? createClient({
        projectId: sanityEnv.projectId,
        dataset: sanityEnv.dataset,
        apiVersion: sanityEnv.apiVersion,
        useCdn: false,
        token: writeToken,
      })
    : null;

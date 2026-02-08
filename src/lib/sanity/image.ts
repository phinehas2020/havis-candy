import imageUrlBuilder from "@sanity/image-url";

import { sanityClient } from "@/lib/sanity/client";

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function getSanityImageUrl(source: unknown) {
  if (!builder || !source) {
    return undefined;
  }

  return builder.image(source as never).auto("format").fit("max").width(1200).url();
}

import "server-only";

import { cache } from "react";

import {
  fallbackLocations,
  fallbackProducts,
  fallbackSiteSettings,
  fallbackTestimonials,
} from "@/lib/data/fallback";
import { sanityClient } from "@/lib/sanity/client";
import { getSanityImageUrl } from "@/lib/sanity/image";
import {
  locationsQuery,
  productsQuery,
  siteSettingsQuery,
  testimonialsQuery,
} from "@/lib/sanity/queries";
import type { Product, SiteSettings, StoreLocation, Testimonial } from "@/lib/types";

type SanityProduct = {
  _id: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  longDescription?: string;
  price?: number;
  inStock?: boolean;
  availableForPurchase?: boolean;
  featured?: boolean;
  badge?: string;
  stripePriceId?: string;
  stripeProductId?: string;
  image?: unknown;
};

type SanityLocation = {
  _id: string;
  name?: string;
  streetAddress?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  mapUrl?: string;
};

type SanityTestimonial = {
  _id: string;
  quote?: string;
  author?: string;
};

function mapSanityProduct(item: SanityProduct): Product {
  return {
    id: item._id,
    title: item.title ?? "Untitled caramel",
    slug: item.slug ?? item._id,
    price: typeof item.price === "number" ? item.price : 0,
    shortDescription:
      item.shortDescription ?? "Handmade hard caramel with all-natural ingredients.",
    longDescription:
      item.longDescription ??
      "A small-batch caramel handcrafted in Waco, Texas with old-fashioned care.",
    imageUrl:
      getSanityImageUrl(item.image) ??
      "https://static.wixstatic.com/media/fae32a_8c7f319c015b48cbaa15f2059aa3fbe7~mv2.jpg/v1/fill/w_720,h_960,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/fae32a_8c7f319c015b48cbaa15f2059aa3fbe7~mv2.jpg",
    inStock: Boolean(item.inStock),
    availableForPurchase: item.availableForPurchase !== false,
    featured: Boolean(item.featured),
    badge: item.badge,
    stripePriceId: item.stripePriceId,
    stripeProductId: item.stripeProductId,
  };
}

function mapSanityLocation(item: SanityLocation): StoreLocation {
  return {
    id: item._id,
    name: item.name ?? "Retail Partner",
    streetAddress: item.streetAddress ?? "Waco",
    city: item.city ?? "Waco",
    region: item.region ?? "TX",
    postalCode: item.postalCode ?? "76705",
    mapUrl: item.mapUrl ?? "https://www.google.com/maps?q=Waco,+TX",
  };
}

function mapSanityTestimonial(item: SanityTestimonial): Testimonial {
  return {
    id: item._id,
    quote: item.quote ?? "Customers love these handmade caramels.",
    author: item.author ?? "Havi's Candy Customer",
  };
}

export const getProducts = cache(async (): Promise<Product[]> => {
  if (!sanityClient) {
    return fallbackProducts;
  }

  try {
    const products = await sanityClient.fetch<SanityProduct[]>(productsQuery);

    if (!products?.length) {
      return fallbackProducts;
    }

    return products.map(mapSanityProduct);
  } catch {
    return fallbackProducts;
  }
});

export const getLocations = cache(async (): Promise<StoreLocation[]> => {
  if (!sanityClient) {
    return fallbackLocations;
  }

  try {
    const locations = await sanityClient.fetch<SanityLocation[]>(locationsQuery);

    if (!locations?.length) {
      return fallbackLocations;
    }

    return locations.map(mapSanityLocation);
  } catch {
    return fallbackLocations;
  }
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  if (!sanityClient) {
    return fallbackTestimonials;
  }

  try {
    const testimonials = await sanityClient.fetch<SanityTestimonial[]>(
      testimonialsQuery,
    );

    if (!testimonials?.length) {
      return fallbackTestimonials;
    }

    return testimonials.map(mapSanityTestimonial);
  } catch {
    return fallbackTestimonials;
  }
});

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!sanityClient) {
    return fallbackSiteSettings;
  }

  try {
    const settings = await sanityClient.fetch<Partial<SiteSettings> | null>(
      siteSettingsQuery,
    );

    if (!settings) {
      return fallbackSiteSettings;
    }

    return {
      ...fallbackSiteSettings,
      ...settings,
    };
  } catch {
    return fallbackSiteSettings;
  }
});

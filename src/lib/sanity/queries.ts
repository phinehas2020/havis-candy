import { groq } from "next-sanity";

export const productsQuery = groq`
  *[_type == "product"] | order(featured desc, title asc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    longDescription,
    price,
    inStock,
    featured,
    badge,
    stripePriceId,
    stripeProductId,
    image
  }
`;

export const locationsQuery = groq`
  *[_type == "location"] | order(featured desc, name asc) {
    _id,
    name,
    streetAddress,
    city,
    region,
    postalCode,
    mapUrl
  }
`;

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    quote,
    author
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    businessName,
    heroEyebrow,
    heroHeading,
    heroSubheading,
    storyHeading,
    storyBody,
    philosophyBody,
    contactEmail,
    contactPhone,
    mailingAddress,
    kitchenAddress
  }
`;

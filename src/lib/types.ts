export type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  inStock: boolean;
  availableForPurchase?: boolean;
  featured?: boolean;
  badge?: string;
  stripePriceId?: string;
  stripeProductId?: string;
};

export type StoreLocation = {
  id: string;
  name: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  mapUrl: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
};

export type SiteSettings = {
  businessName: string;
  heroEyebrow: string;
  heroHeading: string;
  heroSubheading: string;
  storyHeading: string;
  storyBody: string;
  storyImageUrl?: string;
  philosophyBody: string;
  contactEmail: string;
  contactPhone: string;
  mailingAddress: string;
  kitchenAddress: string;
};

export type AboutUs = {
  body: string;
};

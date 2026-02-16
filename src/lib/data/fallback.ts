import type { Product, SiteSettings, StoreLocation, Testimonial } from "@/lib/types";

export const fallbackProducts: Product[] = [
  {
    id: "sorghum",
    title: "Havi's Sorghum Caramels",
    slug: "havis-sorghum-caramels",
    price: 7.95,
    shortDescription:
      "The signature flavor made with homegrown sorghum syrup from Central Texas.",
    longDescription:
      "Indulge in rich artisan sweetness that blends old-fashioned hard caramel tradition with sorghum's deep, unmistakable flavor.",
    imageUrl:
      "https://static.wixstatic.com/media/fae32a_8c7f319c015b48cbaa15f2059aa3fbe7~mv2.jpg/v1/fill/w_720,h_960,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/fae32a_8c7f319c015b48cbaa15f2059aa3fbe7~mv2.jpg",
    inStock: true,
    availableForPurchase: true,
    featured: true,
    badge: "Signature",
  },
  {
    id: "chai",
    title: "Havi's Chai Caramels",
    slug: "havis-chai-caramels",
    price: 7.95,
    shortDescription:
      "Warm chai spice notes folded into handcrafted hard caramel for a bold finish.",
    longDescription:
      "A comforting blend of aromatic chai spices and smooth caramel, hand-poured and hand-wrapped with precision.",
    imageUrl:
      "https://static.wixstatic.com/media/fae32a_a617cf9dced04eb7b233fc04b5686be0~mv2.jpg/v1/fill/w_720,h_960,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/fae32a_a617cf9dced04eb7b233fc04b5686be0~mv2.jpg",
    inStock: true,
    availableForPurchase: true,
    featured: true,
  },
  {
    id: "coffee",
    title: "Havi's Coffee Caramels",
    slug: "havis-coffee-caramels",
    price: 7.95,
    shortDescription:
      "Roasted coffee character paired with buttery caramel depth.",
    longDescription:
      "A robust caramel for coffee lovers, balancing sweetness with roasty complexity in each handcrafted piece.",
    imageUrl:
      "https://static.wixstatic.com/media/fae32a_119becc1800e469b9e90d8c2f5c03dbd~mv2.jpg/v1/fill/w_720,h_960,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/fae32a_119becc1800e469b9e90d8c2f5c03dbd~mv2.jpg",
    inStock: true,
    availableForPurchase: true,
    featured: true,
  },
  {
    id: "peppermint",
    title: "Havi's Peppermint Caramels",
    slug: "havis-peppermint-caramels",
    price: 7.95,
    shortDescription:
      "A refreshing seasonal twist on classic caramel.",
    longDescription:
      "Peppermint brightness meets the slow-crafted richness of hard caramel for a festive, nostalgic flavor.",
    imageUrl:
      "https://static.wixstatic.com/media/fae32a_beb0933ab6734b38b53c760e99c5316b~mv2.jpg/v1/fill/w_720,h_960,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/fae32a_beb0933ab6734b38b53c760e99c5316b~mv2.jpg",
    inStock: false,
    availableForPurchase: true,
    badge: "Seasonal",
  },
];

export const fallbackLocations: StoreLocation[] = [
  {
    id: "homestead-weekly-market",
    name: "Homestead Weekly Market",
    streetAddress: "167 Halbert Ln",
    city: "Waco",
    region: "TX",
    postalCode: "76705",
    mapUrl:
      "https://maps.apple.com/?address=167%20Halbert%20Ln,%20Waco,%20TX%20%2076705,%20United%20States&auid=10207572279643702141&ll=31.669584,-97.144901&lsp=9902&q=Homestead%20General%20Store&t=h",
  },
  {
    id: "brazos-valley-cheese",
    name: "Brazos Valley Cheese",
    streetAddress: "206 Halbert Ln",
    city: "Waco",
    region: "TX",
    postalCode: "76705",
    mapUrl:
      "https://maps.apple.com/?address=206%20Halbert%20Ln,%20Waco,%20TX%20%2076705,%20United%20States&auid=12886420290618432646&ll=31.670202,-97.147583&lsp=9902&q=Brazos%20Valley%20Cheese&t=h",
  },
  {
    id: "homestead-gristmill",
    name: "Homestead Gristmill",
    streetAddress: "800 Dry Creek Rd",
    city: "Waco",
    region: "TX",
    postalCode: "76705",
    mapUrl:
      "https://maps.apple.com/?address=800%20Dry%20Creek%20Rd,%20Waco,%20TX%20%2076705,%20United%20States&auid=13174332300600126003&ll=31.667114,-97.153466&lsp=9902&q=Homestead%20Gristmill&t=h",
  },
];

export const fallbackTestimonials: Testimonial[] = [
  {
    id: "nancy-d",
    quote:
      "My first taste of Havi's caramels came on a girls trip to Waco. They were amazing and I immediately wished I had bought a bigger bag.",
    author: "Nancy D.",
  },
];

export const fallbackSiteSettings: SiteSettings = {
  businessName: "Havi's Candy Co.",
  heroEyebrow: "Handmade in Waco, Texas",
  heroHeading: "Uniquely flavored, handmade hard caramels.",
  heroSubheading:
    "Small-batch sweets made from scratch with all-natural ingredients and old-fashioned care.",
  storyHeading: "About Havi & Her Journey",
  storyBody:
    "Ahavah “Havi” discovered her love for making sweet treats at just five years old. What began as a childhood hobby grew into a business rooted in craft, tradition, and hospitality.",
  philosophyBody:
    "Every batch is hand-poured and hand-wrapped. Sorghum from the family farm in Central Texas gives Havi's signature caramel its distinctive flavor.",
  contactEmail: "info@haviscandyco.com",
  contactPhone: "254-229-0688",
  mailingAddress: "1400B Dry Creek Rd, Waco, TX 76705",
  kitchenAddress: "7737 Gholson Rd, Waco, TX 76705",
};

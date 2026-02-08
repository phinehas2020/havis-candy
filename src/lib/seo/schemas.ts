import { siteConfig } from "@/lib/site";
import type { Product, StoreLocation } from "@/lib/types";

export function buildLocalBusinessSchema(locations: StoreLocation[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.domain,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    areaServed: ["Waco", "Central Texas"],
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      postalCode: siteConfig.location.postalCode,
      addressCountry: siteConfig.location.country,
    },
    sameAs: [siteConfig.social.facebook],
    makesOffer: locations.map((location) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: "Handmade hard caramel candy",
      },
      availableAtOrFrom: {
        "@type": "Place",
        name: location.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: location.streetAddress,
          addressLocality: location.city,
          addressRegion: location.region,
          postalCode: location.postalCode,
          addressCountry: "US",
        },
      },
    })),
  };
}

export function buildProductsSchema(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.title,
        description: product.shortDescription,
        image: product.imageUrl,
        url: `${siteConfig.domain}/products#${product.slug}`,
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: product.price.toFixed(2),
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
      },
    })),
  };
}

export function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Where is Havi's Candy Co. made?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Havi's candy is handcrafted in Waco, Texas using small-batch methods and all-natural ingredients.",
        },
      },
      {
        "@type": "Question",
        name: "What candy flavors are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Current flavors include sorghum, chai, coffee, and peppermint hard caramels, with availability changing by batch.",
        },
      },
      {
        "@type": "Question",
        name: "Where can I buy Havi's Candy in Waco?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can find Havi's Candy at Homestead Weekly Market, Brazos Valley Cheese, and Homestead Gristmill in the Waco area.",
        },
      },
    ],
  };
}

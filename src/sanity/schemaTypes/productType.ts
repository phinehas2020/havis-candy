import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "longDescription",
      title: "Long Description",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Feature on Homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      options: {
        list: ["Signature", "Seasonal", "Best Seller", "New"],
      },
    }),
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "stripePriceId",
      title: "Stripe Price ID",
      type: "string",
      description:
        "Price ID from Stripe, for example: price_123. Required for checkout.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "badge",
      media: "image",
    },
  },
});

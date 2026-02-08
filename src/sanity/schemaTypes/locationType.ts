import { defineField, defineType } from "sanity";

export const locationType = defineType({
  name: "location",
  title: "Retail Location",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "streetAddress",
      title: "Street Address",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      initialValue: "Waco",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "region",
      title: "State",
      type: "string",
      initialValue: "TX",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "postalCode",
      title: "Postal Code",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mapUrl",
      title: "Map URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "streetAddress",
    },
  },
});

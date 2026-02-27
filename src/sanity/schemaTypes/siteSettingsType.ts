import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "businessName",
      title: "Business Name",
      type: "string",
      initialValue: "Havi's Candy Co.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      initialValue: "Handmade in Waco, Texas",
    }),
    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubheading",
      title: "Hero Subheading",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "storyHeading",
      title: "Story Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "storyBody",
      title: "Story Body",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "storyImage",
      title: "Story Image (e.g. photo of Havi)",
      type: "image",
      description: "A personal photo for the Our Story section",
    }),
    defineField({
      name: "wifePhoto",
      title: "Wife or Family Photo",
      type: "image",
      description: "Optional photo for the Our Story sidebar card",
    }),
    defineField({
      name: "philosophyBody",
      title: "Philosophy Body",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mailingAddress",
      title: "Mailing Address",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kitchenAddress",
      title: "Kitchen Address",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "businessName",
      subtitle: "heroHeading",
    },
  },
});

import { defineField, defineType } from "sanity";

export const aboutUsType = defineType({
  name: "aboutUs",
  title: "About Us",
  type: "document",
  fields: [
    defineField({
      name: "body",
      title: "About Us Text",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      subtitle: "body",
    },
    prepare({ subtitle }) {
      return {
        title: "About Us",
        subtitle,
      };
    },
  },
});

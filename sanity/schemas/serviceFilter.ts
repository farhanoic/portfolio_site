import { defineField, defineType } from 'sanity'

export const serviceFilter = defineType({
  name: 'serviceFilter',
  title: 'Service Filter',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Filter Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'serviceCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      categoryName: 'category.name',
    },
    prepare({ title, categoryName }) {
      return {
        title,
        subtitle: `Category: ${categoryName}`,
      }
    },
  },
})
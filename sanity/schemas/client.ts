import { defineField, defineType } from 'sanity'

export const client = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Client Name',
      type: 'string',
      description: 'Name of the client or company',
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
      name: 'logo',
      title: 'Client Logo',
      type: 'image',
      description: 'Logo of the client or company',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      description: 'Client website URL (optional)',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the client or company (optional)',
      rows: 3,
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
      description: 'Industry or sector the client operates in',
      options: {
        list: [
          { title: 'Technology', value: 'technology' },
          { title: 'Healthcare', value: 'healthcare' },
          { title: 'Finance', value: 'finance' },
          { title: 'Education', value: 'education' },
          { title: 'Entertainment', value: 'entertainment' },
          { title: 'Fashion', value: 'fashion' },
          { title: 'Food & Beverage', value: 'food-beverage' },
          { title: 'Real Estate', value: 'real-estate' },
          { title: 'Travel & Tourism', value: 'travel-tourism' },
          { title: 'Sports & Fitness', value: 'sports-fitness' },
          { title: 'Non-Profit', value: 'non-profit' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
  ],
  orderings: [
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }]
    },
    {
      title: 'Recently Added',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }]
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
      industry: 'industry',
    },
    prepare({ title, media, industry }) {
      return {
        title,
        subtitle: industry ? `${industry.charAt(0).toUpperCase() + industry.slice(1).replace('-', ' ')}` : 'Client',
        media,
      }
    },
  },
})
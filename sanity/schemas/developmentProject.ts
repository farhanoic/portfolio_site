import { defineField, defineType } from 'sanity'

export const developmentProject = defineType({
  name: 'developmentProject',
  title: 'Development Project',
  type: 'document',
  fields: [
    defineField({
      name: 'projectName',
      title: 'Project Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'projectName',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Project Description',
      type: 'text',
      description: 'Detailed description of the development project',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Project Thumbnail',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      description: 'Name of the client or company this project was developed for',
    }),
    defineField({
      name: 'clientLogo',
      title: 'Client Logo',
      type: 'image',
      description: 'Logo of the client or company',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'techStack',
      title: 'Tech Stack',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Technologies, frameworks, and tools used in this project',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'githubLink',
      title: 'GitHub Link (Optional)',
      type: 'url',
      description: 'Link to GitHub repository or source code',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }),
    }),
    defineField({
      name: 'siteLink',
      title: 'Live Site Link (Optional)',
      type: 'url',
      description: 'Link to live website or deployed application',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      description: 'Mark as featured to highlight in portfolio',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order for display (lower numbers appear first)',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }]
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: '_createdAt', direction: 'desc' }
      ]
    },
    {
      title: 'Custom Order',
      name: 'customOrder',
      by: [
        { field: 'order', direction: 'asc' },
        { field: '_createdAt', direction: 'desc' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'projectName',
      media: 'thumbnail',
      client: 'clientName',
      featured: 'featured',
    },
    prepare({ title, media, client, featured }) {
      const subtitle = [
        client,
        featured && '⭐ Featured'
      ].filter(Boolean).join(' • ');

      return {
        title,
        subtitle: subtitle || 'Development Project',
        media,
      }
    },
  },
})
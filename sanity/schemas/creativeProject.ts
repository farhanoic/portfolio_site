import { defineField, defineType } from 'sanity'

export const creativeProject = defineType({
  name: 'creativeProject',
  title: 'Creative Project',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Project Name',
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
      name: 'thumbnail',
      title: 'Project Thumbnail',
      type: 'image',
      description: 'Upload landscape (16:9) for Landscape projects or vertical (9:16) for Reels',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'reference',
      to: [{ type: 'client' }],
      description: 'Select the client this project was created for',
    }),
    // Legacy fields for backward compatibility
    defineField({
      name: 'clientName',
      title: 'Client Name (Legacy)',
      type: 'string',
      description: 'Legacy field - use Client reference instead',
      hidden: true,
    }),
    defineField({
      name: 'clientLogo',
      title: 'Client Logo (Legacy)',
      type: 'image',
      description: 'Legacy field - use Client reference instead',
      options: {
        hotspot: true,
      },
      hidden: true,
    }),
    defineField({
      name: 'kind',
      title: 'Content Kind',
      type: 'string',
      description: 'Type of creative content',
      options: {
        list: [
          { title: 'Reels (Vertical)', value: 'Reels' },
          { title: 'Landscape (Horizontal)', value: 'Landscape' }
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'Landscape',
    }),
    defineField({
      name: 'durationType',
      title: 'Duration Type',
      type: 'string',
      description: 'Content duration category',
      options: {
        list: [
          { title: 'Short Form (< 60s)', value: 'Short Form' },
          { title: 'Long Form (> 60s)', value: 'Long Form' }
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'Short Form',
    }),
    defineField({
      name: 'videoLink',
      title: 'Video Link',
      type: 'url',
      description: 'Link to the video (YouTube, Vimeo, etc.)',
      validation: (Rule) => Rule.required().uri({
        scheme: ['http', 'https']
      }),
    }),
    defineField({
      name: 'softwareTools',
      title: 'Software/Tools Used',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Software and tools used for this creative project',
      options: {
        layout: 'tags',
      },
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
      title: 'By Kind',
      name: 'byKind',
      by: [
        { field: 'kind', direction: 'asc' },
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
      title: 'name',
      media: 'thumbnail',
      clientName: 'client.name',
      legacyClientName: 'clientName',
      kind: 'kind',
      durationType: 'durationType',
      featured: 'featured',
    },
    prepare({ title, media, clientName, legacyClientName, kind, durationType, featured }) {
      const client = clientName || legacyClientName;
      const subtitle = [
        kind,
        durationType,
        client,
        featured && '⭐ Featured'
      ].filter(Boolean).join(' • ');

      return {
        title,
        subtitle,
        media,
      }
    },
  },
})
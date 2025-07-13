import { defineField, defineType } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Service Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'demoVideo',
      title: 'Demo Video URL (Legacy)',
      type: 'url',
      description: 'Legacy field - Please use Demo Videos below instead',
      hidden: true,
    }),
    defineField({
      name: 'videoThumbnail',
      title: 'Custom Video Thumbnail (Legacy)',
      type: 'image',
      description: 'Legacy field - Please use Demo Videos below instead',
      hidden: true,
    }),
    defineField({
      name: 'demoVideos',
      title: 'Demo Videos',
      type: 'array',
      description: 'Add multiple demo videos to showcase your work',
      of: [
        {
          type: 'object',
          name: 'demoVideo',
          title: 'Demo Video',
          fields: [
            {
              name: 'url',
              title: 'Video URL',
              type: 'url',
              description: 'YouTube (including Shorts), Vimeo URL to showcase your work (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://www.youtube.com/shorts/VIDEO_ID)',
              validation: (Rule: any) => Rule.required().uri({
                scheme: ['http', 'https']
              }),
            },
            {
              name: 'title',
              title: 'Video Title',
              type: 'string',
              description: 'Optional title for this video',
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'url',
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Demo Video',
                subtitle: subtitle,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Price Range',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
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
      name: 'filter',
      title: 'Filter',
      type: 'reference',
      to: [{ type: 'serviceFilter' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'price',
      media: 'thumbnail',
      categoryName: 'category.name',
    },
    prepare({ title, subtitle, media, categoryName }) {
      return {
        title,
        subtitle: `${subtitle} - ${categoryName}`,
        media,
      }
    },
  },
})
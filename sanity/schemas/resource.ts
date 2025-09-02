import { defineField, defineType } from 'sanity'

export const resource = defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Resource Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of this resource and how you use it',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'url',
      title: 'Resource URL',
      type: 'url',
      description: 'Link to the resource website',
      validation: (Rule) => Rule.required().uri({
        scheme: ['http', 'https']
      }),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Emoji (e.g., 💻) or external logo URL (e.g., https://logo.url/image.png)',
      validation: (Rule) => Rule.required(),
      placeholder: '💻 or https://example.com/logo.png'
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'resourceCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tags for filtering and categorization (e.g., "editor", "AI", "free")',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured Resource',
      type: 'boolean',
      description: 'Mark as featured to highlight in the resources list',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order within category (lower numbers appear first)',
      initialValue: 0,
    }),
    defineField({
      name: 'blogPosts',
      title: 'Related Blog Posts',
      type: 'array',
      description: 'Your blog posts related to this resource',
      of: [
        {
          type: 'object',
          title: 'Blog Post',
          fields: [
            {
              name: 'title',
              title: 'Post Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'Post URL',
              type: 'url',
              description: 'Link to your blog post',
              validation: (Rule) => Rule.required().uri({
                scheme: ['http', 'https']
              }),
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'url'
            }
          }
        }
      ]
    }),
    defineField({
      name: 'useCases',
      title: 'Use Cases',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Specific use cases for this tool (e.g., "Video Editing", "Web Development", "Frontend")',
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'toolType',
      title: 'Tool Type',
      type: 'string',
      description: 'Type of tool (e.g., "Design Tool", "Framework", "CMS", "AI Assistant")',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Code Editor', value: 'Code Editor' },
          { title: 'Design Tool', value: 'Design Tool' },
          { title: 'Framework', value: 'Framework' },
          { title: 'Library', value: 'Library' },
          { title: 'AI Assistant', value: 'AI Assistant' },
          { title: 'CMS', value: 'CMS' },
          { title: 'Database', value: 'Database' },
          { title: 'Hosting Platform', value: 'Hosting Platform' },
          { title: 'Development Tool', value: 'Development Tool' },
          { title: 'Analytics Tool', value: 'Analytics Tool' },
          { title: 'Productivity Tool', value: 'Productivity Tool' },
          { title: 'Learning Platform', value: 'Learning Platform' },
          { title: 'Communication Tool', value: 'Communication Tool' },
          { title: 'Version Control', value: 'Version Control' },
          { title: 'Testing Tool', value: 'Testing Tool' },
          { title: 'Monitoring Tool', value: 'Monitoring Tool' },
        ],
        layout: 'dropdown'
      }
    }),
  ],
  orderings: [
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'order', direction: 'asc' },
        { field: 'title', direction: 'asc' }
      ]
    },
    {
      title: 'Category & Order',
      name: 'categoryOrder',
      by: [
        { field: 'category.name', direction: 'asc' },
        { field: 'order', direction: 'asc' },
        { field: 'title', direction: 'asc' }
      ]
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      icon: 'icon',
      categoryName: 'category.name',
      featured: 'featured',
      url: 'url'
    },
    prepare({ title, subtitle, icon, categoryName, featured, url }) {
      const domain = url ? new URL(url).hostname.replace('www.', '') : '';
      
      return {
        title: `${icon} ${title}`,
        subtitle: [
          categoryName,
          featured && '⭐ Featured',
          domain,
          subtitle?.slice(0, 50) + (subtitle?.length > 50 ? '...' : '')
        ].filter(Boolean).join(' • '),
      }
    },
  },
})
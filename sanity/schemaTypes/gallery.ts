import {defineType, defineField} from 'sanity'

export const gallery = defineType({
  name: 'gallery',
  title: 'Galerie',
  type: 'document',
  fields: [
    defineField({
      name: 'images',
      title: 'Bilder',
      type: 'array',
      of: [{type: 'image'}]
    })
  ]
})

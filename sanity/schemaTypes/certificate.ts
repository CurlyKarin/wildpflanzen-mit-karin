import {defineType, defineField} from 'sanity'

export const certificate = defineType({
  name: 'certificate',
  title: 'Zertifikat',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: {hotspot: true},
      validation: Rule => Rule.required()
    })
  ]
})

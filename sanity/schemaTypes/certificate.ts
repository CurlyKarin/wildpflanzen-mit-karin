import {defineType, defineField} from 'sanity'

export const certificate = defineType({
  name: 'certificate',
  title: 'Zertifikat',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string'
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung',
      type: 'text'
    }),
    defineField({
      name: 'link',
      title: 'Link zum Zertifikat',
      type: 'url'
    })
  ]
})

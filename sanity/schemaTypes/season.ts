import {defineType, defineField} from 'sanity'

export const season = defineType({
  name: 'season',
  title: 'Aktuelle Jahreszeit',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Überschrift',
      type: 'string'
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text'
    }),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: {hotspot: true}
    })
  ]
})

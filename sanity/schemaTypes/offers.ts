import {defineType, defineField} from 'sanity'

export const offers = defineType({
  name: 'offers',
  title: 'Angebote',
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
      name: 'targetGroup',
      title: 'Zielgruppe',
      type: 'string'
    }),
    defineField({
      name: 'location',
      title: 'Ort',
      type: 'string'
    }),
    defineField({
      name: 'note',
      title: 'Hinweis',
      type: 'string'
    })
  ]
})

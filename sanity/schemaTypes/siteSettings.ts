import {defineType, defineField} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Seiteneinstellungen',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Seitentitel',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Kurzbeschreibung',
      type: 'text'
    }),
    defineField({
      name: 'email',
      title: 'Kontakt E-Mail',
      type: 'string'
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string'
    })
  ]
})


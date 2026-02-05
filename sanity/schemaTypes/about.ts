import {defineType, defineField} from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'Über mich',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text'
    }),
    defineField({
      name: 'portrait',
      title: 'Portraitfoto',
      type: 'image',
      options: {hotspot: true}
    }),
    defineField({
      name: 'photographerLink',
      title: 'Link zur Fotografin',
      type: 'url'
    }),
    defineField({
      name: 'photographerLinkText',
      title: 'Text für Fotografin-Link',
      type: 'string',
      description: 'z.B. "Foto: zur Fotografin" oder "Foto: Name der Fotografin"',
      initialValue: 'Foto: zur Fotografin'
    })
  ]
})

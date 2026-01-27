import {defineType, defineField} from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero-Bereich',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Überschrift',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'subheadline',
      title: 'Unterüberschrift',
      type: 'text'
    }),
    defineField({
      name: 'image',
      title: 'Hintergrundbild',
      type: 'image',
      options: {hotspot: true}
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Text',
      type: 'string'
    })
  ]
})

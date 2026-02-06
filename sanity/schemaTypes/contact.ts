import {defineType, defineField} from 'sanity'

export const contact = defineType({
  name: 'contact',
  title: 'Kontakt',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      description: 'Beschreibungstext für den Kontakt-Bereich'
    })
  ]
})

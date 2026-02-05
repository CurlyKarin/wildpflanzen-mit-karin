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
      type: 'string',
      validation: Rule => Rule.email()
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string'
    }),
    defineField({
      name: 'name',
      title: 'Name / Inhaber',
      type: 'string',
      description: 'Für Impressum'
    }),
    defineField({
      name: 'street',
      title: 'Straße und Hausnummer',
      type: 'string',
      description: 'Für Impressum'
    }),
    defineField({
      name: 'postalCode',
      title: 'Postleitzahl',
      type: 'string',
      description: 'Für Impressum'
    }),
    defineField({
      name: 'city',
      title: 'Ort',
      type: 'string',
      description: 'Für Impressum'
    }),
    defineField({
      name: 'navigationItems',
      title: 'Navigation',
      type: 'array',
      description: 'Menüpunkte für die Hauptnavigation',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Text',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'string',
              description: 'Hash-Link zur Sektion (z.B. #about, #certificate, #contact). Auf Unterseiten wird automatisch index.html vorangestellt.',
              validation: Rule => Rule.required()
            })
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href'
            }
          }
        }
      ]
    })
  ]
})


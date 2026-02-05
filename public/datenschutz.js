const PROJECT_ID = 'dn70plfk'
const DATASET = 'production'
const API_VERSION = '2023-10-01'

const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`
const IMAGE_BASE_URL = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}`

async function fetchSanity(query) {
  const url = `${BASE_URL}?query=${encodeURIComponent(query)}`
  const response = await fetch(url)
  const data = await response.json()
  return data.result
}

function getImageUrl(imageField) {
  if (!imageField?.asset?._ref) return null
  const ref = imageField.asset._ref
  const parts = ref.split('-')
  if (parts.length !== 4 || parts[0] !== 'image') return null
  const id = parts[1]
  const dimensions = parts[2]
  const format = parts[3]
  const fileName = `${id}-${dimensions}.${format}`
  return `${IMAGE_BASE_URL}/${fileName}`
}

// Load hero image
async function loadHero() {
  const hero = await fetchSanity(`*[_type == "hero"][0]`)
  if (!hero) return

  const heroImageUrl = getImageUrl(hero.image)

  document.getElementById('hero').innerHTML = `
    ${heroImageUrl ? `<div class="hero-image" style="background-image: url('${heroImageUrl}')"></div>` : ''}
    <h1>${hero.headline}</h1>
    <p>${hero.subheadline || ''}</p>
  `
}

// Load datenschutz data from siteSettings
async function loadDatenschutz() {
  const settings = await fetchSanity(`*[_type == "siteSettings"][0]`)
  if (!settings) return

  // Update name
  const nameEl = document.getElementById('datenschutz-name')
  if (nameEl && settings.name) {
    nameEl.textContent = settings.name
  } else if (nameEl) {
    nameEl.textContent = 'Karin'
  }

  // Update street
  const streetEl = document.getElementById('datenschutz-street')
  if (streetEl && settings.street) {
    streetEl.textContent = settings.street
  } else if (streetEl) {
    streetEl.textContent = ''
  }

  // Update postal code and city
  const postalCityEl = document.getElementById('datenschutz-postal-city')
  if (postalCityEl) {
    const parts = []
    if (settings.postalCode) parts.push(settings.postalCode)
    if (settings.city) parts.push(settings.city)
    postalCityEl.textContent = parts.join(' ') || ''
  }

  // Update email
  const emailEl = document.getElementById('datenschutz-email')
  if (emailEl && settings.email) {
    emailEl.textContent = settings.email
    emailEl.href = `mailto:${settings.email}`
  } else if (emailEl) {
    emailEl.textContent = 'E-Mail nicht verfügbar'
    emailEl.href = '#'
  }
}

loadHero()
loadDatenschutz()

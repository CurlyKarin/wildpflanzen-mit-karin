const PROJECT_ID = 'dn70plfk'
const DATASET = 'production'
const API_VERSION = '2023-10-01'

const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`

async function fetchSanity(query) {
  const url = `${BASE_URL}?query=${encodeURIComponent(query)}`
  const response = await fetch(url)
  const data = await response.json()
  return data.result
}

// Load impressum data from siteSettings
async function loadImpressum() {
  const settings = await fetchSanity(`*[_type == "siteSettings"][0]`)
  if (!settings) return

  // Update name
  const nameEl = document.getElementById('impressum-name')
  if (nameEl && settings.name) {
    nameEl.textContent = settings.name
  } else if (nameEl) {
    nameEl.textContent = 'Karin'
  }

  // Update street
  const streetEl = document.getElementById('impressum-street')
  if (streetEl && settings.street) {
    streetEl.textContent = settings.street
  } else if (streetEl) {
    streetEl.textContent = ''
  }

  // Update postal code and city
  const postalCityEl = document.getElementById('impressum-postal-city')
  if (postalCityEl) {
    const parts = []
    if (settings.postalCode) parts.push(settings.postalCode)
    if (settings.city) parts.push(settings.city)
    postalCityEl.textContent = parts.join(' ') || ''
  }

  // Update email
  const emailEl = document.getElementById('impressum-email')
  if (emailEl && settings.email) {
    emailEl.textContent = settings.email
    emailEl.href = `mailto:${settings.email}`
  } else if (emailEl) {
    emailEl.textContent = 'E-Mail nicht verfügbar'
    emailEl.href = '#'
  }
}

loadImpressum()

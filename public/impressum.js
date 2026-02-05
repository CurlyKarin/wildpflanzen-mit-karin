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

// NAVIGATION
async function loadNavigation() {
  const settings = await fetchSanity(`*[_type == "siteSettings"][0]`)
  if (!settings) return

  // Logo-Text aus siteTitle laden
  const logoEl = document.querySelector('.nav-logo')
  if (logoEl && settings.siteTitle) {
    logoEl.textContent = settings.siteTitle
  }

  // Menüpunkte aus navigationItems laden
  const navMenu = document.querySelector('.nav-menu')
  if (navMenu && settings.navigationItems && settings.navigationItems.length > 0) {
    // Erkenne aktuelle Seite: Wenn nicht index.html, dann index.html voranstellen
    const currentPage = window.location.pathname.split('/').pop() || 'index.html'
    const isSubPage = currentPage !== 'index.html' && currentPage !== ''
    
    const menuItems = settings.navigationItems.map(item => {
      // Wenn href mit # beginnt und wir auf einer Sub-Seite sind, index.html voranstellen
      let href = item.href
      if (isSubPage && href.startsWith('#')) {
        href = `index.html${href}`
      }
      return `<li><a href="${href}">${item.label}</a></li>`
    }).join('')
    navMenu.innerHTML = menuItems
    
    // Event-Listener für Menü-Schließen neu setzen (da Menü neu gerendert wurde)
    const navLinks = navMenu.querySelectorAll('a')
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const navMenuEl = document.querySelector('.nav-menu')
        const navToggleEl = document.querySelector('.nav-toggle')
        if (navMenuEl) navMenuEl.classList.remove('nav-menu-open')
        if (navToggleEl) navToggleEl.classList.remove('nav-toggle-open')
      })
    })
  }
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

loadNavigation()
loadHero()
loadImpressum()

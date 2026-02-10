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

function isHeroInView() {
  const hero = document.getElementById('hero')
  if (!hero) return false
  const rect = hero.getBoundingClientRect()
  const vh = window.innerHeight || document.documentElement.clientHeight
  return rect.bottom > 0 && rect.top < vh * 0.8
}

function initHeroPlantLabel(labelEl) {
  const SHOW_AFTER_PAUSE_MS = 400
  const VISIBLE_DURATION_MS = 8000
  let showTimeout
  let hideTimeout
  const heroEl = document.getElementById('hero')

  function showLabel() {
    labelEl.classList.add('hero-plant-label-visible')
  }

  function hideLabel() {
    labelEl.classList.remove('hero-plant-label-visible')
  }

  function startHideTimer() {
    if (hideTimeout) clearTimeout(hideTimeout)
    hideTimeout = setTimeout(() => {
      hideLabel()
      hideTimeout = null
    }, VISIBLE_DURATION_MS)
  }

  function showFromScroll() {
    if (!isHeroInView()) return
    showLabel()
    startHideTimer()
  }

  function onScroll() {
    if (!isHeroInView()) {
      hideLabel()
      if (showTimeout) { clearTimeout(showTimeout); showTimeout = null }
      if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null }
      return
    }
    hideLabel()
    if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null }
    if (showTimeout) clearTimeout(showTimeout)
    showTimeout = setTimeout(() => {
      showTimeout = null
      showFromScroll()
    }, SHOW_AFTER_PAUSE_MS)
  }

  function onHeroInteraction() {
    if (!isHeroInView()) return
    if (showTimeout) { clearTimeout(showTimeout); showTimeout = null }
    showLabel()
    startHideTimer()
  }

  if (heroEl) {
    heroEl.addEventListener('mouseenter', onHeroInteraction)
    heroEl.addEventListener('touchstart', onHeroInteraction, { passive: true })
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  if (isHeroInView()) {
    showTimeout = setTimeout(showFromScroll, SHOW_AFTER_PAUSE_MS)
  }
}

// Load hero image
async function loadHero() {
  const hero = await fetchSanity(`*[_type == "hero"][0]`)
  if (!hero) return

  const heroImageUrl = getImageUrl(hero.image)
  const plantLabel = hero.plantLabel

  const heroElement = document.getElementById('hero')
  heroElement.innerHTML = `
    ${heroImageUrl ? `<div class="hero-image" style="background-image: url('${heroImageUrl}')"></div>` : ''}
    <h1>${hero.headline}</h1>
    <p>${hero.subheadline || ''}</p>
    ${plantLabel ? `<span class="hero-plant-label">${plantLabel}</span>` : ''}
  `

  const plantLabelEl = heroElement.querySelector('.hero-plant-label')
  if (plantLabelEl) {
    initHeroPlantLabel(plantLabelEl)
  }
}

// NAVIGATION
async function loadNavigation() {
  const settings = await fetchSanity(`*[_type == "siteSettings"][0]`)
  if (!settings) return

  // Logo-Text aus siteTitle laden und Link setzen
  const logoEl = document.querySelector('.nav-logo')
  if (logoEl) {
    if (settings.siteTitle) {
      logoEl.textContent = settings.siteTitle
    }
    // Logo-Link zeigt immer zur Startseite mit Hero
    logoEl.href = 'index.html'
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

// Load page title from Sanity
async function loadPageTitle() {
  const settings = await fetchSanity(`*[_type == "siteSettings"][0]`)
  if (settings?.siteTitle) {
    document.title = `Datenschutzerklärung - ${settings.siteTitle}`
  }
}

loadPageTitle()
loadNavigation()
loadHero()
loadDatenschutz()

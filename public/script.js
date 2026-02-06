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
  const ref = imageField.asset._ref // z.B. "image-<id>-2000x1000-jpg"
  const parts = ref.split('-')
  // ["image", "<id>", "2000x1000", "jpg"]
  if (parts.length !== 4 || parts[0] !== 'image') return null
  const id = parts[1]
  const dimensions = parts[2]
  const format = parts[3]
  const fileName = `${id}-${dimensions}.${format}`
  return `${IMAGE_BASE_URL}/${fileName}`
}

// HERO
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

// ABOUT
async function loadAbout() {
  const about = await fetchSanity(`*[_type == "about"][0]`)
  if (!about) return

  const portraitUrl = getImageUrl(about.portrait)

  const photographerText = about.photographerLinkText || 'Foto: zur Fotografin'

  document.getElementById('about').innerHTML = `
    <h2>Über mich</h2>
    <div class="about-content">
      ${portraitUrl ? `
        <div class="about-image-wrapper">
          <img src="${portraitUrl}" alt="Portrait von Karin" class="about-portrait">
          ${about.photographerLink ? `<p class="photo-credit"><a href="${about.photographerLink}" target="_blank" rel="noopener noreferrer">${photographerText}</a></p>` : ''}
        </div>
      ` : ''}
      <div class="about-text">
        ${about.text ? about.text.split('\n\n').map(para => para.trim() ? `<p>${para.trim()}</p>` : '').join('') : ''}
      </div>
    </div>
  `
}

// CERTIFICATES
async function loadCertificates() {
  const certificates = await fetchSanity(`*[_type == "certificate"]{title, image}`)
  if (!certificates || certificates.length === 0) return

  const items = certificates.map(cert => {
    const img = getImageUrl(cert.image)
    const thumb = img ? `${img}?w=600&auto=format` : null
    return `
      <article class="certificate-item">
        ${thumb ? `<img src="${thumb}" alt="${cert.title || ''}" class="certificate-image">` : ''}
        <h3 class="certificate-title">${cert.title || ''}</h3>
      </article>
    `
  }).join('')

  document.getElementById('certificate').innerHTML = `
    <h2>Zertifikate</h2>
    <div class="certificate-grid">${items}</div>
  `
}

// Sections basierend auf Navigation-Reihenfolge anordnen
function reorderSections(navigationItems) {
  if (!navigationItems || navigationItems.length === 0) return
  
  const main = document.querySelector('main')
  if (!main) return
  
  // Extrahiere Section-IDs aus Navigation (z.B. #about -> about)
  const sectionOrder = navigationItems
    .map(item => {
      const href = item.href
      // Entferne # oder index.html# Präfix
      return href.replace(/^(index\.html)?#/, '')
    })
    .filter(id => id) // Entferne leere IDs
  
  // Sammle alle Sections
  const sections = Array.from(main.querySelectorAll('section'))
  const sectionsMap = new Map()
  sections.forEach(section => {
    const id = section.id
    if (id) {
      sectionsMap.set(id, section)
    }
  })
  
  // Entferne alle Sections aus dem DOM
  sections.forEach(section => section.remove())
  
  // Füge Sections in der Navigation-Reihenfolge wieder hinzu
  sectionOrder.forEach(sectionId => {
    const section = sectionsMap.get(sectionId)
    if (section) {
      main.appendChild(section)
      sectionsMap.delete(sectionId) // Bereits eingefügt
    }
  })
  
  // Füge verbleibende Sections am Ende hinzu (falls welche nicht in Navigation sind)
  sectionsMap.forEach(section => {
    main.appendChild(section)
  })
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
    
    // Sections basierend auf Navigation-Reihenfolge anordnen
    reorderSections(settings.navigationItems)
  }
}

// OFFERS
async function loadOffers() {
  const offers = await fetchSanity(`*[_type == "offers"] | order(_createdAt asc)`)
  if (!offers || offers.length === 0) return

  const items = offers.map(offer => `
    <article class="offer-item">
      ${offer.title ? `<h3>${offer.title}</h3>` : ''}
      ${offer.description ? `<p class="offer-description">${offer.description}</p>` : ''}
      ${offer.targetGroup ? `<p class="offer-meta"><strong>Zielgruppe:</strong> ${offer.targetGroup}</p>` : ''}
      ${offer.location ? `<p class="offer-meta"><strong>Ort:</strong> ${offer.location}</p>` : ''}
      ${offer.note ? `<p class="offer-note">${offer.note}</p>` : ''}
    </article>
  `).join('')

  document.getElementById('offers').innerHTML = `
    <h2>Angebote</h2>
    <div class="offers-grid">${items}</div>
  `
}

// CONTACT
async function loadContact() {
  const contact = await fetchSanity(`*[_type == "contact"][0]`)
  const settings = await fetchSanity(`*[_type == "siteSettings"][0]`)
  const email = settings?.email || 'kontakt@example.com'
  
  // Text aus Sanity laden oder Fallback verwenden
  const contactText = contact?.text || 'Ich biete verschiedene Coaching-Angebote zu essbaren Wildpflanzen an. Ob Einzelcoaching, Gruppenkurse oder Workshops – gemeinsam entdecken wir die Vielfalt der Natur.\n\nHast du Fragen zu meinen Angeboten oder möchtest du einen Termin vereinbaren? Dann melde dich gerne bei mir!'
  
  // Text in Absätze aufteilen
  const paragraphs = contactText.split('\n\n').map(para => para.trim()).filter(para => para)

  document.getElementById('contact').innerHTML = `
    <h2>Kontakt</h2>
    <div class="contact-content">
      <a href="mailto:${email}?subject=Anfrage%20zu%20Wildpflanzen-Coaching" class="contact-button">Jetzt anfragen</a>
      <div class="contact-text">
        ${paragraphs.map(para => `<p>${para}</p>`).join('')}
      </div>
    </div>
  `
}

// Parallax-Effekt entfernt - Hero-Bild ist jetzt fix mit background-attachment: fixed

// NAVIGATION - Mobile menu toggle
function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle')
  const navMenu = document.querySelector('.nav-menu')
  const navLinks = document.querySelectorAll('.nav-menu a')

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('nav-menu-open')
      navToggle.classList.toggle('nav-toggle-open')
    })
  }

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('nav-menu-open')
      navToggle.classList.remove('nav-toggle-open')
    })
  })
}

// SCROLL TO TOP BUTTON
function initScrollToTop() {
  const scrollButton = document.querySelector('.scroll-to-top')
  if (!scrollButton) return

  // Show/hide button based on scroll position
  function toggleScrollButton() {
    if (window.pageYOffset > 300) {
      scrollButton.classList.add('scroll-to-top-visible')
    } else {
      scrollButton.classList.remove('scroll-to-top-visible')
    }
  }

  // Scroll to top on click
  scrollButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })

  // Check scroll position
  window.addEventListener('scroll', toggleScrollButton, { passive: true })
  toggleScrollButton() // Initial check
}

// Scroll to hash section after content is loaded
function scrollToHash() {
  if (window.location.hash) {
    const targetId = window.location.hash.substring(1)
    setTimeout(() => {
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        const navHeight = document.querySelector('.main-nav')?.offsetHeight || 0
        const targetPosition = targetElement.offsetTop - navHeight - 20
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
    }, 500) // Wait for content to render
  }
}

// Load page title and meta description from Sanity
async function loadPageTitle() {
  const settings = await fetchSanity(`*[_type == "siteSettings"][0]`)
  if (settings) {
    // Page title
    if (settings.siteTitle) {
      document.title = settings.siteTitle
    }
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription && settings.description) {
      metaDescription.setAttribute('content', settings.description)
    }
    
    // Footer text
    const footerText = document.getElementById('footer-text')
    if (footerText) {
      const name = settings.name || 'Karin'
      const siteTitle = settings.siteTitle || 'Wildpflanzen entdecken und genießen'
      footerText.textContent = `© ${name} · ${siteTitle}`
    }
  }
}

// Sanfte Fade-in Animation beim Scrollen (nur wenn Section sichtbar wird)
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -100px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
        // Stoppe Beobachtung nach erstem Erscheinen
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Alle Sektionen beobachten - aber nur wenn sie noch nicht sichtbar sind
  const sections = document.querySelectorAll('section')
  sections.forEach((section, index) => {
    // Erste Section sofort sichtbar machen
    if (index === 0) {
      section.style.opacity = '1'
      section.style.transform = 'translateY(0)'
    } else {
      section.style.opacity = '0'
      section.style.transform = 'translateY(20px)'
      section.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out'
      observer.observe(section)
    }
  })
}

// Load all content and handle hash navigation
async function loadAllContent() {
  // Page title zuerst laden
  await loadPageTitle()
  
  // Navigation zuerst laden, damit Menüpunkte verfügbar sind
  await loadNavigation()
  
  await Promise.all([
    loadHero(),
    loadAbout(),
    loadOffers(),
    loadCertificates(),
    loadContact()
  ])
  
  // Navigation-Event-Listener nach dem Laden setzen
  initNavigation()
  
  // Scroll-Animationen initialisieren
  setTimeout(() => {
    initScrollAnimations()
  }, 100)
  
  // Scroll to hash if present (e.g., from external link)
  scrollToHash()
}

loadAllContent()
initScrollToTop()
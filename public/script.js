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

// CONTACT
async function loadContact() {
  const settings = await fetchSanity(`*[_type == "siteSettings"][0]`)
  const email = settings?.email || 'kontakt@example.com'

  document.getElementById('contact').innerHTML = `
    <h2>Kontakt</h2>
    <div class="contact-content">
      <a href="mailto:${email}?subject=Anfrage%20zu%20Wildpflanzen-Coaching" class="contact-button">Jetzt anfragen</a>
      <div class="contact-text">
        <p>Ich biete verschiedene Coaching-Angebote zu essbaren Wildpflanzen an. Ob Einzelcoaching, Gruppenkurse oder Workshops – gemeinsam entdecken wir die Vielfalt der Natur.</p>
        <p>Hast du Fragen zu meinen Angeboten oder möchtest du einen Termin vereinbaren? Dann melde dich gerne bei mir!</p>
      </div>
    </div>
  `
}

// PARALLAX EFFECT for Hero image
function initParallax() {
  const heroImage = document.querySelector('.hero-image')
  if (!heroImage) return

  let ticking = false

  function updateParallax() {
    const scrolled = window.pageYOffset
    const hero = document.getElementById('hero')
    if (!hero) return
    
    const heroHeight = hero.offsetHeight
    const heroTop = hero.offsetTop
    const heroBottom = heroTop + heroHeight
    
    // Only apply parallax when hero is in view
    if (scrolled < heroBottom) {
      // Parallax: image moves slower (30% speed for subtler effect)
      const parallaxSpeed = 0.3
      const yPos = -(scrolled - heroTop) * parallaxSpeed
      // Limit movement to prevent gaps
      const maxMove = heroHeight * 0.3
      const limitedYPos = Math.max(-maxMove, yPos)
      heroImage.style.transform = `translate3d(0, ${limitedYPos}px, 0)`
    } else {
      // Reset when scrolled past
      heroImage.style.transform = `translate3d(0, ${-heroHeight * 0.3}px, 0)`
    }
    
    ticking = false
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax)
      ticking = true
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true })
}

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

// Load page title from Sanity
async function loadPageTitle() {
  const settings = await fetchSanity(`*[_type == "siteSettings"][0]`)
  if (settings?.siteTitle) {
    document.title = settings.siteTitle
  }
}

// Sanfte Fade-in Animation beim Scrollen
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
      }
    })
  }, observerOptions)

  // Alle Sektionen beobachten
  const sections = document.querySelectorAll('section')
  sections.forEach(section => {
    section.style.opacity = '0'
    section.style.transform = 'translateY(30px)'
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'
    observer.observe(section)
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
// Wait for hero to load before initializing parallax
setTimeout(() => {
  initParallax()
}, 100)
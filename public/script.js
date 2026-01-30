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
    <a href="#contact" class="hero-button">${hero.ctaText || 'Jetzt anfragen'}</a>
  `
}

// ABOUT
async function loadAbout() {
  const about = await fetchSanity(`*[_type == "about"][0]`)
  if (!about) return

  const portraitUrl = getImageUrl(about.portrait)

  document.getElementById('about').innerHTML = `
    <h2>Über mich</h2>
    <div class="about-content">
      ${portraitUrl ? `<img src="${portraitUrl}" alt="Portrait von Karin" class="about-portrait">` : ''}
      <div class="about-text">
        <p>${about.text || ''}</p>
        ${about.photographerLink ? `<p class="photo-credit"><a href="${about.photographerLink}" target="_blank" rel="noopener noreferrer">Foto: zur Fotografin</a></p>` : ''}
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
        <h3 class="certificate-title">${cert.title || ''}</h3>
        ${thumb ? `<img src="${thumb}" alt="${cert.title || ''}" class="certificate-image">` : ''}
      </article>
    `
  }).join('')

  document.getElementById('certificate').innerHTML = `
    <h2>Zertifikate</h2>
    <div class="certificate-grid">${items}</div>
  `
}

// CONTACT
async function loadContact() {
  const settings = await fetchSanity(`*[_type == "siteSettings"][0]`)
  const email = settings?.email || 'kontakt@example.com'

  document.getElementById('contact').innerHTML = `
    <h2>Kontakt</h2>
    <div class="contact-content">
      <p>Ich biete verschiedene Coaching-Angebote zu essbaren Wildpflanzen an. Ob Einzelcoaching, Gruppenkurse oder Workshops – gemeinsam entdecken wir die Vielfalt der Natur.</p>
      <p>Hast du Fragen zu meinen Angeboten oder möchtest du einen Termin vereinbaren? Dann melde dich gerne bei mir!</p>
      <a href="mailto:${email}?subject=Anfrage%20zu%20Wildpflanzen-Coaching" class="contact-button">Jetzt anfragen</a>
    </div>
  `
}

loadHero()
loadAbout()
loadCertificates()
loadContact()
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
  // [ "image", "<id>", "2000x1000", "jpg" ] -> "<id>-2000x1000-jpg"
  const fileName = parts.slice(1).join('-')
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
    <button>${hero.ctaText || 'Kontakt'}</button>
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

loadHero()
loadAbout()

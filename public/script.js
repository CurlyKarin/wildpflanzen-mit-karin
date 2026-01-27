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

// HERO
async function loadHero() {
  const hero = await fetchSanity(`*[_type == "hero"][0]`)
  if (!hero) return

  document.getElementById('hero').innerHTML = `
    <h1>${hero.headline}</h1>
    <p>${hero.subheadline || ''}</p>
    <button>${hero.ctaText || 'Kontakt'}</button>
  `
}

// ABOUT
async function loadAbout() {
  const about = await fetchSanity(`*[_type == "about"][0]`)
  if (!about) return

  document.getElementById('about').innerHTML = `
    <h2>Über mich</h2>
    <p>${about.text || ''}</p>
  `
}

loadHero()
loadAbout()

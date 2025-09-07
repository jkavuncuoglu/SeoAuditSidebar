// uxAudit.ts - Client-side UX checks using safe heuristics (no cross-origin network).
// Each function returns: { id, name, status: 'pass'|'warn'|'fail'|'unchecked', details }

export type AuditStatus = 'pass' | 'warn' | 'fail' | 'unchecked'
export interface AuditResult {
  id: string
  name: string
  status: AuditStatus
  details?: string
}

function trim(s?: string | null) {
  return (s || '').trim()
}

function parseColor(input: string): [number, number, number] | null {
  const s = input.trim().toLowerCase()
  // rgb/rgba
  const m = s.match(/^rgba?\((\d+)[ ,]+(\d+)[ ,]+(\d+)(?:[ ,\/]+([\d\.]+))?\)$/)
  if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])]
  // hex
  const hx = s.replace('#', '')
  if (/^[0-9a-f]{3}$/.test(hx)) {
    const r = parseInt(hx[0] + hx[0], 16)
    const g = parseInt(hx[1] + hx[1], 16)
    const b = parseInt(hx[2] + hx[2], 16)
    return [r, g, b]
  }
  if (/^[0-9a-f]{6}$/.test(hx)) {
    return [parseInt(hx.slice(0, 2), 16), parseInt(hx.slice(2, 4), 16), parseInt(hx.slice(4, 6), 16)]
  }
  return null
}

function relativeLuminance([r8, g8, b8]: [number, number, number]): number {
  const toLin = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  const r = toLin(r8)
  const g = toLin(g8)
  const b = toLin(b8)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const L1 = relativeLuminance(rgb1)
  const L2 = relativeLuminance(rgb2)
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

/** Check presence of viewport meta */
export async function checkViewport(): Promise<AuditResult> {
  const meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null
  if (!meta || !trim(meta.content)) {
    return { id: 'viewport', name: 'Viewport Meta', status: 'fail', details: 'Missing meta viewport. Add <meta name="viewport" content="width=device-width, initial-scale=1">.' }
  }
  const c = meta.content.toLowerCase()
  const hasWidth = c.includes('width=device-width')
  const hasScale = c.includes('initial-scale')
  if (hasWidth && hasScale) return { id: 'viewport', name: 'Viewport Meta', status: 'pass', details: 'Viewport looks good.' }
  return { id: 'viewport', name: 'Viewport Meta', status: 'warn', details: 'Viewport present but content may be incomplete. Include width=device-width and initial-scale.' }
}

/** Basic mobile-friendly heuristic */
export async function checkMobileFriendly(): Promise<AuditResult> {
  const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  const bodyScroll = document.documentElement.scrollWidth || document.body.scrollWidth
  const overflowX = bodyScroll > vw * 1.05
  const viewportMeta = document.querySelector('meta[name="viewport"]')
  if (!overflowX && viewportMeta) {
    return { id: 'mobile-friendly', name: 'Mobile Friendly', status: 'pass', details: 'No horizontal overflow detected; viewport meta present.' }
  }
  return {
    id: 'mobile-friendly',
    name: 'Mobile Friendly',
    status: 'warn',
    details: overflowX ? 'Horizontal overflow may harm mobile UX. Ensure responsive layout and proper meta viewport.' : 'Viewport meta missing; layout may not scale on mobile.',
  }
}

/** Detect obvious broken links (limited without network) */
export async function checkBrokenLinks(): Promise<AuditResult> {
  const anchors = Array.from(document.querySelectorAll('a[href]')) as HTMLAnchorElement[]
  const suspicious = anchors.filter((a) => {
    const href = (a.getAttribute('href') || '').trim()
    if (href === '' || href === '#') return true
    if (href.toLowerCase().startsWith('javascript:')) return true
    return false
  })
  if (suspicious.length > 0) {
    const sample = suspicious.slice(0, 5).map((a) => a.textContent?.trim() || a.href || '#').join(', ')
    return {
      id: 'broken-links',
      name: 'Broken Links',
      status: 'warn',
      details: `Found ${suspicious.length} link(s) with empty/#/javascript href. Network validation is limited for cross-origin links. Examples: ${sample}`,
    }
  }
  return { id: 'broken-links', name: 'Broken Links', status: 'pass', details: 'No obvious broken link patterns detected (limited check).' }
}

/** Detect very large images by natural size */
export async function checkLargeImages(): Promise<AuditResult> {
  const imgs = Array.from(document.images)
  const large = imgs.filter((img) => (img.naturalWidth > 2000 || img.naturalHeight > 2000))
  if (large.length > 0) {
    const examples = large.slice(0, 3).map((i) => `${i.naturalWidth}x${i.naturalHeight}`).join(', ')
    return {
      id: 'large-images',
      name: 'Large Images',
      status: 'warn',
      details: `Found ${large.length} very large image(s). Consider optimizing/resizing. Examples: ${examples}`,
    }
  }
  return { id: 'large-images', name: 'Large Images', status: 'pass', details: 'No unusually large images detected.' }
}

/** Contrast hint for body text vs background */
export async function checkAccessibilityContrastHint(): Promise<AuditResult> {
  const body = document.body
  const csBody = getComputedStyle(body)
  const csHtml = getComputedStyle(document.documentElement)
  const colorStr = csBody.color
  const bgStr = csBody.backgroundColor && csBody.backgroundColor !== 'rgba(0, 0, 0, 0)'
    ? csBody.backgroundColor
    : csHtml.backgroundColor
  const fg = parseColor(colorStr)
  const bg = parseColor(bgStr)
  if (!fg || !bg) {
    return { id: 'contrast-hint', name: 'Contrast Hint', status: 'unchecked', details: 'Could not parse colors to evaluate contrast.' }
  }
  const ratio = contrastRatio(fg, bg)
  if (ratio < 4.5) {
    return { id: 'contrast-hint', name: 'Contrast Hint', status: 'warn', details: `Estimated contrast ${ratio.toFixed(2)}:1 (< 4.5:1). Consider increasing contrast.` }
  }
  return { id: 'contrast-hint', name: 'Contrast Hint', status: 'pass', details: `Estimated contrast ${ratio.toFixed(2)}:1` }
}

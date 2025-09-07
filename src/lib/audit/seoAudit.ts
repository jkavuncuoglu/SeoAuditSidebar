// seoAudit.ts - Client-side Content SEO checks for the current document.
// Each function returns: { id, name, status: 'pass'|'warn'|'fail'|'unchecked', details }

export type AuditStatus = 'pass' | 'warn' | 'fail' | 'unchecked'
export interface AuditResult {
  id: string
  name: string
  status: AuditStatus
  details?: string
}

/** Parse a CSS color string to RGB tuple */
function trim(str: string | null | undefined) {
  return (str || '').trim()
}

/** Check presence and length (<= 60 chars) of the meta title */
export async function checkMetaTitle(): Promise<AuditResult> {
  const title = trim(document.title || (document.querySelector('title')?.textContent ?? ''))
  if (!title) {
    return {
      id: 'meta-title',
      name: 'Meta Title',
      status: 'fail',
      details: 'Missing <title>. Add a concise, descriptive title (≤ 60 characters).',
    }
  }
  if (title.length > 60) {
    return {
      id: 'meta-title',
      name: 'Meta Title',
      status: 'warn',
      details: `Title is ${title.length} characters. Aim for 50–60 to avoid truncation.`,
    }
  }
  return { id: 'meta-title', name: 'Meta Title', status: 'pass', details: 'Looks good.' }
}

/** Check presence and length (<= 160 chars) of meta description */
export async function checkMetaDescription(): Promise<AuditResult> {
  const meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
  const content = trim(meta?.content)
  if (!content) {
    return {
      id: 'meta-description',
      name: 'Meta Description',
      status: 'fail',
      details: 'Missing or empty meta description. Add a compelling summary (≤ 160 characters).',
    }
  }
  if (content.length > 160) {
    return {
      id: 'meta-description',
      name: 'Meta Description',
      status: 'warn',
      details: `Description is ${content.length} characters. Aim for 120–160 to avoid truncation.`,
    }
  }
  return { id: 'meta-description', name: 'Meta Description', status: 'pass', details: 'Looks good.' }
}

/** Check at least one <h1> exists */
export async function checkH1Presence(): Promise<AuditResult> {
  const count = document.querySelectorAll('h1').length
  if (count < 1) {
    return {
      id: 'h1-presence',
      name: 'H1 Presence',
      status: 'fail',
      details: 'No <h1> found. Include a primary heading that describes the page content.',
    }
  }
  return { id: 'h1-presence', name: 'H1 Presence', status: 'pass', details: `Found ${count} <h1> tag(s).` }
}

/** Duplicate meta detection (single-page context only) */
export async function checkDuplicateMeta(): Promise<AuditResult> {
  // In a single-page context we cannot determine duplicates across pages.
  // Report as unknown via status 'unchecked'.
  return {
    id: 'duplicate-meta',
    name: 'Duplicate Meta',
    status: 'unchecked',
    details: 'Unknown in single-page context. Compare title/description across multiple pages.',
  }
}

/** Check images for missing/empty alt attributes */
export async function checkImageAlts(): Promise<AuditResult> {
  const imgs = Array.from(document.images)
  const missing = imgs.filter((img) => !img.hasAttribute('alt') || trim(img.getAttribute('alt')) === '')
  if (missing.length > 0) {
    const sample = missing.slice(0, 3).map((el) => el.currentSrc || el.src || '[inline]').join(', ')
    return {
      id: 'image-alts',
      name: 'Image Alts',
      status: 'fail',
      details: `Found ${missing.length} image(s) without alt. Example(s): ${sample}. Add descriptive alt text.`,
    }
  }
  return { id: 'image-alts', name: 'Image Alts', status: 'pass', details: 'All images appear to have alt text.' }
}

/** Check presence of canonical link */
export async function checkCanonical(): Promise<AuditResult> {
  const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!link || !trim(link.href)) {
    return {
      id: 'canonical',
      name: 'Canonical Link',
      status: 'warn',
      details: 'No canonical URL found. Add <link rel="canonical" href="..."> to avoid duplicate content issues.',
    }
  }
  return { id: 'canonical', name: 'Canonical Link', status: 'pass', details: `Canonical set to ${link.href}` }
}

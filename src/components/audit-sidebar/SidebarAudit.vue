<script setup lang="ts">
// SidebarAudit.vue - Collapsible sidebar housing SEO & UX audit with tabs and run controls.
import { computed, onMounted, ref } from 'vue'
import AuditChecklist from './AuditChecklist.vue'
import type { AuditStatus } from './AuditItem.vue'
import {
  checkMetaTitle,
  checkMetaDescription,
  checkH1Presence,
  checkDuplicateMeta,
  checkImageAlts,
  checkCanonical,
} from '../../lib/audit/seoAudit'
import {
  checkViewport,
  checkMobileFriendly,
  checkBrokenLinks,
  checkLargeImages,
  checkAccessibilityContrastHint,
} from '../../lib/audit/uxAudit'

export interface AuditResult {
  id: string
  name: string
  status: AuditStatus
  details?: string
  description?: string
}

type TabKey = 'seo' | 'ux'

const LOCAL_COLLAPSED = 'auditSidebar:collapsed'
const LOCAL_SUPPRESSED = 'auditSidebar:suppressed'
const LOCAL_TAB = 'auditSidebar:tab'

const open = ref(true)
const activeTab = ref<TabKey>('seo')
const suppressed = ref<Record<TabKey, string[]>>({ seo: [], ux: [] })

const seoChecks = ref<AuditResult[]>([
  { id: 'meta-title', name: 'Meta Title', status: 'unchecked', description: 'Presence and length ≤ 60 characters' },
  { id: 'meta-description', name: 'Meta Description', status: 'unchecked', description: 'Presence and length ≤ 160 characters' },
  { id: 'h1-presence', name: 'H1 Presence', status: 'unchecked', description: 'At least one <h1> on the page' },
  { id: 'duplicate-meta', name: 'Duplicate Meta', status: 'unchecked', description: 'Detect duplicate title/description (current page only)' },
  { id: 'image-alts', name: 'Image Alts', status: 'unchecked', description: 'All <img> elements should have descriptive alt text' },
  { id: 'canonical', name: 'Canonical Link', status: 'unchecked', description: 'Presence of <link rel="canonical">' },
])

const uxChecks = ref<AuditResult[]>([
  { id: 'viewport', name: 'Viewport Meta', status: 'unchecked', description: 'Presence of responsive viewport meta tag' },
  { id: 'mobile-friendly', name: 'Mobile Friendly', status: 'unchecked', description: 'Heuristic based on viewport width & media support' },
  { id: 'broken-links', name: 'Broken Links', status: 'unchecked', description: 'Detect obvious bad links (limited without network)' },
  { id: 'large-images', name: 'Large Images', status: 'unchecked', description: 'Detect images with very large natural size' },
  { id: 'contrast-hint', name: 'Contrast Hint', status: 'unchecked', description: 'Estimate body text vs background contrast' },
])

const isSeo = computed(() => activeTab.value === 'seo')

function loadState() {
  try {
    open.value = localStorage.getItem(LOCAL_COLLAPSED) !== '1'
    const raw = localStorage.getItem(LOCAL_SUPPRESSED)
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, string[]>
      suppressed.value = { seo: parsed.seo || [], ux: parsed.ux || [] }
    }
    const rawTab = localStorage.getItem(LOCAL_TAB) as TabKey | null
    if (rawTab === 'seo' || rawTab === 'ux') activeTab.value = rawTab
  } catch {
    // ignore
  }
}

function saveState() {
  try {
    localStorage.setItem(LOCAL_COLLAPSED, open.value ? '0' : '1')
    localStorage.setItem(LOCAL_SUPPRESSED, JSON.stringify(suppressed.value))
    localStorage.setItem(LOCAL_TAB, activeTab.value)
  } catch {
    // ignore
  }
}

function setResult(list: AuditResult[], result: AuditResult) {
  const idx = list.findIndex((x) => x.id === result.id)
  if (idx >= 0) list[idx] = { ...list[idx], ...result }
}

async function runSeoAll() {
  const results = await Promise.all([
    checkMetaTitle(),
    checkMetaDescription(),
    checkH1Presence(),
    checkDuplicateMeta(),
    checkImageAlts(),
    checkCanonical(),
  ])
  results.forEach((r) => setResult(seoChecks.value, r))
}

async function runUxAll() {
  const results = await Promise.all([
    checkViewport(),
    checkMobileFriendly(),
    checkBrokenLinks(),
    checkLargeImages(),
    checkAccessibilityContrastHint(),
  ])
  results.forEach((r) => setResult(uxChecks.value, r))
}

async function runAll() {
  await Promise.all([runSeoAll(), runUxAll()])
}

async function runOne(id: string) {
  const list = isSeo.value ? seoChecks.value : uxChecks.value
  const map: Record<string, () => Promise<AuditResult>> = {
    // SEO
    'meta-title': checkMetaTitle,
    'meta-description': checkMetaDescription,
    'h1-presence': checkH1Presence,
    'duplicate-meta': checkDuplicateMeta,
    'image-alts': checkImageAlts,
    canonical: checkCanonical,
    // UX
    viewport: checkViewport,
    'mobile-friendly': checkMobileFriendly,
    'broken-links': checkBrokenLinks,
    'large-images': checkLargeImages,
    'contrast-hint': checkAccessibilityContrastHint,
  }
  const fn = map[id]
  if (fn) {
    const res = await fn()
    setResult(list, res)
  }
}

function toggleSuppress(id: string, value: boolean) {
  const key: TabKey = isSeo.value ? 'seo' : 'ux'
  const set = new Set(suppressed.value[key])
  if (value) set.add(id)
  else set.delete(id)
  suppressed.value = { ...suppressed.value, [key]: Array.from(set) }
  saveState()
}

defineExpose({ runAll })

onMounted(() => loadState())
</script>

<template>
  <aside class="audit-sidebar fixed top-0 right-0 h-full w-[360px] max-w-[90vw] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-xl flex flex-col" :class="{ 'translate-x-0': open, 'translate-x-full': !open }">
    <header class="flex items-center justify-between p-3 border-b bg-slate-50 dark:bg-slate-900 dark:border-slate-700">
      <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-200">SEO &amp; UX Audit</h2>
      <div class="flex items-center gap-2">
        <button class="rounded-md border px-2 py-1 text-xs font-medium bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700" @click="runAll">Run all checks</button>
        <button class="rounded-md border px-2 py-1 text-xs font-medium bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700" @click="open = !open; saveState()">{{ open ? 'Close' : 'Open' }}</button>
      </div>
    </header>

    <div class="flex border-b dark:border-slate-700">
      <button class="flex-1 px-3 py-2 text-sm  text-slate-700" :class="{ 'font-semibold border-b-2 border-slate-800': isSeo }" @click="activeTab='seo'; saveState()">Content SEO</button>
      <button class="flex-1 px-3 py-2 text-sm  text-slate-700" :class="{ 'font-semibold border-b-2 border-slate-800': !isSeo }" @click="activeTab='ux'; saveState()">User Experience</button>
    </div>

    <section class="p-3 overflow-auto flex-1">
      <AuditChecklist
        v-if="isSeo"
        title="Content SEO"
        :checks="seoChecks"
        :suppressed-ids="suppressed.seo"
        @runAll="runSeoAll"
        @runOne="runOne"
        @toggleSuppress="toggleSuppress"
      />
      <AuditChecklist
        v-else
        title="User Experience"
        :checks="uxChecks"
        :suppressed-ids="suppressed.ux"
        @runAll="runUxAll"
        @runOne="runOne"
        @toggleSuppress="toggleSuppress"
      />
    </section>
  </aside>

  <!-- Toggle handle when closed -->
  <button v-if="!open" class="fixed right-2 top-2 z-50 rounded-md border px-2 py-1 text-xs bg-white  text-slate-700 shadow" @click="open=true; saveState()">Open Audit</button>
</template>

<style scoped>
@import '../../../styles/audit-sidebar.css';

.audit-sidebar { transition: transform 0.2s ease; }
</style>

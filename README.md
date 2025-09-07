# SEO & UX Audit Sidebar (Vue 3)

This modular sidebar provides quick Content SEO + User Experience audit checks for any page. It runs safe, client-side heuristics and displays pass/warn/fail statuses with guidance.

Files:
- src/components/audit-sidebar/SidebarAudit.vue — Collapsible sidebar with tabs and run controls.
- src/components/audit-sidebar/AuditChecklist.vue — List container that renders audit items and exposes a "Run Checks" action.
- src/components/audit-sidebar/AuditItem.vue — Single item row with status chip, description, and a "Run" button.
- src/lib/audit/seoAudit.ts — SEO checks (title, description, H1, images alt, canonical, duplicate meta placeholder).
- src/lib/audit/uxAudit.ts — UX checks (viewport, mobile-friendly heuristic, broken links heuristic, large images, contrast hint).
- src/styles/audit-sidebar.css — Minimal fallback CSS if Tailwind isn't available.

Usage in a Laravel + Inertia page (example):

```vue
<!-- resources/js/pages/website/Analyze.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Import from /src; Vite includes the repo root `src/` by default.
import SidebarAudit from '/src/components/audit-sidebar/SidebarAudit.vue'
// Optional: if Tailwind is disabled, bring minimal styles
import '/src/styles/audit-sidebar.css'

const auditRef = ref<InstanceType<typeof SidebarAudit> | null>(null)

onMounted(() => {
  // Demo: run all checks automatically after mount
  auditRef.value?.runAll?.()
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Your page content here -->
    <h1 class="text-2xl font-bold">Analyze Loan</h1>
    <p class="mt-2 text-slate-600">Run quick SEO & UX checks from the sidebar.</p>

    <!-- Mount the audit sidebar -->
    <SidebarAudit ref="auditRef" />
  </div>
</template>
```

Notes:
- The sidebar persists its open/closed state, active tab, and suppressed items in localStorage.
- "Run all checks" executes both SEO and UX audits; each item has its own "Run" action.
- Link checking is limited in the browser without cross-origin requests; results are heuristic-only.
- Duplicate meta is marked as 'unchecked' for single-page context; comparing across pages is out-of-scope here.

Troubleshooting:
- If you use Tailwind, the components will pick up the utility classes.
- Without Tailwind, import `/src/styles/audit-sidebar.css` globally (e.g., in resources/js/app.ts) or keep the component-scoped imports as-is.

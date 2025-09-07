<script setup lang="ts">
// AuditItem.vue - Renders a single audit check row with status, description, and Run button.
import { computed } from 'vue'

export type AuditStatus = 'pass' | 'warn' | 'fail' | 'unchecked'

export interface AuditResult {
  id: string
  name: string
  status: AuditStatus
  details?: string
  description?: string
}

const props = defineProps<{
  item: AuditResult
  suppressed?: boolean
}>()

const emit = defineEmits<{
  (e: 'run', id: string): void
  (e: 'toggleSuppress', id: string, value: boolean): void
}>()

const statusColor = computed(() => {
  switch (props.item.status) {
    case 'pass':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    case 'warn':
      return 'text-amber-700 bg-amber-50 border-amber-200'
    case 'fail':
      return 'text-rose-700 bg-rose-50 border-rose-200'
    default:
      return 'text-slate-600 bg-slate-50 border-slate-200'
  }
})
</script>

<template>
  <div class="flex flex-col gap-2 rounded-md border p-3 bg-white/60 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h4 class="font-medium text-slate-800 truncate" :title="item.name">{{ item.name }}</h4>
          <span class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold" :class="statusColor">
            {{ item.status }}
          </span>
        </div>
        <p v-if="item.description" class="text-xs text-slate-500 mt-1">{{ item.description }}</p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <label class="flex items-center gap-1 text-xs text-slate-500">
          <input type="checkbox" :checked="suppressed" @change="(e:any)=>emit('toggleSuppress', item.id, !!e.target.checked)" />
          Suppress
        </label>
        <button class="rounded-md border px-2 py-1 text-xs font-medium bg-slate-50  text-slate-700 hover:bg-slate-100" @click="emit('run', item.id)">Run</button>
      </div>
    </div>
    <p v-if="item.details && (item.status==='warn' || item.status==='fail')" class="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded p-2">{{ item.details }}</p>
  </div>
</template>

<style scoped>
/***** Fallback styles if Tailwind is not available *****/
@import '../../../styles/audit-sidebar.css';
</style>

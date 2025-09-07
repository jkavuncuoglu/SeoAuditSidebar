<script setup lang="ts">
// AuditChecklist.vue - Renders a list of audit items and exposes a "Run Checks" button.
import { computed } from 'vue'
import AuditItem, { type AuditResult } from './AuditItem.vue'

const props = defineProps<{
  title: string
  checks: AuditResult[]
  suppressedIds?: string[]
}>()

const emit = defineEmits<{
  (e: 'runAll'): void
  (e: 'runOne', id: string): void
  (e: 'toggleSuppress', id: string, value: boolean): void
}>()

const suppressedSet = computed(() => new Set(props.suppressedIds || []))
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-slate-700">{{ title }}</h3>
      <button class="rounded-md border px-2 py-1 text-xs font-medium  text-slate-700 bg-slate-50 hover:bg-slate-100" @click="emit('runAll')">Run Checks</button>
    </div>
    <div class="flex flex-col gap-3">
      <AuditItem
        v-for="c in checks"
        :key="c.id"
        :item="c"
        :suppressed="suppressedSet.has(c.id)"
        @run="(id)=>emit('runOne', id)"
        @toggleSuppress="(id,val)=>emit('toggleSuppress', id, val)"
      />
    </div>
  </div>
</template>

<style scoped>
@import '../../../styles/audit-sidebar.css';
</style>

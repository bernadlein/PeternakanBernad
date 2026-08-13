<script setup lang="ts">
import { Activity, PackageOpen } from '@lucide/vue'
import type { ActivityRecord } from '~/domain/farm.types'
import { useUiStore } from '~/stores/ui.store'

defineProps<{ records: ActivityRecord[] }>()
const ui = useUiStore()
</script>

<template>
  <div class="panel">
    <div class="panel-head"><div><h3 class="panel-title">Aktivitas terbaru</h3><p class="panel-subtitle">Catatan tim hari ini</p></div><PackageOpen :size="18" class="text-[#758078]" /></div>
    <div class="divide-y divide-[#edf0ec] px-5"><div v-for="record in records.slice(0, 4)" :key="record.id" class="flex gap-3 py-4"><div class="activity-icon" :class="`activity-${record.tone}`"><Activity :size="15" /></div><div class="min-w-0"><p class="text-xs font-semibold">{{ record.title }}</p><p class="mt-0.5 truncate text-[11px] text-[#7d8780]">{{ record.detail }}</p></div><span class="ml-auto text-[10px] font-medium text-[#9aa29c]">{{ record.time }}</span></div></div>
    <div class="px-5 pb-5"><button class="w-full rounded-xl border border-[#dfe5df] py-2.5 text-xs font-semibold text-[#496052] transition hover:bg-[#f4f7f3]" @click="ui.openActivity()">Tambah aktivitas</button></div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@lucide/vue'
import type { ActivityType } from '~/domain/farm.types'
import { useUiStore } from '~/stores/ui.store'

defineProps<{
  title: string
  description: string
  activityType?: ActivityType
  hideAction?: boolean
}>()

const ui = useUiStore()
</script>

<template>
  <section class="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div><p class="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#65806c]">Siklus 08 • Hari ke-26</p><h2 class="text-2xl font-semibold tracking-[-0.045em] sm:text-[30px]">{{ title }}</h2><p class="mt-1 max-w-2xl text-sm text-[#737e76]">{{ description }}</p></div>
    <button v-if="!hideAction" class="primary-button" @click="ui.openActivity(activityType)"><Plus :size="16" /> Tambah catatan</button>
  </section>
</template>

<script setup lang="ts">
import { Check } from '@lucide/vue'
import { useUiStore } from '~/stores/ui.store'

const ui = useUiStore()
</script>

<template>
  <Transition name="toast">
    <div v-if="ui.toast" class="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#193425] px-4 py-3 text-xs font-semibold text-white shadow-xl"><Check :size="15" class="text-[#c9f36a]" /> {{ ui.toast }}</div>
  </Transition>
</template>

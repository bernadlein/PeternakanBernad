<script setup lang="ts">
defineProps<{
  label: string
  value: string
  unit: string
  variant?: 'default' | 'warning'
}>()
</script>

<template>
  <article class="metric-card" :class="variant === 'warning' ? 'border-[#e8d6b3] bg-[#fffdf8]' : ''">
    <slot name="icon" />
    <div class="mt-5 flex items-end justify-between gap-2"><div><p class="metric-label">{{ label }}</p><p class="metric-value">{{ value }}</p></div><span class="mb-1 text-xs text-[#899189]">{{ unit }}</span></div>
    <div class="metric-foot"><slot /></div>
  </article>
</template>

<script setup lang="ts">
import { useFarmStore } from '~/stores/farm.store'

const farm = useFarmStore()
onMounted(() => farm.initialize())
</script>

<template>
  <div class="min-h-screen bg-[#f4f6f3] text-[#17271e]">
    <LayoutAppSidebar />
    <main class="lg:pl-[248px]">
      <LayoutAppHeader />
      <div class="mx-auto max-w-[1500px] p-4 sm:p-7 lg:p-9"><slot /></div>
    </main>
    <ActivityModal />
    <LayoutAppToast />
  </div>
</template>

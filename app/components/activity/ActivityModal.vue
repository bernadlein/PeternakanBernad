<script setup lang="ts">
import { Check, X } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { useActivityForm } from '~/composables/useActivityForm'
import { useFarmStore } from '~/stores/farm.store'
import { useUiStore } from '~/stores/ui.store'

const farm = useFarmStore()
const ui = useUiStore()
const { feedStocks } = storeToRefs(farm)
const defaultType = computed(() => ui.defaultActivityType)
const { form, activityTypes, isFeedActivity, isHealthActivity, amountRequired, amountUnit, amountLabel, reset } = useActivityForm(defaultType)

watch(() => ui.activityModalOpen, isOpen => {
  if (isOpen) reset(ui.defaultActivityType)
})

function submit() {
  const result = farm.recordActivity({ ...form })
  if (!result.ok) {
    ui.notify(result.message)
    return
  }
  ui.closeActivity()
  ui.notify('Aktivitas berhasil disimpan')
}
</script>

<template>
  <button class="fixed bottom-5 right-5 z-20 flex size-13 items-center justify-center rounded-2xl bg-[#193425] text-white shadow-xl sm:hidden" aria-label="Catat aktivitas" @click="ui.openActivity()"><span class="text-xl">+</span></button>
  <div v-if="ui.activityModalOpen" class="fixed inset-0 z-50 flex items-end justify-center bg-[#10251a]/50 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="activity-title" @click.self="ui.closeActivity()">
    <form class="w-full max-w-[560px] rounded-t-[24px] bg-white p-5 shadow-2xl sm:rounded-[24px] sm:p-6" @submit.prevent="submit">
      <div class="flex items-start justify-between"><div><h2 id="activity-title" class="text-lg font-bold tracking-[-0.03em]">Catat aktivitas</h2><p class="mt-1 text-xs text-[#7c867f]">Data tersimpan otomatis di perangkat ini.</p></div><button type="button" class="rounded-lg p-2 hover:bg-[#f1f4f0]" aria-label="Tutup form" @click="ui.closeActivity()"><X :size="19" /></button></div>
      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <label class="field-label sm:col-span-2">Jenis aktivitas<select v-model="form.type" class="field-input"><option v-for="type in activityTypes" :key="type">{{ type }}</option></select></label>
        <label class="field-label">Tanggal<input v-model="form.date" type="date" class="field-input" required /></label>
        <label class="field-label">Kandang<select v-model="form.coopId" class="field-input"><option value="KD-01">Kandang Timur</option><option value="KD-02">Kandang Barat</option><option v-if="isHealthActivity" value="ALL">Semua kandang</option></select></label>
        <label v-if="isFeedActivity" class="field-label">Jenis pakan<select v-model="form.feedCode" class="field-input"><option v-for="feed in feedStocks" :key="feed.code" :value="feed.code">{{ feed.code }} • {{ feed.name }}</option></select></label>
        <label v-if="isHealthActivity" class="field-label">Program<select v-model="form.healthType" class="field-input"><option>Vaksin</option><option>Vitamin</option><option>Pengobatan</option><option>Observasi</option></select></label>
        <label class="field-label" :class="!isFeedActivity && !isHealthActivity ? 'sm:col-span-2' : ''">{{ amountLabel }}<div class="relative"><input v-model.number="form.amount" type="number" min="0" step="0.01" class="field-input pr-20" :required="amountRequired" /><span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#8b948d]">{{ amountUnit }}</span></div></label>
        <label class="field-label sm:col-span-2">Catatan<textarea v-model="form.note" class="field-input min-h-20 resize-none" placeholder="Keterangan, nomor PO, nama produk, atau temuan lapangan" /></label>
      </div>
      <div class="mt-6 flex justify-end gap-2"><button type="button" class="rounded-xl border border-[#dce2dc] px-4 py-2.5 text-xs font-semibold" @click="ui.closeActivity()">Batal</button><button type="submit" class="primary-button"><Check :size="16" /> Simpan</button></div>
    </form>
  </div>
</template>

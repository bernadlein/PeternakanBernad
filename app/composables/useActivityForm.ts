import { ACTIVITY_TYPES } from '~/domain/farm.constants'
import type { ActivityType, RecordActivityInput } from '~/domain/farm.types'

function todayInJakarta(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

export function useActivityForm(defaultType: Ref<ActivityType>) {
  const form = reactive<RecordActivityInput>({
    type: defaultType.value,
    date: todayInJakarta(),
    coopId: 'KD-01',
    amount: null,
    feedCode: 'BR-2',
    healthType: 'Vitamin',
    note: '',
  })

  const isFeedActivity = computed(() => form.type === 'Pakan masuk' || form.type === 'Pakan keluar')
  const isHealthActivity = computed(() => form.type === 'Vaksinasi' || form.type === 'Obat & vitamin')
  const amountRequired = computed(() => ['Mortalitas', 'Pakan keluar', 'Pakan masuk', 'Timbang sampel'].includes(form.type))
  const amountUnit = computed(() => {
    if (form.type === 'Mortalitas') return 'ekor'
    if (form.type === 'Timbang sampel') return 'kg'
    if (isFeedActivity.value) return 'kg'
    return 'dosis'
  })
  const amountLabel = computed(() => {
    if (form.type === 'Mortalitas') return 'Jumlah mortalitas'
    if (form.type === 'Timbang sampel') return 'Bobot rata-rata sampel'
    if (isFeedActivity.value) return 'Jumlah pakan'
    return 'Jumlah dosis (opsional)'
  })

  function reset(type: ActivityType = defaultType.value) {
    Object.assign(form, {
      type,
      date: todayInJakarta(),
      coopId: 'KD-01',
      amount: null,
      feedCode: 'BR-2',
      healthType: 'Vitamin',
      note: '',
    })
  }

  return {
    form,
    activityTypes: ACTIVITY_TYPES,
    isFeedActivity,
    isHealthActivity,
    amountRequired,
    amountUnit,
    amountLabel,
    reset,
  }
}

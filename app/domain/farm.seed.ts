import type { FarmState } from './farm.types'

export function createSeedFarmState(): FarmState {
  return {
    coops: [
      { id: 'KD-01', name: 'Kandang Timur', capacity: 24000, population: 23842, age: 26, weight: 1.44, temperature: 27.4, humidity: 68, mortalityToday: 10, feedToday: 3120, status: 'Normal' },
      { id: 'KD-02', name: 'Kandang Barat', capacity: 24000, population: 23906, age: 26, weight: 1.40, temperature: 27.1, humidity: 66, mortalityToday: 8, feedToday: 3080, status: 'Normal' },
    ],
    activities: [
      { id: 1, date: '2026-08-14', time: '07:42', title: 'Pakan keluar', detail: '3.100 kg • Kandang Timur', coopId: 'KD-01', tone: 'green' },
      { id: 2, date: '2026-08-14', time: '07:18', title: 'Mortalitas dicatat', detail: '8 ekor • Kandang Barat', coopId: 'KD-02', tone: 'red' },
      { id: 3, date: '2026-08-14', time: '06:55', title: 'Timbang sampel', detail: 'Rata-rata 1,44 kg • Kandang Timur', coopId: 'KD-01', tone: 'blue' },
      { id: 4, date: '2026-08-13', time: '16:10', title: 'Vitamin', detail: 'Vitamin C • Semua kandang', coopId: 'ALL', tone: 'amber' },
    ],
    populationRecords: [
      { id: 1, date: '2026-08-14', coopId: 'KD-01', opening: 23852, mortality: 10, culled: 0, closing: 23842, note: 'Kondisi normal' },
      { id: 2, date: '2026-08-14', coopId: 'KD-02', opening: 23914, mortality: 8, culled: 0, closing: 23906, note: 'Kondisi normal' },
      { id: 3, date: '2026-08-13', coopId: 'KD-01', opening: 23861, mortality: 9, culled: 0, closing: 23852, note: 'Kondisi normal' },
      { id: 4, date: '2026-08-13', coopId: 'KD-02', opening: 23922, mortality: 8, culled: 0, closing: 23914, note: 'Kondisi normal' },
    ],
    feedStocks: [
      { code: 'BR-1', name: 'Starter Crumble', phase: 'Umur 1–14 hari', stock: 4800, minimum: 3000, lastDelivery: '02 Agu 2026' },
      { code: 'BR-2', name: 'Finisher Pellet', phase: 'Umur 15–panen', stock: 23600, minimum: 30000, lastDelivery: '09 Agu 2026' },
    ],
    feedMovements: [
      { id: 1, date: '2026-08-14', type: 'Keluar', feedCode: 'BR-2', coopId: 'KD-01', amount: 3120, note: 'Distribusi pagi' },
      { id: 2, date: '2026-08-14', type: 'Keluar', feedCode: 'BR-2', coopId: 'KD-02', amount: 3080, note: 'Distribusi pagi' },
      { id: 3, date: '2026-08-09', type: 'Masuk', feedCode: 'BR-2', coopId: 'GUDANG', amount: 30000, note: 'PO-2026-081' },
    ],
    healthRecords: [
      { id: 1, date: '2026-08-14', coopId: 'ALL', type: 'Observasi', product: 'Pemeriksaan pagi', status: 'Selesai', note: 'Nafsu makan dan aktivitas normal' },
      { id: 2, date: '2026-08-15', coopId: 'ALL', type: 'Vitamin', product: 'Vitamin C + elektrolit', status: 'Terjadwal', note: 'Pemberian pukul 07:00' },
      { id: 3, date: '2026-08-18', coopId: 'ALL', type: 'Sampling', product: 'Timbang mingguan', status: 'Terjadwal', note: '100 ekor per kandang' },
    ],
    checklist: [
      { id: 'water', label: 'Periksa sumber air', done: true },
      { id: 'front-area', label: 'Bersihkan area depan', done: true },
      { id: 'alarm', label: 'Cek alarm & genset', done: true },
      { id: 'temperature', label: 'Catat suhu pagi', done: true },
      { id: 'scale', label: 'Kalibrasi timbangan', done: true },
      { id: 'litter', label: 'Cek litter sore', done: false },
    ],
  }
}

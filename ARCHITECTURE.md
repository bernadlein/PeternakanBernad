# Arsitektur FarmFlow

FarmFlow menggunakan arsitektur berlapis agar aturan bisnis tidak menempel pada komponen Vue dan setiap bagian dapat dikembangkan secara independen.

## Aliran dependensi

```text
Pages / Components
        ↓
Pinia Stores / Composables
        ↓
Domain Services + Selectors
        ↓
Repository Interface
        ↓
LocalStorage sekarang / API + PostgreSQL nanti
```

Lapisan bawah tidak mengimpor UI. Komponen hanya membaca state, memformat tampilan, dan memanggil action.

## Struktur

| Folder | Tanggung jawab |
| --- | --- |
| `app/pages` | Halaman per modul dan deklarasi route |
| `app/components` | Komponen presentasi dan layout |
| `app/stores` | State aplikasi dan orkestrasi use-case |
| `app/services` | Aturan bisnis murni, kalkulasi, transaksi, dan laporan |
| `app/repositories` | Kontrak serta implementasi akses data |
| `app/domain` | Tipe, konstanta, dan data awal domain |
| `app/composables` | State/form UI dan adapter fitur browser |
| `app/utils` | Fungsi format generik tanpa state |
| `tests` | Unit test aturan bisnis |

## Prinsip yang dijaga

1. **UI tidak memiliki aturan transaksi.** Pencatatan mortalitas, validasi stok, dan perubahan data dilakukan oleh `farm.service.ts`.
2. **Satu sumber kebenaran.** Semua halaman membaca state melalui `farm.store.ts`.
3. **Persistence dapat diganti.** Store hanya mengenal kontrak `FarmRepository`. Implementasi saat ini menggunakan `localStorage`.
4. **Service dapat dites tanpa browser.** Fungsi bisnis menerima state dan mengembalikan state baru tanpa mengubah input.
5. **Modul dapat berkembang sendiri.** Populasi, pakan, kesehatan, kandang, dan laporan memiliki route terpisah.
6. **Data lama dimigrasikan.** Repository membaca key versi sebelumnya dan menormalkan skema sebelum disimpan ke versi terbaru.

## Migrasi ke backend

Saat database dibutuhkan, buat implementasi baru seperti `ApiFarmRepository` yang memenuhi `FarmRepository`, lalu gunakan implementasi tersebut di store. Komponen dan service domain tidak perlu diubah.

Untuk skala produksi disarankan:

- API Nuxt pada `server/api`;
- PostgreSQL dengan migration;
- autentikasi dan role admin/operator;
- audit log append-only;
- optimistic locking untuk mencegah konflik pencatatan;
- validasi payload pada boundary API;
- unit test service dan integration test repository.

# FarmFlow Ayam

Sistem administrasi peternakan broiler untuk dua kandang berkapasitas masing-masing 24.000 ekor. Dibangun dengan Nuxt 4, Vue 3, Pinia, Tailwind CSS 4, dan arsitektur berlapis.

## Fitur

- Dashboard populasi, bobot, stok pakan, FCR, dan indikator kandang
- Administrasi populasi serta mortalitas
- Persediaan, penerimaan, dan distribusi pakan
- Monitoring lingkungan serta checklist kandang
- Program kesehatan dan observasi
- Form aktivitas terpadu
- Laporan CSV per modul
- Penyimpanan otomatis pada perangkat
- Tampilan desktop dan ponsel

## Arsitektur

Aturan bisnis tidak berada di komponen Vue. Alurnya:

```text
UI → Pinia Store → Domain Service → Repository → Storage
```

- UI hanya menampilkan data dan mengirim intent.
- Pinia mengelola state serta orkestrasi use-case.
- Service menangani aturan mortalitas, pakan, metrik, dan laporan.
- Repository mengisolasi penyimpanan dan dapat diganti dengan API/database.
- Unit test menguji aturan bisnis tanpa browser.

Lihat [ARCHITECTURE.md](./ARCHITECTURE.md) untuk penjelasan lengkap.

## Menjalankan lokal

Gunakan Node.js 20 atau lebih baru.

```bash
npm install
npm run dev
```

Validasi sebelum deploy:

```bash
npm test
npm run build
```

## Upload ke GitHub

Ekstrak paket, buka folder proyek, lalu jalankan:

```bash
git init
git add .
git commit -m "Initial FarmFlow Ayam"
git branch -M main
git remote add origin https://github.com/USERNAME/farmflow-ayam.git
git push -u origin main
```

Anda juga dapat menggunakan menu **Add file → Upload files** di GitHub. Jangan unggah `node_modules`, `.nuxt`, `.output`, atau `.vercel`.

## Deploy ke Vercel

1. Pilih **Add New → Project** di Vercel.
2. Pilih repository GitHub FarmFlow.
3. Gunakan Framework Preset **Nuxt.js**.
4. Gunakan Build Command `npm run build`.
5. Tidak ada environment variable untuk versi local-storage.
6. Klik **Deploy**.

## Upgrade ke database

Versi ini menggunakan implementasi `LocalStorageFarmRepository`. Untuk multi-user, buat implementasi repository berbasis API lalu hubungkan ke PostgreSQL. UI dan service domain tidak perlu ditulis ulang.

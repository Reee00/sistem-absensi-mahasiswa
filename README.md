# 📋 Sistem Absensi Mahasiswa

Platform manajemen kehadiran mahasiswa terintegrasi

## Fitur Utama

### 1. Manajemen Data Mahasiswa
- **Input data mahasiswa**:
  - NIM (Nomor Induk Mahasiswa)
  - Nama lengkap
  - Jurusan/Program studi
- CRUD operations (Create, Read, Update, Delete)
- Validasi data input
- Database mahasiswa terorganisir

### 2. Input Absensi
- **Status kehadiran**:
  - ✅ Hadir
  - 📝 Izin
  - ❌ Alpha
- Input berbasis tanggal
- Pilih mahasiswa dari list
- Quick input dengan dropdown
- Validasi duplicate entry

### 3. Rekap Absensi
- **Data lengkap**:
  - Nama mahasiswa
  - Tanggal absensi
  - Status kehadiran
- **Filter dan pencarian**:
  - Filter by date range
  - Search by nama
  - Filter by status
- Clear filter button

### 4. Export Data
- **Export ke CSV**:
  - Semua data absensi
  - Filtered data
  - Compatible dengan Excel
  - Include timestamp

### 5. Statistik Kehadiran
- Persentase kehadiran per mahasiswa
- Total hadir/izin/alpha
- Grafik visualisasi (optional)
- Summary report

## Teknologi
- Frontend: HTML5, CSS3, JavaScript
- Storage: LocalStorage
- Export: CSV generation
- UI Framework: Custom CSS

## Cara Penggunaan

### 1. Tambah Mahasiswa:
- Buka tab "Data Mahasiswa"
- Isi NIM, Nama, dan Jurusan
- Klik "Tambah Mahasiswa"

### 2. Input Absensi:
- Pilih mahasiswa dari dropdown
- Pilih status (Hadir/Izin/Alpha)
- Klik "Simpan Absensi"

### 3. Lihat Rekap:
- Buka tab "Rekap Absensi"
- Gunakan filter untuk pencarian spesifik
- Export data jika diperlukan

### 4. Export Data:
- Klik tombol "Export CSV"
- File CSV otomatis ter-download
- Buka dengan Excel atau Google Sheets

## Antarmuka
- Tab-based navigation
- Clean table layout
- Form validation feedback
- Responsive design
- Mobile-friendly

## 📊 Manajemen Data
- **Actions per entry**:
  - Edit data
  - Hapus data
  - Lihat detail
- Bulk delete option
- Konfirmasi sebelum hapus

## Validasi
- NIM harus unique
- Nama tidak boleh kosong
- Prevent duplicate absensi
- Date validation

## Use Cases
- Dosen untuk absensi kelas
- Admin untuk tracking kehadiran
- Mahasiswa untuk self-check
- Laporan ke akademik

## Demo
```
https://reee00.github.io/sistem-absensi-mahasiswa/
```

## Fitur Tambahan
- Auto backup data
- Print-friendly layout
- Notification untuk absensi
- Integration ready (API)

## Catatan
- Data tersimpan di browser
- Backup secara berkala
- Clear cache = data hilang
- Export untuk arsip

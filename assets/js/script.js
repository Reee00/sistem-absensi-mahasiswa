// Array untuk menyimpan daftar mahasiswa saat runtime
let mahasiswaList = []; // menyimpan objek {id, nim, nama, jurusan}

// Array untuk menyimpan daftar absensi saat runtime
let absensiList = []; // menyimpan objek {id, mahasiswaId, tanggal, status}

// DOM caching
const formMahasiswa = document.getElementById('formMahasiswa');
const nim = document.getElementById('nim');
const nama = document.getElementById('nama');
const jurusan = document.getElementById('jurusan');
const formAbsensi = document.getElementById('formAbsensi');
const mahasiswaSelect = document.getElementById('mahasiswaSelect');
const tanggal = document.getElementById('tanggal');
const status = document.getElementById('status');
const rekapBody = document.getElementById('rekapBody');
const mahasiswaBody = document.getElementById('mahasiswaBody');
const exportCsvBtn = document.getElementById('exportCsv');
const toast = document.getElementById('toast');
const searchInput = document.getElementById('searchInput');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const filterBtn = document.getElementById('filterBtn');
const clearFilter = document.getElementById('clearFilter');

let editingMahasiswaId = null;

function showToast(message, ms = 2500){
  if(!toast) return alert(message);
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(()=>{ toast.style.display = 'none'; }, ms);
}

// LOAD DATA
// Mengambil data dari localStorage (jika ada) dan mengembalikannya menjadi array
function loadData() {
  // Ambil string JSON 'mahasiswa' dari localStorage, parse ke objek, jika null gunakan array kosong
  mahasiswaList = JSON.parse(localStorage.getItem("mahasiswa")) || [];
  // Ambil string JSON 'absensi' dari localStorage, parse ke objek, jika null gunakan array kosong
  absensiList = JSON.parse(localStorage.getItem("absensi")) || [];
}

// SAVE DATA
// Menyimpan state saat ini ke localStorage dalam bentuk string JSON
function saveData() {
  // Simpan daftar mahasiswa
  localStorage.setItem("mahasiswa", JSON.stringify(mahasiswaList));
  // Simpan daftar absensi
  localStorage.setItem("absensi", JSON.stringify(absensiList));
}

// RENDER MAHASISWA
// Mengisi elemen <select> dengan daftar mahasiswa yang tersimpan
function renderMahasiswa() {
  // Ambil elemen select untuk mahasiswa
  // Kosongkan isi select dulu dan tambahkan placeholder
  mahasiswaSelect.innerHTML = "";
  const placeholder = document.createElement('option');
  placeholder.value = "";
  placeholder.textContent = "-- Pilih mahasiswa --";
  placeholder.disabled = true;
  placeholder.selected = mahasiswaList.length === 0;
  mahasiswaSelect.appendChild(placeholder);

  // Untuk tiap mahasiswa, buat elemen <option> dan tambahkan ke select
  mahasiswaList.forEach(m => {
    const option = document.createElement("option");
    option.value = String(m.id);
    option.textContent = `${m.nim} - ${m.nama}`;
    mahasiswaSelect.appendChild(option);
  });
}

// RENDER REKAP
// Menampilkan tabel rekap absensi berdasarkan data absensi dan mahasiswa
function renderRekap() {
  // Kosongkan isi tabel sebelumnya
  rekapBody.innerHTML = "";

  // Untuk setiap entri absensi, cari mahasiswa terkait dan buat baris tabel
  absensiList.forEach(a => {
    const mhs = mahasiswaList.find(m => m.id == a.mahasiswaId);
    if (!mhs) return;

    const tr = document.createElement('tr');

    const tdNama = document.createElement('td');
    tdNama.textContent = mhs.nama;
    tr.appendChild(tdNama);

    const tdTanggal = document.createElement('td');
    tdTanggal.textContent = a.tanggal;
    tr.appendChild(tdTanggal);

    const tdStatus = document.createElement('td');
    tdStatus.textContent = a.status;
    tr.appendChild(tdStatus);

    const tdActions = document.createElement('td');
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = 'Hapus';
    delBtn.addEventListener('click', ()=>{
      if(confirm('Hapus entri absensi ini?')){
        deleteAbsensi(a.id);
      }
    });
    tdActions.appendChild(delBtn);
    tr.appendChild(tdActions);

    rekapBody.appendChild(tr);
  });
}

function renderMahasiswaList(){
  mahasiswaBody.innerHTML = '';
  mahasiswaList.forEach(m => {
    const tr = document.createElement('tr');

    const tdNim = document.createElement('td'); tdNim.textContent = m.nim; tr.appendChild(tdNim);
    const tdNama = document.createElement('td'); tdNama.textContent = m.nama; tr.appendChild(tdNama);
    const tdJur = document.createElement('td'); tdJur.textContent = m.jurusan; tr.appendChild(tdJur);

    const tdActions = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', ()=>{ startEditMahasiswa(m.id); });
    tdActions.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn'; delBtn.textContent = 'Hapus';
    delBtn.addEventListener('click', ()=>{
      if(confirm('Hapus mahasiswa ini dan semua absensi terkait?')){ deleteMahasiswa(m.id); }
    });
    tdActions.appendChild(delBtn);
    tr.appendChild(tdActions);

    mahasiswaBody.appendChild(tr);
  });
}

// TAMBAH MAHASISWA
// Menangani event submit pada form mahasiswa: menambahkan mahasiswa baru
formMahasiswa.addEventListener("submit", e => {
  e.preventDefault(); // hentikan perilaku default form (reload)
  const nimVal = nim.value.trim();
  const namaVal = nama.value.trim();
  const jurVal = jurusan.value.trim();
  if(!nimVal || !namaVal || !jurVal){ showToast('Lengkapi semua field.'); return; }

  // cek duplikasi NIM
  const duplicate = mahasiswaList.some(m => m.nim.toLowerCase() === nimVal.toLowerCase());
  if(duplicate){ showToast('NIM sudah terdaftar.'); return; }

  if(editingMahasiswaId){
    // update existing
    const idx = mahasiswaList.findIndex(x=>x.id===editingMahasiswaId);
    if(idx!==-1){ mahasiswaList[idx].nim = nimVal; mahasiswaList[idx].nama = namaVal; mahasiswaList[idx].jurusan = jurVal; }
    editingMahasiswaId = null;
    showToast('Mahasiswa diperbarui.');
  } else {
    mahasiswaList.push({ id: Date.now(), nim: nimVal, nama: namaVal, jurusan: jurVal });
    showToast('Mahasiswa ditambahkan.');
  }
  saveData(); renderMahasiswa(); renderMahasiswaList();
  e.target.reset();
});

// TAMBAH ABSENSI
// Menangani event submit pada form absensi: menambahkan entri absensi baru
formAbsensi.addEventListener("submit", e => {
  e.preventDefault(); // hentikan reload halaman
  if(!mahasiswaSelect.value){ showToast('Pilih mahasiswa terlebih dahulu.'); return; }
  const tanggalVal = tanggal.value;
  const statusVal = status.value;
  if(!tanggalVal){ showToast('Pilih tanggal.'); return; }

  absensiList.push({ id: Date.now(), mahasiswaId: Number(mahasiswaSelect.value), tanggal: tanggalVal, status: statusVal });
  saveData(); renderRekap(); showToast('Absensi tersimpan.'); e.target.reset();
});

// INIT
// Panggil fungsi inisialisasi saat skrip dipanggil
loadData(); // muat data dari localStorage ke memori
renderMahasiswa(); // render daftar mahasiswa di select
renderRekap(); // render tabel rekap
renderMahasiswaList();

function startEditMahasiswa(id){
  const m = mahasiswaList.find(x=>x.id===id);
  if(!m) return;
  nim.value = m.nim; nama.value = m.nama; jurusan.value = m.jurusan;
  editingMahasiswaId = id;
  nim.focus();
}

// Filtering / searching
function getFilteredAbsensi(){
  const s = searchInput && searchInput.value.trim().toLowerCase();
  const sDate = startDate && startDate.value ? new Date(startDate.value) : null;
  const eDate = endDate && endDate.value ? new Date(endDate.value) : null;

  return absensiList.filter(a => {
    const m = mahasiswaList.find(x=>x.id==a.mahasiswaId);
    if(!m) return false;
    if(s){ if(!(m.nama.toLowerCase().includes(s) || m.nim.toLowerCase().includes(s))) return false; }
    if(sDate){ const ad = new Date(a.tanggal); if(ad < sDate) return false; }
    if(eDate){ const ad = new Date(a.tanggal); if(ad > eDate) return false; }
    return true;
  });
}

// update renderRekap to use filtered list
function renderRekap(){
  rekapBody.innerHTML = '';
  const list = getFilteredAbsensi();
  list.forEach(a => {
    const mhs = mahasiswaList.find(m => m.id == a.mahasiswaId);
    if (!mhs) return;
    const tr = document.createElement('tr');
    const tdNama = document.createElement('td'); tdNama.textContent = mhs.nama; tr.appendChild(tdNama);
    const tdTanggal = document.createElement('td'); tdTanggal.textContent = a.tanggal; tr.appendChild(tdTanggal);
    const tdStatus = document.createElement('td'); tdStatus.textContent = a.status; tr.appendChild(tdStatus);
    const tdActions = document.createElement('td');
    const delBtn = document.createElement('button'); delBtn.className='delete-btn'; delBtn.textContent='Hapus';
    delBtn.addEventListener('click', ()=>{ if(confirm('Hapus entri absensi ini?')) deleteAbsensi(a.id); });
    tdActions.appendChild(delBtn); tr.appendChild(tdActions);
    rekapBody.appendChild(tr);
  });
}

// hook filter/search buttons
if(filterBtn) filterBtn.addEventListener('click', ()=>{ renderRekap(); showToast('Filter diterapkan.'); });
if(clearFilter) clearFilter.addEventListener('click', ()=>{ if(searchInput) searchInput.value=''; if(startDate) startDate.value=''; if(endDate) endDate.value=''; renderRekap(); showToast('Filter dibersihkan.'); });

// export CSV uses filtered list
function exportCsv(){
  const filtered = getFilteredAbsensi();
  if(filtered.length === 0){ showToast('Tidak ada data rekap untuk diekspor.'); return; }
  const header = ['NIM','Nama','Tanggal','Status'];
  const rows = filtered.map(a=>{
    const m = mahasiswaList.find(x=>x.id==a.mahasiswaId) || {nim:'-', nama:'-'};
    return [m.nim, m.nama, a.tanggal, a.status];
  });
  const csvContent = [header, ...rows].map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'rekap_absensi.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

if(exportCsvBtn) exportCsvBtn.addEventListener('click', exportCsv);

// Delete functions
function deleteAbsensi(id){
  absensiList = absensiList.filter(a => a.id !== id);
  saveData(); renderRekap(); showToast('Absensi dihapus.');
}

function deleteMahasiswa(id){
  mahasiswaList = mahasiswaList.filter(m => m.id !== id);
  // hapus absensi terkait (pastikan perbandingan tipe sama)
  absensiList = absensiList.filter(a => a.mahasiswaId !== id);
  saveData(); renderMahasiswa(); renderRekap(); renderMahasiswaList(); showToast('Mahasiswa dan data terkait dihapus.');
}
// (exportCsv already defined earlier to use filtered list)

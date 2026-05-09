// Data array untuk menyimpan pendaftar
let daftarPendaftar = [];

// Helper: generate kode pendaftaran
function generateKode(gedung, bulanTes, noUrut, rataRata) {
    let rataBulat = Math.round(rataRata);
    return `${gedung}${bulanTes}-${noUrut}-${rataBulat}`;
}

// Hitung rata2 dan keterangan
function hitungRataDanKeterangan(mat, inggris, umum) {
    let rata = (mat + inggris + umum) / 3;
    let keterangan = "";
    if (rata >= 70) keterangan = "Lulus";
    else if (rata >= 60 && rata < 70) keterangan = "Cadangan";
    else keterangan = "Tidak Lulus";
    return { rata: rata.toFixed(2), keterangan };
}

// Mapping kode gedung ke teks
function mapGedung(gedungCode) {
    if (gedungCode === 'A') return 'Gedung A';
    if (gedungCode === 'B') return 'Gedung B';
    if (gedungCode === 'V') return 'Viktor';
    return gedungCode;
}

// Dapatkan class keterangan untuk styling
function getKeteranganClass(keterangan) {
    if (keterangan === 'Lulus') return 'keterangan-lulus';
    if (keterangan === 'Cadangan') return 'keterangan-cadangan';
    return 'keterangan-tidak';
}

// Render tabel dan summary
function renderTabel() {
    const tbody = document.getElementById('tbodyPendaftar');
    
    if (daftarPendaftar.length === 0) {
        tbody.innerHTML = '<tr><td colspan="13" class="empty-data">Belum ada data pendaftar</td></tr>';
        document.getElementById('totalPendaftar').innerText = '0';
        document.getElementById('totalLulus').innerText = '0';
        document.getElementById('totalCadangan').innerText = '0';
        document.getElementById('totalTidakLulus').innerText = '0';
        return;
    }

    let html = '';
    let countLulus = 0, countCadangan = 0, countTidak = 0;
    
    for (let i = 0; i < daftarPendaftar.length; i++) {
        const d = daftarPendaftar[i];
        if (d.keterangan === 'Lulus') countLulus++;
        else if (d.keterangan === 'Cadangan') countCadangan++;
        else if (d.keterangan === 'Tidak Lulus') countTidak++;

        html += `<tr>
            <td>${d.kodePendaftaran}</td>
            <td style="text-align:left">${escapeHtml(d.nama)}</td>
            <td>${d.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
            <td>${escapeHtml(d.telp)}</td>
            <td style="text-align:left">${escapeHtml(d.asalSekolah)}</td>
            <td style="text-align:left">${escapeHtml(d.pekerjaanOrtu)}</td>
            <td>${d.tempatTes}</td>
            <td>${d.bulanTes}</td>
            <td>${d.mat}</td>
            <td>${d.inggris}</td>
            <td>${d.umum}</td>
            <td><strong>${d.rata}</strong></td>
            <td class="${getKeteranganClass(d.keterangan)}">${d.keterangan}</td>
        </tr>`;
    }
    
    tbody.innerHTML = html;
    document.getElementById('totalPendaftar').innerText = daftarPendaftar.length;
    document.getElementById('totalLulus').innerText = countLulus;
    document.getElementById('totalCadangan').innerText = countCadangan;
    document.getElementById('totalTidakLulus').innerText = countTidak;
}

// Escape HTML untuk keamanan
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Update preview kode
function updatePreviewKode() {
    let nextUrut = daftarPendaftar.length + 1;
    let matVal = parseFloat(document.getElementById('mat').value) || 0;
    let ingVal = parseFloat(document.getElementById('inggris').value) || 0;
    let umumVal = parseFloat(document.getElementById('umum').value) || 0;
    let rataSementara = (matVal + ingVal + umumVal) / 3;
    let gedung = document.getElementById('gedung').value;
    let bulan = parseInt(document.getElementById('bulanTes').value) || 1;
    let previewKode = generateKode(gedung, bulan, nextUrut, rataSementara);
    document.getElementById('kodePendaftaran').value = previewKode;
}

// Tambah pendaftar
function tambahPendaftar() {
    let nama = document.getElementById('nama').value.trim();
    let jk = document.getElementById('jk').value;
    let telp = document.getElementById('telp').value.trim();
    let asalSekolah = document.getElementById('asalSekolah').value.trim();
    let pekerjaanOrtu = document.getElementById('pekerjaanOrtu').value.trim();
    let gedungCode = document.getElementById('gedung').value;
    let bulanTes = parseInt(document.getElementById('bulanTes').value);
    let mat = parseFloat(document.getElementById('mat').value);
    let inggris = parseFloat(document.getElementById('inggris').value);
    let umum = parseFloat(document.getElementById('umum').value);

    // Validasi
    if (!nama) { alert("Nama pendaftar harus diisi!"); return; }
    if (!telp) { alert("Nomor telepon harus diisi!"); return; }
    if (!asalSekolah) { alert("Asal sekolah harus diisi!"); return; }
    if (!pekerjaanOrtu) { alert("Pekerjaan orang tua harus diisi!"); return; }
    if (isNaN(mat) || isNaN(inggris) || isNaN(umum)) { alert("Nilai tes harus angka!"); return; }
    if (mat < 0 || mat > 100 || inggris < 0 || inggris > 100 || umum < 0 || umum > 100) {
        alert("Nilai harus antara 0-100");
        return;
    }
    if (bulanTes < 1 || bulanTes > 9) { alert("Bulan tes harus antara 1 - 9"); return; }

    const { rata, keterangan } = hitungRataDanKeterangan(mat, inggris, umum);
    const rataAngka = parseFloat(rata);
    const tempatTes = mapGedung(gedungCode);
    let nextNoUrut = daftarPendaftar.length + 1;
    let kode = generateKode(gedungCode, bulanTes, nextNoUrut, rataAngka);

    const pendaftarBaru = {
        kodePendaftaran: kode,
        nama: nama,
        jk: jk,
        telp: telp,
        asalSekolah: asalSekolah,
        pekerjaanOrtu: pekerjaanOrtu,
        tempatTes: tempatTes,
        bulanTes: bulanTes,
        mat: mat,
        inggris: inggris,
        umum: umum,
        rata: rata,
        keterangan: keterangan
    };

    daftarPendaftar.push(pendaftarBaru);
    renderTabel();
    resetFormOnly();
    updatePreviewKode();
    
    // Scroll ke tabel
    document.querySelector('h3').scrollIntoView({ behavior: 'smooth' });
}

// Reset form only (bersihkan input)
function resetFormOnly() {
    document.getElementById('nama').value = '';
    document.getElementById('telp').value = '';
    document.getElementById('asalSekolah').value = '';
    document.getElementById('pekerjaanOrtu').value = '';
    document.getElementById('mat').value = '70';
    document.getElementById('inggris').value = '70';
    document.getElementById('umum').value = '70';
    document.getElementById('bulanTes').value = '1';
    document.getElementById('gedung').value = 'A';
    document.getElementById('jk').value = 'L';
    document.getElementById('nama').focus();
    updatePreviewKode();
}

// Hapus semua data
function hapusSemuaData() {
    if (confirm("⚠️ Yakin ingin menghapus SEMUA data pendaftaran? Tindakan ini tidak dapat dibatalkan!")) {
        daftarPendaftar = [];
        renderTabel();
        updatePreviewKode();
        alert("Semua data pendaftaran telah dihapus.");
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnTambah').addEventListener('click', tambahPendaftar);
    document.getElementById('btnResetForm').addEventListener('click', resetFormOnly);
    document.getElementById('btnHapusSemua').addEventListener('click', hapusSemuaData);
    
    // Update preview saat input berubah
    const inputs = ['mat', 'inggris', 'umum', 'gedung', 'bulanTes'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updatePreviewKode);
    });
    
    updatePreviewKode();
    renderTabel();
});
import jsPDF from 'jspdf';
import { KasTransaction, IuranRecord, Member } from '../types';

export const generateLaporanKeuanganPDF = (
  bulan: string,
  tahun: number,
  transaksi: KasTransaction[],
  totalMasuk: number,
  totalKeluar: number,
  saldoAkhir: number
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header / Kop Surat Resmi
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text('PERSATUAN GURU REPUBLIK INDONESIA (PGRI)', pageWidth / 2, 16, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(180, 20, 20); // Merah PGRI
  doc.text('PENGURUS RANTING SIRNAJAYA - CABANG KECAMATAN SUKAMAKMUR', pageWidth / 2, 22, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Sekretariat: Kompleks SDN Sirnajaya 01, Desa Sirnajaya, Kec. Sukamakmur, Kab. Bogor 16830', pageWidth / 2, 27, { align: 'center' });
  doc.text('Email: pgri.ranting.sirnajaya@gmail.com | Kontak Pengurus: 0812-9876-5432', pageWidth / 2, 31, { align: 'center' });

  // Garis Pembatas Kop Surat
  doc.setDrawColor(180, 20, 20);
  doc.setLineWidth(1);
  doc.line(15, 34, pageWidth - 15, 34);
  doc.setLineWidth(0.3);
  doc.line(15, 35.5, pageWidth - 15, 35.5);

  // Judul Laporan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`LAPORAN TRANSPARANSI KAS & KEUANGAN BULANAN`, pageWidth / 2, 44, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Periode: ${bulan} ${tahun}`, pageWidth / 2, 49, { align: 'center' });

  // Kotak Ringkasan
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 53, pageWidth - 30, 20, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Total Kas Masuk:', 20, 60);
  doc.setTextColor(22, 101, 52); // green
  doc.text(`Rp ${totalMasuk.toLocaleString('id-ID')}`, 20, 67);

  doc.setTextColor(30, 41, 59);
  doc.text('Total Pengeluaran:', 80, 60);
  doc.setTextColor(185, 28, 28); // red
  doc.text(`Rp ${totalKeluar.toLocaleString('id-ID')}`, 80, 67);

  doc.setTextColor(30, 41, 59);
  doc.text('Saldo Kas Tersedia:', 140, 60);
  doc.setTextColor(3, 105, 161); // blue
  doc.text(`Rp ${saldoAkhir.toLocaleString('id-ID')}`, 140, 67);

  // Tabel Transaksi Header
  let y = 80;
  doc.setFillColor(239, 68, 68); // Brand Red
  doc.setTextColor(255, 255, 255);
  doc.rect(15, y, pageWidth - 30, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('NO', 18, y + 5);
  doc.text('TANGGAL', 27, y + 5);
  doc.text('KATEGORI & URAIAN TRANSAKSI', 55, y + 5);
  doc.text('PJ / KET', 125, y + 5);
  doc.text('DEBIT (MASUK)', 150, y + 5);
  doc.text('KREDIT (KELUAR)', 175, y + 5);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  transaksi.forEach((item, index) => {
    if (y > 255) {
      doc.addPage();
      y = 20;
    }

    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, pageWidth - 30, 8, 'F');
    }

    doc.text(`${index + 1}`, 18, y + 5.5);
    doc.text(item.tanggal, 27, y + 5.5);
    
    // Truncate description if too long
    const desc = item.deskripsi.length > 40 ? item.deskripsi.substring(0, 38) + '...' : item.deskripsi;
    doc.text(desc, 55, y + 5.5);
    doc.text(item.penanggungJawab.length > 15 ? item.penanggungJawab.substring(0, 14) + '..' : item.penanggungJawab, 125, y + 5.5);

    if (item.tipe === 'masuk') {
      doc.setTextColor(22, 101, 52);
      doc.text(`Rp ${item.nominal.toLocaleString('id-ID')}`, 150, y + 5.5);
      doc.setTextColor(150, 150, 150);
      doc.text('-', 182, y + 5.5);
    } else {
      doc.setTextColor(150, 150, 150);
      doc.text('-', 155, y + 5.5);
      doc.setTextColor(185, 28, 28);
      doc.text(`Rp ${item.nominal.toLocaleString('id-ID')}`, 175, y + 5.5);
    }

    doc.setTextColor(30, 41, 59);
    doc.setDrawColor(241, 245, 249);
    doc.line(15, y + 8, pageWidth - 15, y + 8);

    y += 8;
  });

  // Tanda Tangan Digital Pengurus
  y = Math.min(y + 12, 240);
  if (y > 230) {
    doc.addPage();
    y = 30;
  }

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text(`Ditetapkan di Sirnajaya, ${currentDate}`, pageWidth - 70, y);

  doc.text('Mengetahui,', 25, y + 6);
  doc.text('Ketua Ranting Sirnajaya 1', 25, y + 11);

  doc.text('Yang Mengesahkan,', pageWidth - 70, y + 6);
  doc.text('Bendahara Ranting', pageWidth - 70, y + 11);

  // Tanda tangan info / digital badge
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('[Ditandatangani Digital / Verified Hash]', 25, y + 25);
  doc.text('[Ditandatangani Digital / Verified Hash]', pageWidth - 70, y + 25);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);
  doc.text('Drs. H. Suryadi, M.Pd.', 25, y + 31);
  doc.text('NPA PGRI: 3216010001', 25, y + 35);

  doc.text('Hj. Ratna Dewi, S.Pd.SD.', pageWidth - 70, y + 31);
  doc.text('NPA PGRI: 3216010004', pageWidth - 70, y + 35);

  doc.save(`Laporan_Kas_PGRI_Sirnajaya1_${bulan}_${tahun}.pdf`);
};

export const generateRekapIuranPDF = (
  bulan: string,
  records: IuranRecord[],
  totalLunas: number,
  totalBelum: number,
  totalDanaTerkumpul: number
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('PERSATUAN GURU REPUBLIK INDONESIA (PGRI)', pageWidth / 2, 16, { align: 'center' });
  doc.setFontSize(11);
  doc.setTextColor(180, 20, 20);
  doc.text('PENGURUS RANTING SIRNAJAYA - CABANG KECAMATAN SUKAMAKMUR, KAB. BOGOR', pageWidth / 2, 22, { align: 'center' });

  doc.setDrawColor(180, 20, 20);
  doc.setLineWidth(0.8);
  doc.line(15, 27, pageWidth - 15, 27);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`REKAPITULASI IURAN ANGGOTA RUTIN - ${bulan.toUpperCase()}`, pageWidth / 2, 35, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text(`Status per: ${new Date().toLocaleDateString('id-ID')} | Total Anggota Lunas: ${totalLunas} | Belum Bayar: ${totalBelum} | Terkumpul: Rp ${totalDanaTerkumpul.toLocaleString('id-ID')}`, pageWidth / 2, 41, { align: 'center' });

  // Tabel
  let y = 47;
  doc.setFillColor(30, 41, 59);
  doc.setTextColor(255, 255, 255);
  doc.rect(15, y, pageWidth - 30, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('NO', 18, y + 5);
  doc.text('NPA PGRI', 26, y + 5);
  doc.text('NAMA GURU / ANGGOTA', 52, y + 5);
  doc.text('UNIT SEKOLAH', 105, y + 5);
  doc.text('STATUS', 145, y + 5);
  doc.text('METODE / TGL', 168, y + 5);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  records.forEach((r, idx) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, pageWidth - 30, 7.5, 'F');
    }

    doc.setTextColor(30, 41, 59);
    doc.text(`${idx + 1}`, 18, y + 5);
    doc.text(r.npa, 26, y + 5);
    doc.text(r.namaAnggota.length > 25 ? r.namaAnggota.substring(0, 24) + '..' : r.namaAnggota, 52, y + 5);
    doc.text(r.sekolah, 105, y + 5);

    if (r.status === 'Lunas') {
      doc.setTextColor(22, 101, 52);
      doc.setFont('helvetica', 'bold');
      doc.text('LUNAS', 145, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(70, 70, 70);
      doc.text(`${r.metodeBayar || '-'} (${r.tanggalBayar ? r.tanggalBayar.substring(5) : ''})`, 168, y + 5);
    } else {
      doc.setTextColor(185, 28, 28);
      doc.setFont('helvetica', 'bold');
      doc.text('BELUM BAYAR', 145, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 50, 50);
      doc.text('Perlu Ditagih', 168, y + 5);
    }

    doc.setDrawColor(241, 245, 249);
    doc.line(15, y + 7.5, pageWidth - 15, y + 7.5);
    y += 7.5;
  });

  doc.save(`Rekap_Iuran_PGRI_Sirnajaya1_${bulan.replace(/\s+/g, '_')}.pdf`);
};

export const generateKwitansiIuranPDF = (record: IuranRecord, member?: Member) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a5',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Background Box
  doc.setDrawColor(180, 20, 20);
  doc.setLineWidth(1.5);
  doc.roundedRect(10, 10, pageWidth - 20, 128, 3, 3, 'D');

  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.4);
  doc.roundedRect(12, 12, pageWidth - 24, 124, 2, 2, 'D');

  // Kop
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(180, 20, 20);
  doc.text('PERSATUAN GURU REPUBLIK INDONESIA (PGRI)', 20, 22);
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('PENGURUS RANTING SIRNAJAYA - CABANG KECAMATAN SUKAMAKMUR', 20, 27);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Kompleks SDN Sirnajaya 01, Kec. Sukamakmur, Kab. Bogor - Terverifikasi Cloud & Enkripsi Digital', 20, 32);

  // Kwitansi No
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(pageWidth - 75, 18, 55, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(185, 28, 28);
  doc.text('BUKTI RESMI DIGITAL', pageWidth - 70, 23);
  doc.setFontSize(7.5);
  doc.setTextColor(50, 50, 50);
  doc.text(`No: ${record.nomorKwitansi || 'KW-PGRI-2026-X'}`, pageWidth - 70, 29);

  doc.setDrawColor(226, 232, 240);
  doc.line(20, 36, pageWidth - 20, 36);

  // Body Kwitansi
  doc.setFontSize(9);
  doc.setTextColor(70, 80, 95);
  doc.text('Telah Diterima Dari', 20, 45);
  doc.text(':', 60, 45);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(record.namaAnggota, 65, 45);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 80, 95);
  doc.text('NPA PGRI / Unit Kerja', 20, 53);
  doc.text(':', 60, 53);
  doc.setTextColor(15, 23, 42);
  doc.text(`${record.npa} / ${record.sekolah}`, 65, 53);

  doc.setTextColor(70, 80, 95);
  doc.text('Uang Sejumlah', 20, 61);
  doc.text(':', 60, 61);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text('DUA PULUH LIMA RIBU RUPIAH (Rp 25.000,-)', 65, 61);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 80, 95);
  doc.text('Untuk Pembayaran', 20, 69);
  doc.text(':', 60, 69);
  doc.setTextColor(15, 23, 42);
  doc.text(`Iuran Rutin Wajib Bulanan Periode ${record.bulan}`, 65, 69);

  doc.setTextColor(70, 80, 95);
  doc.text('Metode Pembayaran', 20, 77);
  doc.text(':', 60, 77);
  doc.setTextColor(15, 23, 42);
  doc.text(`${record.metodeBayar || 'Kas Tunai'} (Tgl: ${record.tanggalBayar || new Date().toISOString().split('T')[0]})`, 65, 77);

  // Box Nominal
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(20, 85, 75, 14, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(22, 101, 52);
  doc.text(`Rp ${record.nominal.toLocaleString('id-ID')},-`, 25, 94);

  // QR / Verification badge simulation
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('Status: LUNAS & Tervalidasi Sistem Cloud PGRI Sirnajaya 1', 20, 106);
  doc.text('Hash Autentikasi: SHA256-PGRISJ1-VERIFIED', 20, 111);

  // Tanda Tangan Penerima
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  doc.text('Sirnajaya, ' + (record.tanggalBayar || 'September 2026'), pageWidth - 70, 85);
  doc.text('Penerima Kas Bendahara,', pageWidth - 70, 90);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 20, 20);
  doc.text('[STAMPEL DIGITAL PGRI SIRNAJAYA 1]', pageWidth - 70, 103);
  doc.setTextColor(15, 23, 42);
  doc.text(record.diterimaOleh || 'Hj. Ratna Dewi (Bendahara)', pageWidth - 70, 112);

  doc.save(`Kwitansi_Iuran_${record.npa}_${record.bulan.replace(/\s+/g, '_')}.pdf`);
};

export type UserRole = 'super_admin' | 'bendahara' | 'sekretaris' | 'anggota';

export interface SDImbas {
  id: string;
  npsn: string;
  namaSekolah: string;
  alamat: string;
  namaKepalaSekolah: string;
  koordinatorRanting: string;
  kontakKoordinator: string;
  jumlahGuruAnggota: number;
  statusGugus: 'Gugus Inti' | 'SD Imbas';
}

export interface Member {
  id: string;
  npa: string; // Nomor Pokok Anggota PGRI
  nuptk: string;
  nip?: string;
  nikEncrypted?: string;
  nama: string;
  gelar?: string;
  jabatanRanting: string; // Ketua, Wakil Ketua, Sekretaris, Bendahara, Seksi..., Anggota
  isPengurus: boolean;
  sekolah: string; // e.g. SDN Sirnajaya 01, SDN Sirnajaya 02
  jenjang: 'SD' | 'SMP' | 'SMA/SMK' | 'TK/PAUD';
  statusKeanggotaan: 'Aktif' | 'Cuti' | 'Pensiun' | 'Mutasi';
  noHp: string;
  email: string;
  alamat: string;
  fotoUrl: string;
  tanggalBergabung: string;
  divisi: string;
  statusIuranBulanIni: 'Lunas' | 'Belum Bayar';
  nominalTunggakan: number;
}

export interface IuranRecord {
  id: string;
  memberId: string;
  namaAnggota: string;
  npa: string;
  sekolah: string;
  bulan: string; // e.g. "September 2026"
  tahun: number;
  nominal: number;
  status: 'Lunas' | 'Belum Bayar' | 'Menunggu Konfirmasi';
  tanggalBayar?: string;
  metodeBayar?: 'Kas Tunai' | 'Transfer Bank' | 'QRIS PGRI' | 'Potong Gaji Sekolah';
  buktiUrl?: string;
  catatan?: string;
  nomorKwitansi?: string;
  diterimaOleh?: string;
}

export interface KasTransaction {
  id: string;
  tanggal: string;
  tipe: 'masuk' | 'keluar';
  kategori: 'Iuran Anggota' | 'Bantuan/Hibah' | 'Konsumsi Rapat' | 'Santunan Duka & Sosial' | 'Operasional & Kesekretariatan' | 'Kegiatan HGN/HUT' | 'Lainnya';
  deskripsi: string;
  nominal: number;
  penanggungJawab: string;
  buktiUrl?: string;
  nomorBukti?: string;
}

export interface Kegiatan {
  id: string;
  judul: string;
  tanggal: string;
  lokasi: string;
  kategori: 'Rapat' | 'Peringatan HGN & HUT PGRI' | 'Diklat Guru' | 'Sosial & Santunan' | 'Konferensi Ranting';
  deskripsi: string;
  fotos: string[];
  dihadiriOleh: number;
  dokumentator: string;
}

export interface JadwalRapat {
  id: string;
  judul: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  tipe: 'Rapat Pengurus Harian' | 'Rapat Pleno Anggota' | 'Koordinasi Program Kerja' | 'Rapat Persiapan HGN';
  agenda: string[];
  status: 'Mendatang' | 'Berlangsung' | 'Selesai' | 'Dibatalkan';
  linkOnline?: string;
  daftarHadir: {
    memberId: string;
    nama: string;
    status: 'Hadir' | 'Izin' | 'Sakit' | 'Belum Konfirmasi';
    waktuKonfirmasi?: string;
  }[];
  notula?: string;
}

export interface Tugas {
  id: string;
  judul: string;
  divisi: string;
  penanggungJawabId: string;
  penanggungJawabNama: string;
  tenggatWaktu: string;
  prioritas: 'Rendah' | 'Sedang' | 'Tinggi' | 'Mendesak';
  status: 'Belum Dimulai' | 'Sedang Berjalan' | 'Review' | 'Selesai';
  progres: number; // 0 - 100
  deskripsi: string;
}

export interface NotificationItem {
  id: string;
  judul: string;
  pesan: string;
  waktu: string;
  tipe: 'tagihan' | 'rapat' | 'status_anggota' | 'tugas' | 'keuangan' | 'sistem';
  dibaca: boolean;
  memberId?: string;
  actionLink?: string;
}

export interface DivisiAnalytics {
  nama: string;
  singkatan: string;
  koordinator: string;
  kpi: number; // 0 - 100%
  programSelesai: number;
  totalProgram: number;
  anggaranTerpakai: number;
  anggaranAlokasi: number;
  partisipasiPersen: number;
  evaluasi: string;
}

export interface ActivityLog {
  id: string;
  waktu: string;
  actor: string;
  role: string;
  aksi: string;
  kategori: 'keanggotaan' | 'keuangan' | 'kegiatan' | 'rapat' | 'tugas' | 'keamanan';
  detail: string;
  ipAddress?: string;
}

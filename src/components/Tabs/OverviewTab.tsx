import React, { useState } from 'react';
import { Member, IuranRecord, KasTransaction, JadwalRapat, Tugas, DivisiAnalytics, ActivityLog, UserRole } from '../../types';
import { DAFTAR_SD_IMBAS } from '../../data/initialData';
import { useLogo } from '../../context/LogoContext';
import { PlayStoreDownloadModal } from '../PlayStoreDownloadModal';
import { 
  Users, 
  Wallet, 
  CheckCircle2, 
  Calendar, 
  CheckSquare, 
  TrendingUp, 
  AlertTriangle, 
  Send, 
  FileText, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  School,
  Building,
  ExternalLink,
  Upload,
  Camera,
  Download,
  Smartphone
} from 'lucide-react';

interface OverviewTabProps {
  members: Member[];
  iuranRecords: IuranRecord[];
  kasTransactions: KasTransaction[];
  jadwalRapat: JadwalRapat[];
  tugasList: Tugas[];
  divisiAnalytics: DivisiAnalytics[];
  activityLogs: ActivityLog[];
  currentRole: UserRole;
  setActiveTab: (tab: string) => void;
  onOpenPaymentModal: () => void;
  onOpenBlastModal: () => void;
  onOpenKTAModal: (member: Member) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  members,
  iuranRecords,
  kasTransactions,
  jadwalRapat,
  tugasList,
  divisiAnalytics,
  activityLogs,
  currentRole,
  setActiveTab,
  onOpenPaymentModal,
  onOpenBlastModal,
  onOpenKTAModal,
}) => {
  // Calculations
  const totalAnggota = members.length;
  const totalPengurus = members.filter(m => m.isPengurus).length;
  
  const kasMasuk = kasTransactions.filter(t => t.tipe === 'masuk').reduce((acc, t) => acc + t.nominal, 0);
  const kasKeluar = kasTransactions.filter(t => t.tipe === 'keluar').reduce((acc, t) => acc + t.nominal, 0);
  const saldoKas = kasMasuk - kasKeluar;

  const totalIuranLunas = iuranRecords.filter(i => i.status === 'Lunas').length;
  const persentaseIuran = Math.round((totalIuranLunas / (iuranRecords.length || 1)) * 100);

  const rapatMendatang = jadwalRapat.filter(r => r.status === 'Mendatang')[0];
  const tugasBerjalan = tugasList.filter(t => t.status === 'Sedang Berjalan').length;

  const { logoUrl, openUploadModal } = useLogo();
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 via-red-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-red-900/30">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 max-w-2xl">
            <button
              type="button"
              onClick={openUploadModal}
              title="Klik untuk Upload / Ganti Logo PGRI"
              className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 shadow-lg shadow-black/20 flex-shrink-0 border-2 border-red-300 ring-4 ring-white/10 hidden sm:flex items-center justify-center overflow-hidden cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <img src={logoUrl} alt="Logo PGRI" className="w-full h-full object-contain transition-opacity group-hover:opacity-40" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <Camera className="w-5 h-5 text-white mb-0.5" />
                <span className="text-[9px] font-black uppercase tracking-wider">Ganti Logo</span>
              </div>
            </button>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-red-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Sistem Manajemen PGRI RANTING SIRNAJAYA Aktif</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                SISTEM MANAJEMEN PGRI RANTING SIRNAJAYA
              </h2>
              <p className="text-sm text-red-100/90 leading-relaxed">
                Cabang Kecamatan Sukamakmur, Kabupaten Bogor: pengelolaan keanggotaan guru, transparansi iuran bulanan, notifikasi tagihan otomatis, serta monitoring 6 SD Imbas secara akuntabel dan aman.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsPlayStoreModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-950/30 transition-all active:scale-95 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-100" />
              <span>Download Aplikasi HP</span>
            </button>
            <button
              onClick={openUploadModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/25 backdrop-blur-xs transition-all active:scale-95"
            >
              <Upload className="w-4 h-4 text-white" />
              <span>Ganti / Upload Logo</span>
            </button>
            <button
              onClick={onOpenPaymentModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-red-700 hover:bg-red-50 text-xs font-bold shadow-md shadow-black/10 transition-all active:scale-95"
            >
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>Input Iuran Baru</span>
            </button>
            <button
              onClick={() => setActiveTab('keuangan')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-xs transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Laporan Kas PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Anggota & Pengurus */}
        <div 
          onClick={() => setActiveTab('anggota')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Keanggotaan
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{totalAnggota}</span>
              <span className="text-xs font-semibold text-slate-500">Guru Terdaftar</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
              <span className="inline-block w-2 h-2 rounded-full bg-red-600"></span>
              <span>{totalPengurus} Pengurus Ranting</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600 font-medium">100% Aktif</span>
            </div>
          </div>
        </div>

        {/* Card 2: Saldo Kas Ranting */}
        <div 
          onClick={() => setActiveTab('keuangan')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Saldo Kas Ranting
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-700">
                Rp {saldoKas.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
              <span className="flex items-center text-emerald-600 font-semibold">
                <ArrowDownLeft className="w-3 h-3 mr-0.5" /> Masuk: Rp {kasMasuk.toLocaleString('id-ID')}
              </span>
              <span className="flex items-center text-rose-600 font-semibold">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> Keluar: Rp {kasKeluar.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Kepatuhan Iuran Bulan Ini */}
        <div 
          onClick={() => setActiveTab('keuangan')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Iuran September 2026
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{persentaseIuran}%</span>
              <span className="text-xs font-bold text-slate-600">
                {totalIuranLunas} / {iuranRecords.length} Lunas
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${persentaseIuran}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span>Wajib: Rp 25.000/bln</span>
              <span className="text-red-600 font-semibold">
                {iuranRecords.length - totalIuranLunas} Belum Bayar
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Agenda Rapat Terdekat */}
        <div 
          onClick={() => setActiveTab('rapat')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Rapat Mendatang
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {rapatMendatang ? (
              <>
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {rapatMendatang.judul}
                </h4>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-blue-700 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{rapatMendatang.tanggal} ({rapatMendatang.waktu})</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-1">
                  📍 {rapatMendatang.lokasi}
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-400 mt-2">Tidak ada rapat terdekat.</p>
            )}
          </div>
        </div>

      </div>

      {/* Main Grid: Left (Iuran Quick Status & Rapat), Right (Live Activity & Quick Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section: Status Tunggakan & Notifikasi Tagihan */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Monitoring Iuran & Peringatan Otomatis
                </h3>
              </div>
              <button
                onClick={onOpenBlastModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Blast Pengingat WA</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {iuranRecords.filter(i => i.status === 'Belum Bayar').map((rec) => {
                const mem = members.find(m => m.id === rec.memberId);
                return (
                  <div key={rec.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-xs">
                        {rec.namaAnggota.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{rec.namaAnggota}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span>{rec.sekolah}</span>
                          <span>•</span>
                          <span className="text-red-600 font-medium">Tagihan: Rp {rec.nominal.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (mem) onOpenKTAModal(mem);
                        }}
                        className="hidden sm:inline-flex px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-medium text-slate-700"
                      >
                        KTA
                      </button>
                      <button
                        onClick={onOpenPaymentModal}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        Tandai Lunas
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Sistem otomatis memperbarui status tagihan setiap pergantian bulan.</span>
              <button 
                onClick={() => setActiveTab('keuangan')}
                className="text-red-600 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat Seluruh Iuran</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Section: Struktur Pengurus Inti Ranting */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-red-600" />
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Badan Pengurus Harian Ranting Sirnajaya 1
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('anggota')}
                className="text-xs font-bold text-red-600 hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat Semua ({members.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {members.filter(m => m.isPengurus).slice(0, 4).map((pengurus) => (
                <div 
                  key={pengurus.id}
                  onClick={() => onOpenKTAModal(pengurus)}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-red-300 hover:bg-red-50/30 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={pengurus.fotoUrl}
                    alt={pengurus.nama}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide block truncate">
                      {pengurus.jabatanRanting}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {pengurus.nama}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {pengurus.sekolah}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Monitoring 6 SD Imbas Ranting */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Wilayah Binaan: 6 SD Imbas Ranting
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Gugus sekolah binaan PGRI Ranting Sirnajaya 1
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('anggota')}
                className="text-xs font-bold text-red-600 hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat Detail</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
              {DAFTAR_SD_IMBAS.map((sd) => {
                const count = members.filter(m => m.sekolah.toUpperCase() === sd.namaSekolah.toUpperCase()).length;
                const unpaid = iuranRecords.filter(i => i.sekolah.toUpperCase() === sd.namaSekolah.toUpperCase() && i.status === 'Belum Bayar').length;

                return (
                  <div
                    key={sd.id}
                    onClick={() => setActiveTab('anggota')}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-red-50/50 border border-slate-200 hover:border-red-300 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 font-mono">{sd.npsn}</span>
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded-xs ${
                        sd.statusGugus === 'Gugus Inti' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {sd.statusGugus}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900 mt-1 truncate">
                      {sd.namaSekolah}
                    </h4>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200 text-[10px]">
                      <span className="text-slate-600 font-semibold">{count} Guru</span>
                      {unpaid > 0 ? (
                        <span className="text-red-600 font-bold">{unpaid} Tertunggak</span>
                      ) : (
                        <span className="text-emerald-600 font-bold">100% Lunas</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Task Progress */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Progres Tugas & Proyek
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('tugas')}
                className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <span>Kelola</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {tugasList.slice(0, 3).map((tugas) => (
                <div key={tugas.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate pr-2">
                      {tugas.judul}
                    </span>
                    <span className="font-mono font-bold text-blue-600">{tugas.progres}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full ${
                        tugas.progres === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${tugas.progres}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>PJ: {tugas.penanggungJawabNama.split(',')[0]}</span>
                    <span>Deadline: {tugas.tenggatWaktu}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Activity Logs (Audit Trail) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Audit Aktivitas Real-time
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                SSL Enkripsi
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2 max-h-80 overflow-y-auto pr-1">
              {activityLogs.map((log) => (
                <div key={log.id} className="py-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{log.actor}</span>
                    <span className="text-[10px] text-slate-400">{log.waktu}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {log.detail}
                  </p>
                  <div className="text-[10px] font-mono text-slate-400">
                    Aksi: {log.aksi} • {log.ipAddress}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-slate-100 text-center">
              <button
                onClick={() => setActiveTab('keamanan')}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Lihat Konsol Keamanan & Cloud Sync →
              </button>
            </div>
          </div>

        </div>

      </div>
      
      {/* Play Store & PWA Download Modal */}
      <PlayStoreDownloadModal
        isOpen={isPlayStoreModalOpen}
        onClose={() => setIsPlayStoreModalOpen(false)}
      />

    </div>
  );
};

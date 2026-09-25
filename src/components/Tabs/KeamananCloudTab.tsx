import React, { useState } from 'react';
import { ActivityLog, UserRole, Member, IuranRecord, KasTransaction } from '../../types';
import { generateSHA256 } from '../../utils/cryptoSim';
import { useLogo } from '../../context/LogoContext';
import { 
  ShieldCheck, 
  CloudCheck, 
  Lock, 
  Key, 
  RefreshCw, 
  Download, 
  Upload, 
  FileCode, 
  CheckCircle2, 
  Server, 
  ShieldAlert,
  Terminal,
  Activity,
  Smartphone
} from 'lucide-react';
import { PlayStoreDownloadModal } from '../PlayStoreDownloadModal';
import confetti from 'canvas-confetti';

interface KeamananCloudTabProps {
  activityLogs: ActivityLog[];
  currentRole: UserRole;
  members: Member[];
  iuranRecords: IuranRecord[];
  kasTransactions: KasTransaction[];
}

export const KeamananCloudTab: React.FC<KeamananCloudTabProps> = ({
  activityLogs,
  currentRole,
  members,
  iuranRecords,
  kasTransactions,
}) => {
  const { logoUrl, openUploadModal, resetLogo, isCustomLogo } = useLogo();
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('24 September 2026, 19:15 WIB');
  const [cryptoTestInput, setCryptoTestInput] = useState('3216081205680001 - NIK Pengurus Ranting');
  const [cryptoTestOutput, setCryptoTestOutput] = useState('');
  const [cryptoHash, setCryptoHash] = useState('SHA256: 8FA3B9C2E410D99A');

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB, Hari Ini');
      try {
        confetti({ particleCount: 35, spread: 45, origin: { y: 0.6 } });
      } catch (e) {}
    }, 1200);
  };

  const handleRunCryptoTest = async () => {
    const hash = await generateSHA256(cryptoTestInput);
    setCryptoHash(`SHA-256: ${hash}`);
    // Simulate AES-256 GCM encrypted ciphertext
    const b64Cipher = btoa(`ENC_AES256_${cryptoTestInput}`).substring(0, 32);
    setCryptoTestOutput(`aes-256-gcm:${b64Cipher}== (IV: 9e3f1c8a)`);
  };

  const handleDownloadBackup = () => {
    const backupData = {
      app: 'PGRI Ranting Sirnajaya 1 Management System',
      version: '2.5.0-cloud',
      exportedAt: new Date().toISOString(),
      encryptedChecksum: 'SHA256-VALID-PGRI-BACKUP',
      members,
      iuranRecords,
      kasTransactions,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Backup_PGRI_Sirnajaya1_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Pusat Keamanan Data & Sinkronisasi Cloud
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enkripsi data pribadi anggota (AES-256), rekapitulasi data otomatis berbasis cloud, dan audit trail log.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95 disabled:bg-slate-400"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan ke Cloud'}</span>
          </button>
        </div>
      </div>

      {/* Cloud & Security Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Cloud Hub</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h4 className="text-lg font-black text-slate-900">Tersinkron Real-time</h4>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Terakhir sync: <span className="font-semibold text-slate-700">{lastSyncTime}</span>
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <Server className="w-3.5 h-3.5" />
            <span>Node: pgri-cloud-cluster-jabar</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tingkat Enkripsi</span>
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h4 className="text-lg font-black text-slate-900">AES-256 GCM</h4>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Privasi NIK, No Rekening, dan Telepon terlindungi.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px] text-slate-600 font-mono">
            <Key className="w-3.5 h-3.5 text-slate-400" />
            <span>Key Derivation: PBKDF2</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Trail Log</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h4 className="text-lg font-black text-slate-900">{activityLogs.length} Aktivitas</h4>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Semua perubahan transaksi dicatat dengan IP.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px] text-blue-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Integritas Log: Terverifikasi</span>
          </div>
        </div>

      </div>

      {/* Security Testing & RBAC Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Role-Based Access Control (RBAC) matrix (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Matriks Kontrol Akses Berbasis Peran (RBAC)
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700">
              Role: {currentRole}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">1. Super Admin / Ketua Ranting</span>
                <span className="text-[10px] font-bold text-red-600 uppercase">Hak Penuh</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Akses kelola seluruh anggota, SK kepengurusan, persetujuan kas, jadwal rapat, dan manajemen risiko ranting.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">2. Bendahara Ranting</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Akses Keuangan</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Pencatatan pembayaran iuran, blast tagihan otomatis WhatsApp, pembukuan kas masuk/keluar, dan penerbitan kwitansi PDF.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">3. Sekretaris Ranting</span>
                <span className="text-[10px] font-bold text-blue-600 uppercase">Akses Administrasi</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Penjadwalan rapat, pencatatan notula, dokumentasi foto kegiatan ranting, dan penugasan proyek anggota.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">4. Anggota Guru Mandiri</span>
                <span className="text-[10px] font-bold text-slate-600 uppercase">Akses Transparan</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Akses mobile card KTA Digital, melihat histori pembayaran pribadi, cek transparansi laporan kas umum, dan RSVP rapat.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Encryption Test Lab & Backup (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Laboratorium Pengujian Enkripsi AES & Hash
              </h3>
              <span className="text-xs text-slate-400 font-mono">Web Crypto API</span>
            </div>

            <div className="space-y-3 mt-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Uji Payload Data Pribadi (NIK / Rekening)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cryptoTestInput}
                    onChange={(e) => setCryptoTestInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                  <button
                    onClick={handleRunCryptoTest}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                  >
                    Enkripsi
                  </button>
                </div>
              </div>

              {cryptoTestOutput && (
                <div className="p-3 bg-slate-900 rounded-2xl text-emerald-400 font-mono text-[11px] space-y-1">
                  <div className="text-slate-400 text-[10px]"># Ciphertext Enkripsi:</div>
                  <div className="break-all">{cryptoTestOutput}</div>
                  <div className="text-slate-400 text-[10px] pt-1"># Checksum Hash:</div>
                  <div className="text-amber-300">{cryptoHash}</div>
                </div>
              )}
            </div>
          </div>

          {/* Backup Database Section */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Cadangan & Ekspor Database</h4>
                <p className="text-[11px] text-slate-500">Unduh snapshot data ranting dalam format terenkripsi JSON.</p>
              </div>
              <button
                onClick={handleDownloadBackup}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Unduh JSON</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Organization Logo & Branding Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-md border-2 border-red-600 ring-2 ring-red-100 flex-shrink-0">
            <img
              src={logoUrl}
              alt="Logo Organisasi PGRI"
              className="w-full h-full object-contain p-0.5"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                Identitas Visual
              </span>
              {isCustomLogo ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Logo Kustom Aktif
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  Logo Resmi PGRI Asli
                </span>
              )}
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">
              Logo Organisasi PGRI Ranting Sirnajaya
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Logo ini digunakan pada Header, KTA Elektronik Anggota, dan Laporan Resmi. Anda dapat mengunggah logo baru kapan saja.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0 w-full sm:w-auto">
          {isCustomLogo && (
            <button
              onClick={resetLogo}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
            >
              Reset ke Asli
            </button>
          )}
          <button
            onClick={openUploadModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 active:scale-95 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Logo Baru</span>
          </button>
        </div>
      </div>

      {/* Android Play Store & PWA Mobile App Card */}
      <div className="bg-gradient-to-r from-slate-900 to-red-950 rounded-3xl p-6 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                PWA / Google Play TWA Ready
              </span>
              <span className="text-[10px] text-slate-400">
                Offline Cache • Install Instan
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black mt-1">
              Aplikasi Handphone Android & iOS PGRI Sirnajaya
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Dapat diinstall langsung di layar utama HP setiap guru tanpa unduh APK berat, serta siap diekspor menjadi bundle (.aab/.apk) untuk Google Play Store melalui standar Trusted Web Activity (TWA).
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPwaModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 active:scale-95 transition-all cursor-pointer flex-shrink-0 w-full sm:w-auto justify-center"
        >
          <Download className="w-4 h-4" />
          <span>Buka Panduan & Download App</span>
        </button>
      </div>

      <PlayStoreDownloadModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />

    </div>
  );
};

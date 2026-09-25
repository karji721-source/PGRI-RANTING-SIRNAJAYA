import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLogo } from '../context/LogoContext';
import { 
  Download, 
  Smartphone, 
  Share2, 
  PlusSquare, 
  CheckCircle2, 
  X, 
  Globe, 
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';

interface PlayStoreDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayStoreDownloadModal: React.FC<PlayStoreDownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const { logoUrl } = useLogo();
  const [activeTab, setActiveTab] = useState<'direct' | 'playstore' | 'ios'>('direct');
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) {
        setInstallSuccess(true);
      }
    } else {
      // Guide fallback for manual install
      setActiveTab('direct');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header with Google Play & PGRI theme */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 pr-8">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-md flex items-center justify-center flex-shrink-0">
              <img src={logoUrl} alt="Logo PGRI" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-200 bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                  Android & iOS Ready
                </span>
                <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> PWA Official
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                Download Aplikasi PGRI Sirnajaya
              </h3>
              <p className="text-xs text-red-100 mt-0.5">
                Install di HP tanpa kuota besar, akses cepat & offline
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex items-center gap-2 pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'direct'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Install Instan di HP</span>
          </button>
          <button
            onClick={() => setActiveTab('playstore')}
            className={`flex items-center gap-2 pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'playstore'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186c-.328-.31-.532-.782-.532-1.341V3.155c0-.559.204-1.03.531-1.341zM15.207 13.414l2.586 2.586-13.47 7.747 10.884-10.333zm0-2.828L4.323.253 17.793 8l-2.586 2.586zm1.414 1.414l3.195-3.195c.536-.536.837-.363.837.382v19.426c0 .745-.301.918-.837.382l-3.195-3.195 2.213-2.213-2.213-2.213z" />
            </svg>
            <span>Play Store / TWA Info</span>
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex items-center gap-2 pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'ios'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>iPhone / Safari</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {installSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Aplikasi berhasil ditambahkan ke Layar Utama HP Anda! Buka langsung dari ikon PGRI Sirnajaya.</span>
            </div>
          )}

          {isInstalled && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 text-blue-800 text-xs font-semibold">
              <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span>Aplikasi ini saat ini sudah berjalan dalam mode Standalone (Terinstall di HP).</span>
            </div>
          )}

          {activeTab === 'direct' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      Install Langsung 1-Klik (PWA Standalone)
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Tanpa antri, ukuran super ringan (&lt; 2 MB), hemat kuota guru
                    </p>
                  </div>
                </div>

                {isInstallable ? (
                  <button
                    onClick={handleDirectInstall}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 active:scale-98 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD & INSTALL KE HP SEKARANG</span>
                  </button>
                ) : (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-red-200 text-xs text-slate-700 space-y-2">
                    <p className="font-bold text-red-700 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4" /> Cara Pasang di Android Chrome:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                      <li>Buka link aplikasi ini di browser Chrome Android HP Anda.</li>
                      <li>Tekan menu titik tiga (⋮) di pojok kanan atas browser.</li>
                      <li>Pilih menu <strong>"Tambahkan ke Layar Utama"</strong> atau <strong>"Install Aplikasi"</strong>.</li>
                      <li>Ikon resmi PGRI Ranting Sirnajaya akan langsung muncul di menu HP Anda seperti aplikasi Play Store!</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Layar Penuh (Full App)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Bekerja tanpa address bar browser, tampilan 100% seperti APK Android.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>Bisa Offline Cache</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Data KTA dan data SD Imbas tetap tersimpan di memori HP.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'playstore' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186c-.328-.31-.532-.782-.532-1.341V3.155c0-.559.204-1.03.531-1.341zM15.207 13.414l2.586 2.586-13.47 7.747 10.884-10.333zm0-2.828L4.323.253 17.793 8l-2.586 2.586zm1.414 1.414l3.195-3.195c.536-.536.837-.363.837.382v19.426c0 .745-.301.918-.837.382l-3.195-3.195 2.213-2.213-2.213-2.213z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">
                      Google Play Store (Trusted Web Activity - TWA)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Standard resmi Google untuk memasukkan PWA ke Play Store
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Aplikasi ini telah memenuhi seluruh <strong>Persyaratan Teknis Google Play PWA / TWA</strong> (Manifest, Icons 192/512, Maskable, HTTPS, Service Worker, Standalone Mode).
                </p>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 space-y-2">
                  <p className="font-bold text-emerald-400">Langkah Menerbitkan ke Play Store Console:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Buka tool resmi Google: <strong>PWABuilder.com</strong> atau <strong>Bubblewrap CLI</strong>.</li>
                    <li>Masukkan tautan web aplikasi ini.</li>
                    <li>Klik <strong>"Generate Android APK / AAB Bundle"</strong>.</li>
                    <li>Upload file .aab ke akun <strong>Google Play Console</strong> pengurus PGRI.</li>
                  </ol>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Tips untuk Pengurus:</strong> Semua guru dan kepala sekolah di 6 SD Imbas sudah bisa menginstall langsung via tombol <strong>"Install Instan di HP"</strong> tanpa perlu menunggu proses review Play Store!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Panduan Pasang di iPhone / iPad (iOS Safari)
                </h4>
                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">Buka di Browser Safari</p>
                      <p className="text-[11px] text-slate-500">Pastikan Anda membuka URL aplikasi di Safari.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                        Tekan Tombol Share <Share2 className="w-3.5 h-3.5 text-blue-600" />
                      </p>
                      <p className="text-[11px] text-slate-500">Ikon kotak dengan panah atas di bilah bawah Safari.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                        Pilih "Tambahkan ke Layar Utama" <PlusSquare className="w-3.5 h-3.5 text-slate-700" />
                      </p>
                      <p className="text-[11px] text-slate-500">Scroll menu ke bawah dan klik 'Add to Home Screen'.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Versi PWA 2.4.0 (Build Android Ready)
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { IuranRecord } from '../types';
import { AlertCircle, Send, ArrowRight, X, Clock, ShieldAlert } from 'lucide-react';

interface TagihanAlertBannerProps {
  unpaidRecords: IuranRecord[];
  onOpenBlastModal: () => void;
  onNavigateToIuran: () => void;
  isBendaharaOrAdmin: boolean;
}

export const TagihanAlertBanner: React.FC<TagihanAlertBannerProps> = ({
  unpaidRecords,
  onOpenBlastModal,
  onNavigateToIuran,
  isBendaharaOrAdmin,
}) => {
  const [isDismissed, setIsDismissed] = React.useState(false);

  if (unpaidRecords.length === 0 || isDismissed) {
    return null;
  }

  const totalTunggakanNominal = unpaidRecords.reduce((acc, curr) => acc + curr.nominal, 0);

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-lg border-b border-red-700 animate-in slide-in-from-top-4 duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-xs rounded-xl flex-shrink-0 animate-pulse">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/25 text-white text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                  Notifikasi Tagihan Rutin Aktif
                </span>
                <span className="flex items-center gap-1 text-xs text-red-100 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  Periode September 2026
                </span>
              </div>
              <p className="text-sm font-semibold text-white mt-0.5">
                Terdapat <span className="underline font-black">{unpaidRecords.length} Anggota</span> yang belum melunasi iuran bulan ini (Total Kewajiban: Rp {totalTunggakanNominal.toLocaleString('id-ID')}).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {isBendaharaOrAdmin ? (
              <>
                <button
                  onClick={onOpenBlastModal}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-red-700 hover:bg-red-50 text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kirim Pengingat Otomatis (WhatsApp Blast)</span>
                </button>
                <button
                  onClick={onNavigateToIuran}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-black/20 hover:bg-black/30 text-white text-xs font-semibold backdrop-blur-xs transition-colors"
                >
                  <span>Detail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                onClick={onNavigateToIuran}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-red-700 hover:bg-red-50 text-xs font-bold shadow-xs transition-colors"
              >
                <span>Cek & Bayar Iuran Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors ml-1"
              aria-label="Tutup Peringatan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Member } from '../types';
import { useLogo } from '../context/LogoContext';
import { X, Printer, Download, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

interface KTAModalProps {
  member: Member | null;
  onClose: () => void;
}

export const KTAModal: React.FC<KTAModalProps> = ({ member, onClose }) => {
  const { logoUrl } = useLogo();
  if (!member) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Kartu Tanda Anggota (KTA Digital PGRI)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / The Card */}
        <div className="p-6 flex flex-col items-center">
          
          {/* Card Container - Designed like official PGRI Smart Card */}
          <div className="w-full aspect-[1.58/1] rounded-2xl overflow-hidden shadow-xl border-2 border-red-700/40 relative bg-gradient-to-br from-slate-900 via-red-950 to-red-900 text-white flex flex-col justify-between p-4 sm:p-5 select-none print:shadow-none">
            
            {/* Subtle background decorative pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>
            
            {/* Card Top */}
            <div className="relative z-10 flex items-start justify-between border-b border-white/20 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center overflow-hidden border border-red-300 flex-shrink-0">
                  <img src={logoUrl} alt="Logo PGRI" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-red-200 leading-tight">
                    PERSATUAN GURU REPUBLIK INDONESIA
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-white/90 font-medium">
                    PENGURUS RANTING SIRNAJAYA - CAB. KEC. SUKAMAKMUR, KAB. BOGOR
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[8px] sm:text-[9px] bg-red-600/80 px-2 py-0.5 rounded-full uppercase font-bold tracking-widest border border-red-400/30">
                  KTA ELEKTRONIK
                </span>
                <p className="text-[9px] text-red-200/80 font-mono mt-0.5">TERVERIFIKASI</p>
              </div>
            </div>

            {/* Card Middle: Photo + Info */}
            <div className="relative z-10 my-auto flex items-center gap-3.5 py-1">
              <div className="relative flex-shrink-0">
                <img
                  src={member.fotoUrl}
                  alt={member.nama}
                  className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl object-cover border-2 border-white/80 shadow-md bg-slate-800"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-slate-900 text-white" title="Status Aktif">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h5 className="font-extrabold text-sm sm:text-base text-white truncate drop-shadow-xs">
                  {member.nama}
                </h5>
                <p className="text-[10px] sm:text-xs text-amber-300 font-semibold truncate">
                  {member.jabatanRanting}
                </p>
                
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1.5 text-[9px] sm:text-[10px] text-white/80">
                  <div>
                    <span className="text-white/50 block text-[8px]">NPA PGRI:</span>
                    <span className="font-mono font-bold text-white tracking-wide">{member.npa}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block text-[8px]">NUPTK:</span>
                    <span className="font-mono font-medium text-white/90">{member.nuptk}</span>
                  </div>
                  <div className="col-span-2 mt-0.5">
                    <span className="text-white/50 block text-[8px]">UNIT KERJA:</span>
                    <span className="font-semibold text-white truncate block">{member.sekolah}</span>
                  </div>
                </div>
              </div>

              {/* QR Code Simulation */}
              <div className="hidden sm:flex flex-col items-center justify-center p-1.5 bg-white rounded-xl shadow-xs">
                <QrCode className="w-12 h-12 text-slate-900" />
                <span className="text-[7px] text-slate-700 font-mono mt-0.5 font-bold">SCAN VALID</span>
              </div>
            </div>

            {/* Card Bottom: Holographic & Security hash */}
            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/15 text-[8px] sm:text-[9px] text-white/70">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Enkripsi ID: <span className="font-mono text-white/90">AES256-{member.id.toUpperCase()}</span></span>
              </div>
              <div className="text-right font-mono text-[8px] text-white/50">
                BERLAKU: SEUMUR HIDUP
              </div>
            </div>

          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 mt-6 w-full">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak KTA</span>
            </button>
            <button
              onClick={() => {
                alert(`KTA Digital untuk ${member.nama} siap diunduh dalam format KTA Elektronik resmi.`);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Unduh KTA Digital</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-3">
            Kartu identitas resmi anggota Persatuan Guru Republik Indonesia (PGRI) Ranting Sirnajaya, Cab. Kec. Sukamakmur, Kab. Bogor.
          </p>

        </div>

      </div>
    </div>
  );
};

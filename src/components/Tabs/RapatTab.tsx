import React, { useState } from 'react';
import { JadwalRapat, Member, UserRole } from '../../types';
import { generateUndanganRapatWAMessage, getWhatsAppLink } from '../../utils/whatsappGenerator';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Users, 
  Plus, 
  Check, 
  X, 
  Send, 
  CalendarPlus, 
  CheckCircle2, 
  AlertCircle, 
  FileText 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RapatTabProps {
  jadwalRapat: JadwalRapat[];
  members: Member[];
  currentRole: UserRole;
  onAddRapat: (rapat: JadwalRapat) => void;
  onUpdateRSVP: (rapatId: string, memberId: string, status: 'Hadir' | 'Izin' | 'Sakit') => void;
}

export const RapatTab: React.FC<RapatTabProps> = ({
  jadwalRapat,
  members,
  currentRole,
  onAddRapat,
  onUpdateRSVP,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRapatDetail, setSelectedRapatDetail] = useState<JadwalRapat | null>(null);

  // New Rapat Form State
  const [formJudul, setFormJudul] = useState('');
  const [formTanggal, setFormTanggal] = useState('2026-10-15');
  const [formWaktu, setFormWaktu] = useState('13:30 - 15:30 WIB');
  const [formLokasi, setFormLokasi] = useState('SDN Sirnajaya 01 (Hybrid)');
  const [formTipe, setFormTipe] = useState<JadwalRapat['tipe']>('Rapat Pengurus Harian');
  const [formLinkOnline, setFormLinkOnline] = useState('https://meet.google.com/pgr-sirnajaya-satu');
  const [formAgendas, setFormAgendas] = useState<string>('Evaluasi iuran bulanan\nPersiapan HUT PGRI ke-81\nLaporan keuangan');

  const isSecretaryOrAdmin = currentRole === 'sekretaris' || currentRole === 'super_admin';

  const handleSaveRapat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul) return;

    const newRapat: JadwalRapat = {
      id: `rpt-${Date.now()}`,
      judul: formJudul,
      tanggal: formTanggal,
      waktu: formWaktu,
      lokasi: formLokasi,
      tipe: formTipe,
      status: 'Mendatang',
      linkOnline: formLinkOnline || undefined,
      agenda: formAgendas.split('\n').filter(a => a.trim().length > 0),
      daftarHadir: members.slice(0, 9).map(m => ({
        memberId: m.id,
        nama: m.nama,
        status: 'Belum Konfirmasi'
      }))
    };

    onAddRapat(newRapat);
    setShowAddModal(false);
    setFormJudul('');

    try {
      confetti({ particleCount: 45, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleDownloadICS = (rapat: JadwalRapat) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//PGRI Ranting Sirnajaya 1//Meeting//ID
BEGIN:VEVENT
SUMMARY:${rapat.judul}
DESCRIPTION:${rapat.agenda.join('; ')}
LOCATION:${rapat.lokasi}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Rapat_PGRI_${rapat.tanggal}.ics`);
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
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Jadwal Rapat Rutin & Koordinasi Ranting
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Agenda musyawarah rutin, konfirmasi RSVP kehadiran guru, link rapat hybrid, dan arsip notula resmi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSecretaryOrAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Jadwalkan Rapat Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Rapat List Cards */}
      <div className="space-y-4">
        {jadwalRapat.map((rapat) => {
          const isMendatang = rapat.status === 'Mendatang';
          const hadirCount = rapat.daftarHadir.filter(d => d.status === 'Hadir').length;
          const izinCount = rapat.daftarHadir.filter(d => d.status === 'Izin').length;

          return (
            <div 
              key={rapat.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left Info */}
              <div className="space-y-3 max-w-2xl flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    isMendatang 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {rapat.tipe}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isMendatang ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {rapat.status}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                  {rapat.judul}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span className="font-semibold">{rapat.tanggal} ({rapat.waktu})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{rapat.lokasi}</span>
                  </div>
                </div>

                {rapat.linkOnline && (
                  <div className="flex items-center gap-2 text-xs">
                    <Video className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <a 
                      href={rapat.linkOnline} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-blue-600 hover:underline font-semibold font-mono truncate"
                    >
                      {rapat.linkOnline}
                    </a>
                  </div>
                )}

                {/* Agenda Bullet points */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Agenda Pembahasan:
                  </span>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                    {rapat.agenda.map((ag, i) => (
                      <li key={i}>{ag}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: RSVP & Action buttons */}
              <div className="flex flex-col sm:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 min-w-[240px]">
                
                {/* RSVP Attendance Tracker */}
                <div className="w-full text-left sm:text-right space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Konfirmasi Kehadiran
                  </span>
                  <div className="flex items-center sm:justify-end gap-2 text-xs font-semibold">
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      {hadirCount} Hadir
                    </span>
                    <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      {izinCount} Izin
                    </span>
                  </div>
                </div>

                {/* Quick RSVP for logged-in user */}
                {isMendatang && (
                  <div className="w-full bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1.5">
                      Status Kehadiran Anda:
                    </span>
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onUpdateRSVP(rapat.id, 'm-01', 'Hadir')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                      >
                        ✓ Hadir
                      </button>
                      <button
                        onClick={() => onUpdateRSVP(rapat.id, 'm-01', 'Izin')}
                        className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                      >
                        Izin
                      </button>
                      <button
                        onClick={() => onUpdateRSVP(rapat.id, 'm-01', 'Sakit')}
                        className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold transition-colors"
                      >
                        Sakit
                      </button>
                    </div>
                  </div>
                )}

                {/* Secondary Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleDownloadICS(rapat)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                    title="Simpan ke Google / Apple Calendar"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-blue-600" />
                    <span>Kalender .ics</span>
                  </button>

                  <button
                    onClick={() => {
                      const msg = generateUndanganRapatWAMessage(
                        'Semua Anggota Ranting',
                        rapat.judul,
                        rapat.tanggal,
                        rapat.waktu,
                        rapat.lokasi,
                        rapat.linkOnline
                      );
                      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="flex items-center justify-center p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    title="Bagikan Undangan ke WhatsApp Grup PGRI"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Add Rapat Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-base">
                Jadwalkan Rapat Rutin Ranting Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRapat} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul / Agenda Utama Rapat</label>
                <input
                  type="text"
                  required
                  value={formJudul}
                  onChange={(e) => setFormJudul(e.target.value)}
                  placeholder="Contoh: Rapat Evaluasi Iuran & Rencana HGN 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={formTanggal}
                    onChange={(e) => setFormTanggal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Waktu</label>
                  <input
                    type="text"
                    value={formWaktu}
                    onChange={(e) => setFormWaktu(e.target.value)}
                    placeholder="13:30 - 15:30 WIB"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Rapat</label>
                  <select
                    value={formTipe}
                    onChange={(e) => setFormTipe(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="Rapat Pengurus Harian">Rapat Pengurus Harian</option>
                    <option value="Rapat Pleno Anggota">Rapat Pleno Anggota</option>
                    <option value="Koordinasi Program Kerja">Koordinasi Program Kerja</option>
                    <option value="Rapat Persiapan HGN">Rapat Persiapan HGN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tempat / Ruang</label>
                  <input
                    type="text"
                    value={formLokasi}
                    onChange={(e) => setFormLokasi(e.target.value)}
                    placeholder="SDN Sirnajaya 01"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Link Hybrid (Google Meet/Zoom)</label>
                <input
                  type="text"
                  value={formLinkOnline}
                  onChange={(e) => setFormLinkOnline(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Daftar Agenda (1 baris per poin)</label>
                <textarea
                  rows={3}
                  value={formAgendas}
                  onChange={(e) => setFormAgendas(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-md"
                >
                  Simpan & Kirim Notifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

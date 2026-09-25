import React, { useState } from 'react';
import { IuranRecord, Member } from '../types';
import { generateTagihanIuranWAMessage, getWhatsAppLink } from '../utils/whatsappGenerator';
import { X, Send, CheckCircle2, MessageSquare, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WhatsAppBlastModalProps {
  unpaidRecords: IuranRecord[];
  members: Member[];
  onClose: () => void;
  onSendAutomatedPush: (memberIds: string[]) => void;
}

export const WhatsAppBlastModal: React.FC<WhatsAppBlastModalProps> = ({
  unpaidRecords,
  members,
  onClose,
  onSendAutomatedPush,
}) => {
  const [selectedRecordId, setSelectedRecordId] = useState<string>(
    unpaidRecords.length > 0 ? unpaidRecords[0].id : ''
  );
  const [copied, setCopied] = useState(false);
  const [sentSuccessIds, setSentSuccessIds] = useState<string[]>([]);
  const [isBlastingAll, setIsBlastingAll] = useState(false);

  const selectedRecord = unpaidRecords.find(r => r.id === selectedRecordId) || unpaidRecords[0];
  const selectedMember = selectedRecord ? members.find(m => m.id === selectedRecord.memberId) : undefined;

  const currentMessage = selectedRecord && selectedMember ? generateTagihanIuranWAMessage({
    nama: selectedMember.nama,
    npa: selectedMember.npa,
    noHp: selectedMember.noHp,
    sekolah: selectedMember.sekolah,
    bulan: selectedRecord.bulan,
    nominal: selectedRecord.nominal,
    tunggakanBulan: selectedMember.nominalTunggakan > 25000 ? 2 : 1
  }) : '';

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(currentMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSingleWhatsApp = (record: IuranRecord) => {
    const mem = members.find(m => m.id === record.memberId);
    if (!mem) return;

    const msg = generateTagihanIuranWAMessage({
      nama: mem.nama,
      npa: mem.npa,
      noHp: mem.noHp,
      sekolah: mem.sekolah,
      bulan: record.bulan,
      nominal: record.nominal,
      tunggakanBulan: mem.nominalTunggakan > 25000 ? 2 : 1
    });

    const link = getWhatsAppLink(mem.noHp, msg);
    window.open(link, '_blank');

    if (!sentSuccessIds.includes(record.id)) {
      setSentSuccessIds(prev => [...prev, record.id]);
    }
  };

  const handleTriggerAutomatedPushAll = () => {
    setIsBlastingAll(true);
    const memberIds = unpaidRecords.map(r => r.memberId);
    
    // Simulate real-time API push trigger
    setTimeout(() => {
      onSendAutomatedPush(memberIds);
      setSentSuccessIds(unpaidRecords.map(r => r.id));
      setIsBlastingAll(false);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-red-50 to-amber-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Gateway Notifikasi & Pengingat Tagihan Otomatis
              </h3>
              <p className="text-xs text-slate-500">
                Integrasi WhatsApp & Push Notification Ranting Sirnajaya 1
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Notice */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Otomasi Penagihan Iuran: </span>
              Pesan diformat secara otomatis dengan tata bahasa santun, menyebutkan nama guru, unit sekolah, nominal iuran, serta nomor rekening resmi ranting.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: List of unpaid members */}
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Daftar Anggota Belum Bayar ({unpaidRecords.length})
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {unpaidRecords.map((rec) => {
                  const mem = members.find(m => m.id === rec.memberId);
                  const isSent = sentSuccessIds.includes(rec.id);
                  const isSelected = selectedRecordId === rec.id;

                  return (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedRecordId(rec.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'border-red-500 bg-red-50/60 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {rec.namaAnggota}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {rec.sekolah}
                        </p>
                        <span className="text-[10px] text-red-600 font-semibold">
                          Tagihan: Rp {rec.nominal.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {isSent ? (
                          <span className="p-1 rounded-full bg-emerald-100 text-emerald-700" title="Terkirim">
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendSingleWhatsApp(rec);
                            }}
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                            title="Kirim Pesan WhatsApp"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Message Preview */}
            <div className="md:col-span-7 flex flex-col justify-between bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Format Pesan WhatsApp Resmi
                  </span>
                  <button
                    onClick={handleCopyMessage}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                  </button>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto select-all shadow-inner">
                  {currentMessage || 'Pilih anggota untuk memuat pesan.'}
                </div>
              </div>

              {selectedRecord && (
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    No WhatsApp: <span className="font-mono text-slate-700">{selectedMember?.noHp}</span>
                  </span>
                  <button
                    onClick={() => handleSendSingleWhatsApp(selectedRecord)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka WhatsApp Web / App</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Footer: Mass Blast Action */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <div className="text-xs text-slate-500">
            Total {unpaidRecords.length} anggota akan menerima notifikasi pengingat otomatis.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              Tutup
            </button>
            <button
              disabled={isBlastingAll}
              onClick={handleTriggerAutomatedPushAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>{isBlastingAll ? 'Memproses Notifikasi...' : 'Kirim Notifikasi Push ke Semua'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Member, IuranRecord } from '../types';
import { generateKwitansiIuranPDF } from '../utils/pdfGenerator';
import { X, CheckCircle2, Receipt, ArrowRight, Wallet, Building2, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  member?: Member | null;
  members: Member[];
  onClose: () => void;
  onRecordPayment: (paymentData: {
    memberId: string;
    bulan: string;
    nominal: number;
    metodeBayar: 'Kas Tunai' | 'Transfer Bank' | 'QRIS PGRI' | 'Potong Gaji Sekolah';
    catatan: string;
    nomorKwitansi: string;
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  member,
  members,
  onClose,
  onRecordPayment,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    member ? member.id : (members[0]?.id || '')
  );
  const [bulan, setBulan] = useState<string>('September 2026');
  const [nominal, setNominal] = useState<number>(25000);
  const [metodeBayar, setMetodeBayar] = useState<'Kas Tunai' | 'Transfer Bank' | 'QRIS PGRI' | 'Potong Gaji Sekolah'>('Transfer Bank');
  const [catatan, setCatatan] = useState<string>('Pelunasan iuran rutin anggota ranting');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [generatedKwitansiNo, setGeneratedKwitansiNo] = useState<string>('');

  const currentMember = members.find(m => m.id === selectedMemberId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember) return;

    const receiptNo = `KW-PGRI-${Date.now().toString().slice(-6)}`;
    setGeneratedKwitansiNo(receiptNo);

    onRecordPayment({
      memberId: currentMember.id,
      bulan,
      nominal,
      metodeBayar,
      catatan,
      nomorKwitansi: receiptNo
    });

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    setIsSuccess(true);
  };

  const handleDownloadKwitansi = () => {
    if (!currentMember) return;
    const tempRecord: IuranRecord = {
      id: 'temp-iur',
      memberId: currentMember.id,
      namaAnggota: currentMember.nama,
      npa: currentMember.npa,
      sekolah: currentMember.sekolah,
      bulan,
      tahun: 2026,
      nominal,
      status: 'Lunas',
      tanggalBayar: new Date().toISOString().split('T')[0],
      metodeBayar,
      nomorKwitansi: generatedKwitansiNo,
      diterimaOleh: 'Hj. Ratna Dewi (Bendahara)'
    };
    generateKwitansiIuranPDF(tempRecord, currentMember);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-slate-800 text-base">
              {isSuccess ? 'Pembayaran Berhasil Dicatat' : 'Input Pembayaran Iuran Anggota'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Alhamdulillah, Iuran Berhasil Dilunasi!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Data keuangan telah disinkronkan secara transparan ke Kas Ranting Sirnajaya 1.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor Kwitansi:</span>
                <span className="font-mono font-bold text-slate-900">{generatedKwitansiNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Anggota:</span>
                <span className="font-bold text-slate-900">{currentMember?.nama}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Periode:</span>
                <span className="font-semibold text-slate-800">{bulan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nominal:</span>
                <span className="font-bold text-emerald-600">Rp {nominal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleDownloadKwitansi}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all active:scale-95"
              >
                <Receipt className="w-4 h-4" />
                <span>Unduh Kwitansi PDF</span>
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
              >
                Selesai
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Member Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pilih Anggota Guru
              </label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-xs font-semibold text-slate-800 outline-hidden bg-white"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama} — {m.sekolah} (NPA: {m.npa})
                  </option>
                ))}
              </select>
            </div>

            {/* Periode Bulan & Nominal */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bulan Iuran
                </label>
                <select
                  value={bulan}
                  onChange={(e) => setBulan(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 text-xs font-medium text-slate-800 outline-hidden bg-white"
                >
                  <option value="September 2026">September 2026</option>
                  <option value="Agustus 2026">Agustus 2026</option>
                  <option value="Oktober 2026">Oktober 2026</option>
                  <option value="November 2026">November 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  value={nominal}
                  onChange={(e) => setNominal(Number(e.target.value))}
                  step="5000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 text-xs font-bold text-slate-900 outline-hidden"
                />
              </div>
            </div>

            {/* Metode Bayar */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kanal / Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Transfer Bank', label: 'Transfer Bank', icon: Building2 },
                  { id: 'Kas Tunai', label: 'Kas Tunai', icon: Wallet },
                  { id: 'QRIS PGRI', label: 'QRIS PGRI', icon: QrCode },
                  { id: 'Potong Gaji Sekolah', label: 'Potong Gaji', icon: Receipt },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = metodeBayar === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMetodeBayar(item.id as any)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-red-500 bg-red-50 text-red-700 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Catatan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Keterangan / Catatan
              </label>
              <input
                type="text"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Catatan pembayaran..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-red-500 text-xs text-slate-800 outline-hidden"
              />
            </div>

            {/* Submit buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all active:scale-95"
              >
                <span>Konfirmasi Pembayaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

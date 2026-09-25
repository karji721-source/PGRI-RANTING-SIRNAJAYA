import React, { useState } from 'react';
import { IuranRecord, KasTransaction, Member, UserRole } from '../../types';
import { generateLaporanKeuanganPDF, generateRekapIuranPDF, generateKwitansiIuranPDF } from '../../utils/pdfGenerator';
import { generateTagihanIuranWAMessage, getWhatsAppLink } from '../../utils/whatsappGenerator';
import { 
  Wallet, 
  Receipt, 
  FileText, 
  Download, 
  Plus, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  Search, 
  Building2,
  Calendar,
  Check,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface IuranKasTabProps {
  iuranRecords: IuranRecord[];
  kasTransactions: KasTransaction[];
  members: Member[];
  currentRole: UserRole;
  onOpenPaymentModal: () => void;
  onOpenBlastModal: () => void;
  onAddTransaction: (transaction: KasTransaction) => void;
}

export const IuranKasTab: React.FC<IuranKasTabProps> = ({
  iuranRecords,
  kasTransactions,
  members,
  currentRole,
  onOpenPaymentModal,
  onOpenBlastModal,
  onAddTransaction,
}) => {
  const [subTab, setSubTab] = useState<'iuran' | 'kas'>('iuran');
  const [selectedBulan, setSelectedBulan] = useState('September 2026');
  const [iuranFilter, setIuranFilter] = useState<'all' | 'lunas' | 'belum'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showKasModal, setShowKasModal] = useState(false);

  // New Transaction Form State
  const [transaksiForm, setTransaksiForm] = useState({
    tipe: 'keluar' as 'masuk' | 'keluar',
    kategori: 'Konsumsi Rapat' as KasTransaction['kategori'],
    deskripsi: '',
    nominal: 100000,
    penanggungJawab: 'Hj. Ratna Dewi',
    nomorBukti: `BK-${Date.now().toString().slice(-4)}`
  });

  const isBendaharaOrAdmin = currentRole === 'bendahara' || currentRole === 'super_admin';

  // Kas Calculations
  const totalMasuk = kasTransactions.filter(t => t.tipe === 'masuk').reduce((acc, t) => acc + t.nominal, 0);
  const totalKeluar = kasTransactions.filter(t => t.tipe === 'keluar').reduce((acc, t) => acc + t.nominal, 0);
  const saldoAkhir = totalMasuk - totalKeluar;

  // Iuran Calculations
  const totalLunas = iuranRecords.filter(r => r.status === 'Lunas').length;
  const totalBelum = iuranRecords.filter(r => r.status === 'Belum Bayar').length;
  const totalUangIuranTerkumpul = iuranRecords.filter(r => r.status === 'Lunas').reduce((acc, r) => acc + r.nominal, 0);

  // Filtered Iuran Records
  const filteredIuran = iuranRecords.filter((r) => {
    const matchesSearch = 
      r.namaAnggota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.npa.includes(searchTerm);

    if (!matchesSearch) return false;
    if (iuranFilter === 'lunas') return r.status === 'Lunas';
    if (iuranFilter === 'belum') return r.status === 'Belum Bayar';
    return true;
  });

  const handleExportLaporanKeuangan = () => {
    generateLaporanKeuanganPDF(
      'September',
      2026,
      kasTransactions,
      totalMasuk,
      totalKeluar,
      saldoAkhir
    );
  };

  const handleExportRekapIuran = () => {
    generateRekapIuranPDF(
      selectedBulan,
      iuranRecords,
      totalLunas,
      totalBelum,
      totalUangIuranTerkumpul
    );
  };

  const handleCreateKasTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaksiForm.deskripsi || transaksiForm.nominal <= 0) return;

    const newTx: KasTransaction = {
      id: `kas-${Date.now()}`,
      tanggal: new Date().toISOString().split('T')[0],
      tipe: transaksiForm.tipe,
      kategori: transaksiForm.kategori,
      deskripsi: transaksiForm.deskripsi,
      nominal: Number(transaksiForm.nominal),
      penanggungJawab: transaksiForm.penanggungJawab,
      nomorBukti: transaksiForm.nomorBukti
    };

    onAddTransaction(newTx);
    setShowKasModal(false);
    setTransaksiForm({
      tipe: 'keluar',
      kategori: 'Konsumsi Rapat',
      deskripsi: '',
      nominal: 100000,
      penanggungJawab: 'Hj. Ratna Dewi',
      nomorBukti: `BK-${Date.now().toString().slice(-4)}`
    });

    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      
      {/* Top Navigation Sub-Tabs & Actions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Transparansi Iuran & Keuangan Ranting
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan akuntabel iuran wajib bulanan guru dan buku kas umum PGRI Ranting Sirnajaya 1.
          </p>
        </div>

        {/* Switcher & PDF actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setSubTab('iuran')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                subTab === 'iuran'
                  ? 'bg-white text-red-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Iuran Bulanan Guru
            </button>
            <button
              onClick={() => setSubTab('kas')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                subTab === 'kas'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Buku Kas Umum
            </button>
          </div>

          {/* Export PDF */}
          {subTab === 'iuran' ? (
            <button
              onClick={handleExportRekapIuran}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4 text-red-600" />
              <span>Ekspor Rekap PDF</span>
            </button>
          ) : (
            <button
              onClick={handleExportLaporanKeuangan}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Ekspor Laporan PDF</span>
            </button>
          )}

          {/* Primary Action Button */}
          {subTab === 'iuran' ? (
            <button
              onClick={onOpenPaymentModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Bayar / Input Iuran</span>
            </button>
          ) : (
            isBendaharaOrAdmin && (
              <button
                onClick={() => setShowKasModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Transaksi Kas</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* SUB-TAB 1: IURAN ANGGOTA BULANAN */}
      {subTab === 'iuran' && (
        <div className="space-y-6">
          
          {/* Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Terkumpul Periode Ini</span>
                <h4 className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
                  Rp {totalUangIuranTerkumpul.toLocaleString('id-ID')}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Iuran wajib Rp 25.000 / guru</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Receipt className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Anggota Lunas</span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {totalLunas} <span className="text-sm font-semibold text-slate-400">/ {iuranRecords.length} Guru</span>
                </h4>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                  {Math.round((totalLunas / iuranRecords.length) * 100)}% Kepatuhan
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Belum Melunasi</span>
                <h4 className="text-xl sm:text-2xl font-black text-red-600 mt-1">
                  {totalBelum} Guru
                </h4>
                <button
                  onClick={onOpenBlastModal}
                  className="text-xs text-red-600 hover:text-red-700 font-bold underline mt-0.5 inline-flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Kirim Blast Pengingat WA</span>
                </button>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama guru, sekolah, atau NPA..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 outline-hidden focus:ring-2 focus:ring-red-500 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <select
                value={selectedBulan}
                onChange={(e) => setSelectedBulan(e.target.value)}
                className="text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 outline-hidden"
              >
                <option value="September 2026">September 2026</option>
                <option value="Agustus 2026">Agustus 2026</option>
                <option value="Juli 2026">Juli 2026</option>
              </select>

              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => setIuranFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    iuranFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setIuranFilter('lunas')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    iuranFilter === 'lunas' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Lunas
                </button>
                <button
                  onClick={() => setIuranFilter('belum')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    iuranFilter === 'belum' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Belum Bayar
                </button>
              </div>
            </div>
          </div>

          {/* Iuran Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Nama Guru & NPA</th>
                    <th className="py-3.5 px-4">Unit Sekolah</th>
                    <th className="py-3.5 px-4">Periode</th>
                    <th className="py-3.5 px-4">Nominal</th>
                    <th className="py-3.5 px-4">Status & Tanggal</th>
                    <th className="py-3.5 px-4">Metode Bayar</th>
                    <th className="py-3.5 px-4 text-right">Aksi & Kwitansi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredIuran.map((rec) => {
                    const mem = members.find(m => m.id === rec.memberId);
                    const isLunas = rec.status === 'Lunas';

                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{rec.namaAnggota}</div>
                          <div className="font-mono text-[11px] text-slate-400">NPA: {rec.npa}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">{rec.sekolah}</td>
                        <td className="py-3.5 px-4 text-slate-600">{rec.bulan}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          Rp {rec.nominal.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-4">
                          {isLunas ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Lunas ({rec.tanggalBayar || 'Sept 2026'})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold animate-pulse">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Belum Bayar
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {rec.metodeBayar || '-'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isLunas ? (
                              <button
                                onClick={() => generateKwitansiIuranPDF(rec, mem)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] shadow-xs"
                                title="Unduh Kwitansi Digital Resmi"
                              >
                                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Kwitansi PDF</span>
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    if (!mem) return;
                                    const msg = generateTagihanIuranWAMessage({
                                      nama: mem.nama,
                                      npa: mem.npa,
                                      noHp: mem.noHp,
                                      sekolah: mem.sekolah,
                                      bulan: rec.bulan,
                                      nominal: rec.nominal,
                                      tunggakanBulan: 1
                                    });
                                    window.open(getWhatsAppLink(mem.noHp, msg), '_blank');
                                  }}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                                  title="Kirim Peringatan WhatsApp Otomatis"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>WA Tagihan</span>
                                </button>
                                <button
                                  onClick={onOpenPaymentModal}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                                >
                                  <span>Bayar</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: BUKU KAS UMUM & TRANSPARANSI */}
      {subTab === 'kas' && (
        <div className="space-y-6">
          
          {/* Kas Flow Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Kas Masuk</span>
              <div className="flex items-baseline gap-2 mt-1">
                <h4 className="text-2xl font-black text-emerald-700">
                  Rp {totalMasuk.toLocaleString('id-ID')}
                </h4>
              </div>
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <ArrowDownLeft className="w-3.5 h-3.5" />
                Iuran anggota & bantuan cabang
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengeluaran</span>
              <div className="flex items-baseline gap-2 mt-1">
                <h4 className="text-2xl font-black text-rose-600">
                  Rp {totalKeluar.toLocaleString('id-ID')}
                </h4>
              </div>
              <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                Santunan sosial & operasional rapat
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-red-950 text-white p-5 rounded-3xl border border-slate-800 shadow-lg">
              <span className="text-xs font-bold text-red-200 uppercase tracking-wider">Saldo Kas Tersedia</span>
              <div className="flex items-baseline gap-2 mt-1">
                <h4 className="text-2xl font-black text-white">
                  Rp {saldoAkhir.toLocaleString('id-ID')}
                </h4>
              </div>
              <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Kas Sehat & Transparan
              </p>
            </div>
          </div>

          {/* Kas Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Buku Kas Umum (BKU) Transparan
                </h3>
                <p className="text-xs text-slate-500">
                  Seluruh penerimaan dan pengeluaran tercatat dengan nomor bukti resmi.
                </p>
              </div>

              <button
                onClick={handleExportLaporanKeuangan}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Laporan PDF Resmi</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">No. Bukti / Tanggal</th>
                    <th className="py-3.5 px-4">Kategori & Uraian Transaksi</th>
                    <th className="py-3.5 px-4">Penanggung Jawab</th>
                    <th className="py-3.5 px-4 text-right">Kas Masuk (Debit)</th>
                    <th className="py-3.5 px-4 text-right">Kas Keluar (Kredit)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {kasTransactions.map((tx) => {
                    const isMasuk = tx.tipe === 'masuk';

                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-slate-800">{tx.nomorBukti || 'BKM-01'}</div>
                          <div className="text-[11px] text-slate-400">{tx.tanggal}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                            isMasuk ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {tx.kategori}
                          </span>
                          <div className="font-semibold text-slate-900">{tx.deskripsi}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{tx.penanggungJawab}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                          {isMasuk ? `+Rp ${tx.nominal.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-rose-600">
                          {!isMasuk ? `-Rp ${tx.nominal.toLocaleString('id-ID')}` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Modal Add Kas Transaction */}
      {showKasModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-base">
                Catat Transaksi Kas Ranting Baru
              </h3>
              <button
                onClick={() => setShowKasModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateKasTransaction} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Transaksi</label>
                  <select
                    value={transaksiForm.tipe}
                    onChange={(e) => setTransaksiForm({ ...transaksiForm, tipe: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="keluar">Pengeluaran Kas (Kredit)</option>
                    <option value="masuk">Penerimaan Kas (Debit)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    required
                    value={transaksiForm.nominal}
                    onChange={(e) => setTransaksiForm({ ...transaksiForm, nominal: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Transaksi</label>
                <select
                  value={transaksiForm.kategori}
                  onChange={(e) => setTransaksiForm({ ...transaksiForm, kategori: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="Iuran Anggota">Iuran Anggota</option>
                  <option value="Bantuan/Hibah">Bantuan / Hibah Cabang</option>
                  <option value="Konsumsi Rapat">Konsumsi Rapat</option>
                  <option value="Santunan Duka & Sosial">Santunan Duka & Sosial</option>
                  <option value="Operasional & Kesekretariatan">Operasional & Kesekretariatan</option>
                  <option value="Kegiatan HGN/HUT">Kegiatan HGN / HUT PGRI</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Uraian / Deskripsi Transaksi</label>
                <input
                  type="text"
                  required
                  value={transaksiForm.deskripsi}
                  onChange={(e) => setTransaksiForm({ ...transaksiForm, deskripsi: e.target.value })}
                  placeholder="Contoh: Pembelian konsumsi rapat koordinasi September..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Penanggung Jawab</label>
                  <input
                    type="text"
                    value={transaksiForm.penanggungJawab}
                    onChange={(e) => setTransaksiForm({ ...transaksiForm, penanggungJawab: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Bukti</label>
                  <input
                    type="text"
                    value={transaksiForm.nomorBukti}
                    onChange={(e) => setTransaksiForm({ ...transaksiForm, nomorBukti: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowKasModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md"
                >
                  Simpan Transaksi Kas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { 
  UserRole, 
  Member, 
  IuranRecord, 
  KasTransaction, 
  JadwalRapat, 
  Tugas, 
  Kegiatan, 
  DivisiAnalytics, 
  ActivityLog, 
  NotificationItem 
} from './types';
import {
  INITIAL_MEMBERS,
  INITIAL_IURAN,
  INITIAL_KAS,
  INITIAL_KEGIATAN,
  INITIAL_RAPAT,
  INITIAL_TUGAS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DIVISI_ANALYTICS,
  INITIAL_ACTIVITY_LOGS
} from './data/initialData';

import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { TagihanAlertBanner } from './components/TagihanAlertBanner';
import { KTAModal } from './components/KTAModal';
import { PaymentModal } from './components/PaymentModal';
import { WhatsAppBlastModal } from './components/WhatsAppBlastModal';
import { UploadLogoModal } from './components/UploadLogoModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useLogo } from './context/LogoContext';

import { OverviewTab } from './components/Tabs/OverviewTab';
import { MembersTab } from './components/Tabs/MembersTab';
import { IuranKasTab } from './components/Tabs/IuranKasTab';
import { KegiatanGalleryTab } from './components/Tabs/KegiatanGalleryTab';
import { RapatTab } from './components/Tabs/RapatTab';
import { TugasTab } from './components/Tabs/TugasTab';
import { AnalitikDivisiTab } from './components/Tabs/AnalitikDivisiTab';
import { KeamananCloudTab } from './components/Tabs/KeamananCloudTab';
import { CheckCircle2, BellRing, Smartphone, X } from 'lucide-react';

export default function App() {
  const { isUploadModalOpen, closeUploadModal } = useLogo();
  const [currentRole, setCurrentRole] = useState<UserRole>('super_admin');
  const [activeTab, setActiveTab] = useState<string>('ringkasan');
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);

  // Core Data States
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [iuranRecords, setIuranRecords] = useState<IuranRecord[]>(INITIAL_IURAN);
  const [kasTransactions, setKasTransactions] = useState<KasTransaction[]>(INITIAL_KAS);
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>(INITIAL_KEGIATAN);
  const [jadwalRapat, setJadwalRapat] = useState<JadwalRapat[]>(INITIAL_RAPAT);
  const [tugasList, setTugasList] = useState<Tugas[]>(INITIAL_TUGAS);
  const [divisiAnalytics, setDivisiAnalytics] = useState<DivisiAnalytics[]>(INITIAL_DIVISI_ANALYTICS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals state
  const [selectedKTAMember, setSelectedKTAMember] = useState<Member | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showBlastModal, setShowBlastModal] = useState<boolean>(false);
  
  // Instant Push Toast Notification State
  const [activeToast, setActiveToast] = useState<{
    judul: string;
    pesan: string;
  } | null>(null);

  const showPushToast = (judul: string, pesan: string) => {
    setActiveToast({ judul, pesan });
    setTimeout(() => {
      setActiveToast(null);
    }, 4500);
  };

  // Helper to append Activity Log
  const logActivity = (aksi: string, kategori: ActivityLog['kategori'], detail: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      waktu: 'Baru Saja',
      actor: currentRole === 'super_admin' ? 'Ketua Ranting' : currentRole === 'bendahara' ? 'Bendahara' : currentRole === 'sekretaris' ? 'Sekretaris' : 'Anggota Guru',
      role: currentRole,
      aksi,
      kategori,
      detail,
      ipAddress: 'Sistem Terenkripsi SSL/TLS'
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Unpaid records for monthly dues
  const unpaidRecords = iuranRecords.filter(r => r.status === 'Belum Bayar');

  // Handle Payment Recording
  const handleRecordPayment = (paymentData: {
    memberId: string;
    bulan: string;
    nominal: number;
    metodeBayar: 'Kas Tunai' | 'Transfer Bank' | 'QRIS PGRI' | 'Potong Gaji Sekolah';
    catatan: string;
    nomorKwitansi: string;
  }) => {
    const memberObj = members.find(m => m.id === paymentData.memberId);
    const memberName = memberObj ? memberObj.nama : 'Anggota';

    // 1. Update or create iuran record
    setIuranRecords(prev => {
      const existingIdx = prev.findIndex(r => r.memberId === paymentData.memberId && r.bulan === paymentData.bulan);
      const updatedRecord: IuranRecord = {
        id: existingIdx >= 0 ? prev[existingIdx].id : `iur-${Date.now()}`,
        memberId: paymentData.memberId,
        namaAnggota: memberName,
        npa: memberObj?.npa || '3216000000',
        sekolah: memberObj?.sekolah || 'SDN Sirnajaya',
        bulan: paymentData.bulan,
        tahun: 2026,
        nominal: paymentData.nominal,
        status: 'Lunas',
        tanggalBayar: new Date().toISOString().split('T')[0],
        metodeBayar: paymentData.metodeBayar,
        nomorKwitansi: paymentData.nomorKwitansi,
        catatan: paymentData.catatan,
        diterimaOleh: 'Hj. Ratna Dewi (Bendahara Ranting)'
      };

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = updatedRecord;
        return copy;
      } else {
        return [updatedRecord, ...prev];
      }
    });

    // 2. Update Member status
    setMembers(prev => prev.map(m => {
      if (m.id === paymentData.memberId) {
        return {
          ...m,
          statusIuranBulanIni: 'Lunas',
          nominalTunggakan: Math.max(0, m.nominalTunggakan - paymentData.nominal)
        };
      }
      return m;
    }));

    // 3. Add to Kas Transaksi
    const newTx: KasTransaction = {
      id: `kas-${Date.now()}`,
      tanggal: new Date().toISOString().split('T')[0],
      tipe: 'masuk',
      kategori: 'Iuran Anggota',
      deskripsi: `Penerimaan Iuran ${paymentData.bulan} a.n ${memberName} (${paymentData.metodeBayar})`,
      nominal: paymentData.nominal,
      penanggungJawab: 'Hj. Ratna Dewi (Bendahara)',
      nomorBukti: paymentData.nomorKwitansi
    };
    setKasTransactions(prev => [newTx, ...prev]);

    // 4. Log and notify
    logActivity('Pelunasan Iuran', 'keuangan', `Iuran ${paymentData.bulan} a.n ${memberName} telah lunas.`);
    showPushToast(
      'Pembayaran Iuran Berhasil',
      `Iuran ${paymentData.bulan} a.n ${memberName} sebesar Rp ${paymentData.nominal.toLocaleString('id-ID')} telah tercatat di kas ranting.`
    );
  };

  // Handle Automated Push WhatsApp blast
  const handleSendAutomatedPush = (memberIds: string[]) => {
    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      judul: 'Notifikasi Tagihan Otomatis Terkirim',
      pesan: `Pengingat tagihan iuran bulan September 2026 telah dikirimkan ke ${memberIds.length} anggota via WhatsApp Gateway.`,
      waktu: 'Baru saja',
      tipe: 'tagihan',
      dibaca: false,
      actionLink: 'keuangan'
    };

    setNotifications(prev => [newNotification, ...prev]);
    logActivity('Blast Tagihan Otomatis', 'keuangan', `Pengingat iuran bulanan dikirim ke ${memberIds.length} anggota via WhatsApp.`);
    showPushToast(
      'Blast Notifikasi Terkirim',
      `Sistem berhasil memproses pengiriman notifikasi pengingat iuran ke ${memberIds.length} anggota tertunggak.`
    );
  };

  // Handle Add Member
  const handleAddMember = (newMember: Member) => {
    setMembers(prev => [newMember, ...prev]);
    // Also create initial dues record
    const newIuran: IuranRecord = {
      id: `iur-${Date.now()}`,
      memberId: newMember.id,
      namaAnggota: newMember.nama,
      npa: newMember.npa,
      sekolah: newMember.sekolah,
      bulan: 'September 2026',
      tahun: 2026,
      nominal: 25000,
      status: 'Belum Bayar'
    };
    setIuranRecords(prev => [newIuran, ...prev]);

    logActivity('Registrasi Anggota Baru', 'keanggotaan', `Menambahkan anggota baru ${newMember.nama} (${newMember.sekolah}).`);
    showPushToast('Anggota Baru Terdaftar', `${newMember.nama} telah ditambahkan ke data PGRI Ranting Sirnajaya 1.`);
  };

  // Handle Member Status Change
  const handleUpdateMemberStatus = (memberId: string, status: 'Aktif' | 'Cuti' | 'Pensiun') => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, statusKeanggotaan: status } : m));
    logActivity('Update Status Anggota', 'keanggotaan', `Memperbarui status anggota ID ${memberId} menjadi ${status}.`);
  };

  // Handle Add Kas Transaction
  const handleAddTransaction = (transaction: KasTransaction) => {
    setKasTransactions(prev => [transaction, ...prev]);
    logActivity('Transaksi Kas Baru', 'keuangan', `${transaction.tipe === 'masuk' ? 'Kas Masuk' : 'Kas Keluar'}: ${transaction.deskripsi}`);
    showPushToast('Transaksi Kas Dicatat', `${transaction.deskripsi} (Rp ${transaction.nominal.toLocaleString('id-ID')})`);
  };

  // Handle Add Kegiatan
  const handleAddKegiatan = (kegiatan: Kegiatan) => {
    setKegiatanList(prev => [kegiatan, ...prev]);
    logActivity('Unggah Dokumentasi', 'kegiatan', `Mengunggah dokumentasi kegiatan: ${kegiatan.judul}`);
    showPushToast('Kegiatan Baru Dipublikasikan', kegiatan.judul);
  };

  // Handle Add Rapat
  const handleAddRapat = (rapat: JadwalRapat) => {
    setJadwalRapat(prev => [rapat, ...prev]);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      judul: 'Undangan Rapat Baru',
      pesan: `${rapat.judul} dijadwalkan pada ${rapat.tanggal} (${rapat.waktu}).`,
      waktu: 'Baru saja',
      tipe: 'rapat',
      dibaca: false,
      actionLink: 'rapat'
    };
    setNotifications(prev => [newNotif, ...prev]);
    logActivity('Jadwal Rapat Baru', 'rapat', `Menjadwalkan: ${rapat.judul}`);
    showPushToast('Rapat Baru Dijadwalkan', `${rapat.judul} pada ${rapat.tanggal}`);
  };

  // Handle RSVP
  const handleUpdateRSVP = (rapatId: string, memberId: string, status: 'Hadir' | 'Izin' | 'Sakit') => {
    setJadwalRapat(prev => prev.map(r => {
      if (r.id === rapatId) {
        const existingIdx = r.daftarHadir.findIndex(d => d.memberId === memberId);
        const mem = members.find(m => m.id === memberId);
        const entry = {
          memberId,
          nama: mem ? mem.nama : 'Anggota',
          status,
          waktuKonfirmasi: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        const updatedDaftar = [...r.daftarHadir];
        if (existingIdx >= 0) {
          updatedDaftar[existingIdx] = entry;
        } else {
          updatedDaftar.push(entry);
        }
        return { ...r, daftarHadir: updatedDaftar };
      }
      return r;
    }));
    logActivity('Konfirmasi Kehadiran (RSVP)', 'rapat', `Status kehadiran dikonfirmasi: ${status}.`);
    showPushToast('RSVP Tercatat', `Kehadiran Anda dicatat sebagai: ${status}`);
  };

  // Handle Add Task
  const handleAddTask = (tugas: Tugas) => {
    setTugasList(prev => [tugas, ...prev]);
    logActivity('Tugas Baru Dibuat', 'tugas', `Tugas: ${tugas.judul} ditugaskan kepada ${tugas.penanggungJawabNama}.`);
    showPushToast('Tugas Baru Ditetapkan', `${tugas.judul} (PJ: ${tugas.penanggungJawabNama})`);
  };

  // Handle Task Progress Update
  const handleUpdateTugasProgres = (tugasId: string, progres: number, status: Tugas['status']) => {
    setTugasList(prev => prev.map(t => t.id === tugasId ? { ...t, progres, status } : t));
    logActivity('Progres Tugas Diperbarui', 'tugas', `Tugas ID ${tugasId} diperbarui menjadi ${progres}% (${status}).`);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, dibaca: true } : n));
  };
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, dibaca: true })));
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${isMobilePreview ? 'flex items-center justify-center p-2 sm:p-4 bg-slate-900' : ''}`}>
      
      {/* Container wrapper for mobile simulator vs full desktop view */}
      <div className={`w-full transition-all duration-300 ${
        isMobilePreview 
          ? 'max-w-[420px] h-[92vh] bg-slate-50 rounded-[40px] shadow-2xl border-8 border-slate-800 overflow-y-auto overflow-x-hidden relative flex flex-col' 
          : 'flex flex-col min-h-screen'
      }`}>
        
        {/* Mobile Device Status Bar simulation */}
        {isMobilePreview && (
          <div className="sticky top-0 z-50 bg-slate-900 text-white px-6 py-2 flex items-center justify-between text-[11px] font-mono">
            <span>09:41</span>
            <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto"></div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Global Instant Push Toast Notification */}
        {activeToast && (
          <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-top-4 duration-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-red-600 text-white">
                <BellRing className="w-4 h-4 animate-bounce" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-white flex items-center justify-between">
                  <span>{activeToast.judul}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Push • Baru Saja</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-snug">{activeToast.pesan}</p>
              </div>
              <button 
                onClick={() => setActiveToast(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <Header
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          notifications={notifications}
          markNotificationAsRead={markNotificationAsRead}
          markAllNotificationsAsRead={markAllNotificationsAsRead}
          isMobilePreview={isMobilePreview}
          setIsMobilePreview={setIsMobilePreview}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenBlastModal={() => setShowBlastModal(true)}
        />

        {/* Monthly Dues Overdue Banner */}
        <TagihanAlertBanner
          unpaidRecords={unpaidRecords}
          onOpenBlastModal={() => setShowBlastModal(true)}
          onNavigateToIuran={() => setActiveTab('keuangan')}
          isBendaharaOrAdmin={currentRole === 'bendahara' || currentRole === 'super_admin'}
        />

        {/* Navigation Tabs */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unpaidDuesCount={unpaidRecords.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-12">
          {activeTab === 'ringkasan' && (
            <OverviewTab
              members={members}
              iuranRecords={iuranRecords}
              kasTransactions={kasTransactions}
              jadwalRapat={jadwalRapat}
              tugasList={tugasList}
              divisiAnalytics={divisiAnalytics}
              activityLogs={activityLogs}
              currentRole={currentRole}
              setActiveTab={setActiveTab}
              onOpenPaymentModal={() => setShowPaymentModal(true)}
              onOpenBlastModal={() => setShowBlastModal(true)}
              onOpenKTAModal={(m) => setSelectedKTAMember(m)}
            />
          )}

          {activeTab === 'anggota' && (
            <MembersTab
              members={members}
              onOpenKTAModal={(m) => setSelectedKTAMember(m)}
              currentRole={currentRole}
              onAddMember={handleAddMember}
              onUpdateMemberStatus={handleUpdateMemberStatus}
            />
          )}

          {activeTab === 'keuangan' && (
            <IuranKasTab
              iuranRecords={iuranRecords}
              kasTransactions={kasTransactions}
              members={members}
              currentRole={currentRole}
              onOpenPaymentModal={() => setShowPaymentModal(true)}
              onOpenBlastModal={() => setShowBlastModal(true)}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {activeTab === 'galeri' && (
            <KegiatanGalleryTab
              kegiatanList={kegiatanList}
              currentRole={currentRole}
              onAddKegiatan={handleAddKegiatan}
            />
          )}

          {activeTab === 'rapat' && (
            <RapatTab
              jadwalRapat={jadwalRapat}
              members={members}
              currentRole={currentRole}
              onAddRapat={handleAddRapat}
              onUpdateRSVP={handleUpdateRSVP}
            />
          )}

          {activeTab === 'tugas' && (
            <TugasTab
              tugasList={tugasList}
              members={members}
              currentRole={currentRole}
              onAddTask={handleAddTask}
              onUpdateTugasProgres={handleUpdateTugasProgres}
            />
          )}

          {activeTab === 'analitik' && (
            <AnalitikDivisiTab
              divisiAnalytics={divisiAnalytics}
              currentRole={currentRole}
            />
          )}

          {activeTab === 'keamanan' && (
            <KeamananCloudTab
              activityLogs={activityLogs}
              currentRole={currentRole}
              members={members}
              iuranRecords={iuranRecords}
              kasTransactions={kasTransactions}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-auto py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-slate-800">RANTING SIRNAJAYA</span>
              <span className="font-medium text-slate-500">• Cab. Kec. Sukamakmur, Kab. Bogor</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Enkripsi AES-256</span>
              <span>•</span>
              <span className="font-semibold text-slate-700">SISTEM MANAJEMEN PGRI RANTING SIRNAJAYA © 2026</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Global Modals */}
      {selectedKTAMember && (
        <KTAModal
          member={selectedKTAMember}
          onClose={() => setSelectedKTAMember(null)}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          member={null}
          members={members}
          onClose={() => setShowPaymentModal(false)}
          onRecordPayment={handleRecordPayment}
        />
      )}

      {showBlastModal && (
        <WhatsAppBlastModal
          unpaidRecords={unpaidRecords}
          members={members}
          onClose={() => setShowBlastModal(false)}
          onSendAutomatedPush={handleSendAutomatedPush}
        />
      )}

      {/* Upload Logo Modal */}
      <UploadLogoModal
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
      />

      {/* Offline Status Indicator */}
      <OfflineIndicator />

    </div>
  );
}

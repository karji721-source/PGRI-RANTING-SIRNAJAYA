import React, { useState } from 'react';
import { Member, UserRole, SDImbas } from '../../types';
import { DAFTAR_SD_IMBAS } from '../../data/initialData';
import { maskNIK, maskPhone, maskEmail } from '../../utils/cryptoSim';
import { 
  Users, 
  Search, 
  Plus, 
  Shield, 
  School, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  Lock, 
  Eye, 
  EyeOff, 
  Send, 
  Filter, 
  Check, 
  Award,
  Building,
  MapPin,
  ChevronRight
} from 'lucide-react';

interface MembersTabProps {
  members: Member[];
  onOpenKTAModal: (member: Member) => void;
  currentRole: UserRole;
  onAddMember: (newMember: Member) => void;
  onUpdateMemberStatus: (memberId: string, status: 'Aktif' | 'Cuti' | 'Pensiun') => void;
}

export const MembersTab: React.FC<MembersTabProps> = ({
  members,
  onOpenKTAModal,
  currentRole,
  onAddMember,
  onUpdateMemberStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showEncryptedData, setShowEncryptedData] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding new member
  const [formData, setFormData] = useState({
    nama: '',
    gelar: '',
    npa: '',
    nuptk: '',
    nip: '',
    nik: '',
    jabatanRanting: 'Anggota Guru',
    isPengurus: false,
    sekolah: 'SDN SIRNAJAYA 01',
    jenjang: 'SD' as const,
    noHp: '',
    email: '',
    alamat: '',
    divisi: 'Anggota Guru Kelas',
  });

  const isPrivileged = currentRole === 'super_admin' || currentRole === 'sekretaris';

  // Filter logic
  const filteredMembers = members.filter((m) => {
    const matchesSearch = 
      m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.npa.includes(searchTerm) ||
      m.nuptk.includes(searchTerm) ||
      m.sekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.jabatanRanting.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory === 'pengurus') return m.isPengurus;
    if (filterCategory === 'anggota') return !m.isPengurus;
    if (filterCategory !== 'all') {
      return m.sekolah.toUpperCase() === filterCategory.toUpperCase();
    }

    return true;
  });

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.npa) {
      alert('Nama dan NPA wajib diisi');
      return;
    }

    const newMember: Member = {
      id: `m-${Date.now()}`,
      npa: formData.npa,
      nuptk: formData.nuptk || '1234567890123456',
      nip: formData.nip,
      nikEncrypted: formData.nik ? `${formData.nik} (Terenkripsi AES-256)` : '3216080000000000 (Terenkripsi AES-256)',
      nama: formData.nama + (formData.gelar ? `, ${formData.gelar}` : ''),
      jabatanRanting: formData.jabatanRanting,
      isPengurus: formData.jabatanRanting !== 'Anggota Guru',
      sekolah: formData.sekolah,
      jenjang: formData.jenjang,
      statusKeanggotaan: 'Aktif',
      noHp: formData.noHp || '081234567890',
      email: formData.email || `${formData.nama.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      alamat: formData.alamat || 'Desa Sirnajaya, Kec. Serang Baru',
      fotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=240&auto=format&fit=crop&q=80',
      tanggalBergabung: new Date().toISOString().split('T')[0],
      divisi: formData.divisi,
      statusIuranBulanIni: 'Belum Bayar',
      nominalTunggakan: 25000,
    };

    onAddMember(newMember);
    setShowAddModal(false);
    setFormData({
      nama: '',
      gelar: '',
      npa: '',
      nuptk: '',
      nip: '',
      nik: '',
      jabatanRanting: 'Anggota Guru',
      isPengurus: false,
      sekolah: 'SDN SIRNAJAYA 01',
      jenjang: 'SD',
      noHp: '',
      email: '',
      alamat: '',
      divisi: 'Anggota Guru Kelas',
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-50 text-red-600">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Pengurus & Anggota SISTEM MANAJEMEN PGRI RANTING SIRNAJAYA
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data keanggotaan terpusat dengan enkripsi privasi AES-256 dan penerbitan KTA digital otomatis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
          {/* Privacy Toggle */}
          <button
            onClick={() => setShowEncryptedData(!showEncryptedData)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              showEncryptedData
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Sembunyikan / Tampilkan Data Pribadi Terenkripsi"
          >
            {showEncryptedData ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
            <span>{showEncryptedData ? 'Sembunyikan NIK/Kontak' : 'Buka Masking Privasi'}</span>
          </button>

          {/* Add Member Button */}
          {isPrivileged && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Anggota Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* SD Imbas Binaan Ranting Sirnajaya 1 Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-red-600" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Gugus & 6 SD Imbas PGRI Ranting Sirnajaya 1
            </h3>
          </div>
          <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
            6 Sekolah Binaan
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Klik sekolah di bawah untuk memfilter anggota guru dari unit SD Imbas yang bersangkutan secara instan:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {DAFTAR_SD_IMBAS.map((sd) => {
            const isSelected = filterCategory.toUpperCase() === sd.namaSekolah.toUpperCase();
            const teacherCount = members.filter(m => m.sekolah.toUpperCase() === sd.namaSekolah.toUpperCase()).length;

            return (
              <div
                key={sd.id}
                onClick={() => setFilterCategory(isSelected ? 'all' : sd.namaSekolah)}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-red-600 bg-red-50 shadow-xs ring-2 ring-red-500/20'
                    : 'border-slate-200 hover:border-red-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-sm ${
                      sd.statusGugus === 'Gugus Inti'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {sd.statusGugus}
                    </span>
                    <span className="font-mono text-[9px] text-slate-400">{sd.npsn}</span>
                  </div>

                  <h4 className="font-extrabold text-xs text-slate-900 mt-1.5 leading-tight">
                    {sd.namaSekolah}
                  </h4>

                  <p className="text-[10px] text-slate-500 truncate mt-1">
                    Koord: {sd.koordinatorRanting.split(',')[0]}
                  </p>
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Guru:</span>
                  <span className="text-red-700 font-mono">{teacherCount} Anggota</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, NPA, sekolah..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-xs"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Semua Guru' },
            { id: 'pengurus', label: 'Pengurus Ranting' },
            { id: 'SDN WARGAJAYA', label: 'SDN Wargajaya' },
            { id: 'SDN SIRNAJAYA 01', label: 'SDN Sirnajaya 01' },
            { id: 'SDN SIRNAJAYA 02', label: 'SDN Sirnajaya 02' },
            { id: 'SDN SIRNAJAYA 03', label: 'SDN Sirnajaya 03' },
            { id: 'SDN SIRNAJAYA 04', label: 'SDN Sirnajaya 04' },
            { id: 'SDN SUKAHARJA 01', label: 'SDN Sukaharja 01' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterCategory.toUpperCase() === tab.id.toUpperCase()
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Members Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const displayPhone = showEncryptedData ? member.noHp : maskPhone(member.noHp, false);
          const displayEmail = showEncryptedData ? member.email : maskEmail(member.email, false);
          const displayNIK = showEncryptedData ? member.nikEncrypted || '321608...' : maskNIK(member.nikEncrypted || '', false);

          return (
            <div 
              key={member.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Photo & Basic Badges */}
                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    <img
                      src={member.fotoUrl}
                      alt={member.nama}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                    />
                    {member.isPengurus && (
                      <span className="absolute -top-1.5 -left-1.5 p-1 rounded-full bg-red-600 text-white shadow-xs" title="Pengurus Ranting">
                        <Award className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        member.isPengurus 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {member.isPengurus ? member.jabatanRanting : 'Anggota Ranting'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm mt-1 truncate" title={member.nama}>
                      {member.nama}
                    </h3>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <School className="w-3 h-3 text-slate-400" />
                      {member.sekolah}
                    </p>
                  </div>
                </div>

                {/* Identity Numbers */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">NPA PGRI:</span>
                    <span className="font-mono font-bold text-slate-800">{member.npa}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">NUPTK:</span>
                    <span className="font-mono text-slate-700">{member.nuptk}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-slate-400" />
                      NIK Enkripsi:
                    </span>
                    <span className="font-mono text-[11px] text-slate-600">{displayNIK}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Status Iuran:</span>
                    <span className={`font-bold text-[11px] px-2 py-0.5 rounded-full ${
                      member.statusIuranBulanIni === 'Lunas' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {member.statusIuranBulanIni === 'Lunas' ? 'LUNAS' : 'BELUM BAYAR'}
                    </span>
                  </div>
                </div>

                {/* Contact info */}
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{displayPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{displayEmail}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenKTAModal(member)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>KTA Digital</span>
                </button>

                <a
                  href={`https://wa.me/62${member.noHp.replace(/\D/g, '').replace(/^0/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                  title="Hubungi via WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </a>

                {isPrivileged && (
                  <select
                    value={member.statusKeanggotaan}
                    onChange={(e) => onUpdateMemberStatus(member.id, e.target.value as any)}
                    className="text-[11px] font-bold py-1.5 px-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Cuti">Cuti</option>
                    <option value="Pensiun">Pensiun</option>
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-base">
                Registrasi Anggota PGRI Ranting Sirnajaya 1
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gelar (Opsional)</label>
                  <input
                    type="text"
                    value={formData.gelar}
                    onChange={(e) => setFormData({ ...formData, gelar: e.target.value })}
                    placeholder="Contoh: S.Pd., M.Pd."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NPA PGRI (10 Digit)</label>
                  <input
                    type="text"
                    required
                    value={formData.npa}
                    onChange={(e) => setFormData({ ...formData, npa: e.target.value })}
                    placeholder="Contoh: 3216010015"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NUPTK</label>
                  <input
                    type="text"
                    value={formData.nuptk}
                    onChange={(e) => setFormData({ ...formData, nuptk: e.target.value })}
                    placeholder="16 Digit NUPTK"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIK (Akan Dienkripsi AES-256)</label>
                  <input
                    type="text"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    placeholder="16 Digit NIK KTP"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No WhatsApp</label>
                  <input
                    type="text"
                    value={formData.noHp}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit Sekolah Asal</label>
                  <select
                    value={formData.sekolah}
                    onChange={(e) => setFormData({ ...formData, sekolah: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="SDN WARGAJAYA">SDN WARGAJAYA</option>
                    <option value="SDN SIRNAJAYA 01">SDN SIRNAJAYA 01</option>
                    <option value="SDN SIRNAJAYA 02">SDN SIRNAJAYA 02</option>
                    <option value="SDN SIRNAJAYA 03">SDN SIRNAJAYA 03</option>
                    <option value="SDN SIRNAJAYA 04">SDN SIRNAJAYA 04</option>
                    <option value="SDN SUKAHARJA 01">SDN SUKAHARJA 01</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan dalam Ranting</label>
                  <select
                    value={formData.jabatanRanting}
                    onChange={(e) => setFormData({ ...formData, jabatanRanting: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="Anggota">Anggota Biasa</option>
                    <option value="Ketua Seksi Organisasi">Ketua Seksi Organisasi</option>
                    <option value="Ketua Seksi Advokasi">Ketua Seksi Advokasi</option>
                    <option value="Ketua Seksi Kesejahteraan">Ketua Seksi Kesejahteraan</option>
                    <option value="Ketua Seksi Diklat">Ketua Seksi Diklat</option>
                    <option value="Ketua Seksi Kominfo">Ketua Seksi Kominfo</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
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
                  Simpan & Terbitkan KTA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

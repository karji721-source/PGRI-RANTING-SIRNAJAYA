import React, { useState } from 'react';
import { Tugas, Member, UserRole } from '../../types';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  PlayCircle, 
  ListFilter,
  Layers,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TugasTabProps {
  tugasList: Tugas[];
  members: Member[];
  currentRole: UserRole;
  onAddTask: (tugas: Tugas) => void;
  onUpdateTugasProgres: (tugasId: string, progres: number, status: Tugas['status']) => void;
}

export const TugasTab: React.FC<TugasTabProps> = ({
  tugasList,
  members,
  currentRole,
  onAddTask,
  onUpdateTugasProgres,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [filterDivisi, setFilterDivisi] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Task form state
  const [formJudul, setFormJudul] = useState('');
  const [formDivisi, setFormDivisi] = useState('Organisasi & Kaderisasi');
  const [formPJId, setFormPJId] = useState(members[0]?.id || '');
  const [formTenggat, setFormTenggat] = useState('2026-10-15');
  const [formPrioritas, setFormPrioritas] = useState<Tugas['prioritas']>('Tinggi');
  const [formDeskripsi, setFormDeskripsi] = useState('');

  const isPrivileged = currentRole !== 'anggota';

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul) return;

    const pjMember = members.find(m => m.id === formPJId);

    const newTask: Tugas = {
      id: `task-${Date.now()}`,
      judul: formJudul,
      divisi: formDivisi,
      penanggungJawabId: formPJId,
      penanggungJawabNama: pjMember ? pjMember.nama : 'Pengurus Ranting',
      tenggatWaktu: formTenggat,
      prioritas: formPrioritas,
      status: 'Belum Dimulai',
      progres: 0,
      deskripsi: formDeskripsi
    };

    onAddTask(newTask);
    setShowAddModal(false);
    setFormJudul('');
    setFormDeskripsi('');

    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const filteredTasks = tugasList.filter((t) => {
    if (filterDivisi === 'all') return true;
    return t.divisi === filterDivisi;
  });

  const getPriorityBadge = (p: Tugas['prioritas']) => {
    switch (p) {
      case 'Mendesak':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Tinggi':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Sedang':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Rendah':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const columns: { id: Tugas['status']; title: string; color: string }[] = [
    { id: 'Belum Dimulai', title: 'Belum Dimulai', color: 'border-slate-300' },
    { id: 'Sedang Berjalan', title: 'Sedang Berjalan', color: 'border-blue-400' },
    { id: 'Review', title: 'Review & Evaluasi', color: 'border-amber-400' },
    { id: 'Selesai', title: 'Selesai', color: 'border-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-50 text-red-600">
              <CheckSquare className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Manajemen Tugas & Progres Proyek Anggota
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pelacakan akuntabilitas program kerja divisi, penugasan guru, dan evaluasi real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Daftar List
            </button>
          </div>

          {isPrivileged && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tugas Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const tasksInCol = filteredTasks.filter(t => t.status === col.id);

            return (
              <div 
                key={col.id}
                className="bg-slate-50 rounded-3xl p-4 border border-slate-200/80 min-h-[400px] flex flex-col gap-3"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      col.id === 'Selesai' ? 'bg-emerald-500' :
                      col.id === 'Sedang Berjalan' ? 'bg-blue-500' :
                      col.id === 'Review' ? 'bg-amber-500' : 'bg-slate-400'
                    }`}></span>
                    <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                      {col.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold bg-white text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                    {tasksInCol.length}
                  </span>
                </div>

                {/* Cards in column */}
                <div className="space-y-3 flex-1">
                  {tasksInCol.map((task) => (
                    <div 
                      key={task.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(task.prioritas)}`}>
                          {task.prioritas}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {task.divisi.split(' ')[0]}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                        {task.judul}
                      </h4>

                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {task.deskripsi}
                      </p>

                      {/* Progress Bar & Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-400">Progres</span>
                          <span className="text-blue-600 font-mono">{task.progres}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full ${task.progres === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                            style={{ width: `${task.progres}%` }}
                          ></div>
                        </div>

                        {/* Interactive Slider */}
                        {isPrivileged && (
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={task.progres}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              let newStatus = task.status;
                              if (val === 100) newStatus = 'Selesai';
                              else if (val > 0 && task.status === 'Belum Dimulai') newStatus = 'Sedang Berjalan';
                              onUpdateTugasProgres(task.id, val, newStatus);
                            }}
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-1"
                          />
                        )}
                      </div>

                      {/* Assignee & Deadline */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <div className="flex items-center gap-1 truncate max-w-[120px]" title={task.penanggungJawabNama}>
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{task.penanggungJawabNama.split(',')[0]}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{task.tenggatWaktu}</span>
                        </div>
                      </div>

                      {/* Status mover button */}
                      {isPrivileged && (
                        <div className="flex items-center justify-between pt-1">
                          <select
                            value={task.status}
                            onChange={(e) => {
                              const newStatus = e.target.value as Tugas['status'];
                              const newProg = newStatus === 'Selesai' ? 100 : task.progres;
                              onUpdateTugasProgres(task.id, newProg, newStatus);
                            }}
                            className="text-[10px] font-bold py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 w-full"
                          >
                            <option value="Belum Dimulai">→ Belum Dimulai</option>
                            <option value="Sedang Berjalan">→ Sedang Berjalan</option>
                            <option value="Review">→ Review & Evaluasi</option>
                            <option value="Selesai">✓ Tandai Selesai</option>
                          </select>
                        </div>
                      )}
                    </div>
                  ))}

                  {tasksInCol.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-xs text-slate-400">
                      Tidak ada tugas
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Nama Proyek / Tugas</th>
                <th className="py-3.5 px-4">Divisi Ranting</th>
                <th className="py-3.5 px-4">Penanggung Jawab</th>
                <th className="py-3.5 px-4">Prioritas</th>
                <th className="py-3.5 px-4">Tenggat Waktu</th>
                <th className="py-3.5 px-4">Progres & Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{t.judul}</div>
                    <div className="text-[11px] text-slate-400">{t.deskripsi}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{t.divisi}</td>
                  <td className="py-3.5 px-4 text-slate-800 font-semibold">{t.penanggungJawabNama}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(t.prioritas)}`}>
                      {t.prioritas}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{t.tenggatWaktu}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600">{t.progres}%</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-base">
                Buat Tugas & Proyek Ranting Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Tugas / Proyek</label>
                <input
                  type="text"
                  required
                  value={formJudul}
                  onChange={(e) => setFormJudul(e.target.value)}
                  placeholder="Contoh: Pengadaan Seragam Batik Guru Ranting"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Divisi Pelaksana</label>
                  <select
                    value={formDivisi}
                    onChange={(e) => setFormDivisi(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="Badan Pengurus Harian (BPH)">BPH Ranting</option>
                    <option value="Keuangan & Perbendaharaan">Keuangan / Bendahara</option>
                    <option value="Organisasi & Kaderisasi">Organisasi & Kaderisasi</option>
                    <option value="Advokasi & Perlindungan Profesi">Advokasi & Perlindungan Guru</option>
                    <option value="Kesejahteraan & Ketenagakerjaan">Kesejahteraan & Sosial</option>
                    <option value="Pendidikan & Pelatihan (Diklat)">Pendidikan & Pelatihan</option>
                    <option value="Komunikasi, Informasi & Publikasi">Kominfo & IT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Penanggung Jawab (PJ)</label>
                  <select
                    value={formPJId}
                    onChange={(e) => setFormPJId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.nama} ({m.jabatanRanting})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Prioritas</label>
                  <select
                    value={formPrioritas}
                    onChange={(e) => setFormPrioritas(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="Mendesak">Mendesak (Critical)</option>
                    <option value="Tinggi">Tinggi (High)</option>
                    <option value="Sedang">Sedang (Medium)</option>
                    <option value="Rendah">Rendah (Low)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tenggat Waktu</label>
                  <input
                    type="date"
                    required
                    value={formTenggat}
                    onChange={(e) => setFormTenggat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi & Target Capaian</label>
                <textarea
                  rows={3}
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  placeholder="Rincian langkah pengerjaan tugas..."
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
                  Simpan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

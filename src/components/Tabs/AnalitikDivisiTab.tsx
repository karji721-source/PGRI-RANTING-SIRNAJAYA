import React, { useState } from 'react';
import { DivisiAnalytics, UserRole } from '../../types';
import { 
  TrendingUp, 
  Award, 
  PieChart, 
  BarChart3, 
  Target, 
  CheckCircle2, 
  ShieldCheck, 
  Briefcase,
  Wallet,
  Users
} from 'lucide-react';

interface AnalitikDivisiTabProps {
  divisiAnalytics: DivisiAnalytics[];
  currentRole: UserRole;
}

export const AnalitikDivisiTab: React.FC<AnalitikDivisiTabProps> = ({
  divisiAnalytics,
  currentRole,
}) => {
  const [selectedDivisi, setSelectedDivisi] = useState<DivisiAnalytics>(divisiAnalytics[0]);

  const rataRataKPI = Math.round(
    divisiAnalytics.reduce((acc, d) => acc + d.kpi, 0) / divisiAnalytics.length
  );

  const totalProgramSelesai = divisiAnalytics.reduce((acc, d) => acc + d.programSelesai, 0);
  const totalProgramTarget = divisiAnalytics.reduce((acc, d) => acc + d.totalProgram, 0);

  const totalAnggaranTerpakai = divisiAnalytics.reduce((acc, d) => acc + d.anggaranTerpakai, 0);
  const totalAnggaranAlokasi = divisiAnalytics.reduce((acc, d) => acc + d.anggaranAlokasi, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Dasbor Analitik Kinerja Divisi Ranting
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluasi mendalam pencapaian indikator kinerja (KPI), realisasi program kerja, dan serapan anggaran divisi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            Rata-rata KPI: {rataRataKPI}% (Sangat Baik)
          </div>
        </div>
      </div>

      {/* KPI Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Indeks KPI Gabungan</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h4 className="text-2xl font-black text-slate-900">{rataRataKPI}%</h4>
              <span className="text-xs text-emerald-600 font-bold">Grade A</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Seluruh 7 Seksi Ranting Aktif</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Program Terealisasi</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h4 className="text-2xl font-black text-blue-700">{totalProgramSelesai}</h4>
              <span className="text-xs font-semibold text-slate-400">/ {totalProgramTarget} Program</span>
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">
              {Math.round((totalProgramSelesai / totalProgramTarget) * 100)}% Target Tercapai
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Serapan Anggaran Kerja</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h4 className="text-2xl font-black text-emerald-700">
                Rp {totalAnggaranTerpakai.toLocaleString('id-ID')}
              </h4>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Alokasi Total: Rp {totalAnggaranAlokasi.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Division List & Deep-Dive Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: All Divisions Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Peringkat Kinerja KPI per Divisi
            </h3>
            <span className="text-xs text-slate-400">Klik untuk melihat detail</span>
          </div>

          <div className="space-y-4">
            {divisiAnalytics.map((div) => {
              const isSelected = selectedDivisi.singkatan === div.singkatan;

              return (
                <div 
                  key={div.singkatan}
                  onClick={() => setSelectedDivisi(div)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-purple-500 bg-purple-50/40 shadow-xs' 
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <div className="font-extrabold text-slate-800">
                      {div.nama}
                    </div>
                    <div className="font-mono font-black text-purple-700 text-sm">
                      {div.kpi}%
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${div.kpi}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Koordinator: {div.koordinator.split(',')[0]}</span>
                    <span>Program: {div.programSelesai}/{div.totalProgram} Selesai</span>
                    <span>Partisipasi: {div.partisipasiPersen}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-Dive Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  {selectedDivisi.singkatan}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {selectedDivisi.nama}
                </h3>
                <p className="text-xs text-slate-500">
                  Koordinator: <span className="font-semibold text-slate-800">{selectedDivisi.koordinator}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-purple-700">{selectedDivisi.kpi}%</span>
                <span className="block text-[10px] font-bold text-slate-400">SKOR KPI</span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] font-bold block">PROGRAM KERJA</span>
                <span className="text-base font-black text-slate-900">
                  {selectedDivisi.programSelesai} / {selectedDivisi.totalProgram}
                </span>
                <span className="text-[10px] text-emerald-600 block font-semibold">Tuntas 100% Sesuai Raker</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] font-bold block">PARTISIPASI GURU</span>
                <span className="text-base font-black text-blue-700">
                  {selectedDivisi.partisipasiPersen}%
                </span>
                <span className="text-[10px] text-slate-500 block">Tingkat Kehadiran</span>
              </div>
            </div>

            {/* Anggaran Breakdown */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <span className="text-slate-500 font-bold block uppercase tracking-wider text-[10px]">
                Realisasi Anggaran Divisi
              </span>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-600 font-medium">Terpakai:</span>
                <span className="font-bold text-slate-900">
                  Rp {selectedDivisi.anggaranTerpakai.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-600 font-medium">Alokasi Pleno:</span>
                <span className="font-bold text-slate-700">
                  Rp {selectedDivisi.anggaranAlokasi.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((selectedDivisi.anggaranTerpakai / selectedDivisi.anggaranAlokasi) * 100))}%` }}
                ></div>
              </div>
            </div>

            {/* Catatan Evaluasi & Rekomendasi */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-amber-900 block">Evaluasi Pengurus Ranting:</span>
              <p className="text-amber-800 leading-relaxed">
                {selectedDivisi.evaluasi}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              Data analitik diperbarui otomatis via Cloud PGRI Smart Engine.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};

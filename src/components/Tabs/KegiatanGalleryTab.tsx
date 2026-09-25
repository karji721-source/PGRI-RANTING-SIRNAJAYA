import React, { useState } from 'react';
import { Kegiatan, UserRole } from '../../types';
import { 
  Camera, 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  X, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface KegiatanGalleryTabProps {
  kegiatanList: Kegiatan[];
  currentRole: UserRole;
  onAddKegiatan: (kegiatan: Kegiatan) => void;
}

export const KegiatanGalleryTab: React.FC<KegiatanGalleryTabProps> = ({
  kegiatanList,
  currentRole,
  onAddKegiatan,
}) => {
  const [selectedKategori, setSelectedKategori] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeLightbox, setActiveLightbox] = useState<{
    kegiatan: Kegiatan;
    fotoIndex: number;
  } | null>(null);

  // Upload Form State
  const [formJudul, setFormJudul] = useState('');
  const [formTanggal, setFormTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [formLokasi, setFormLokasi] = useState('SDN Sirnajaya 01');
  const [formKategori, setFormKategori] = useState<Kegiatan['kategori']>('Rapat');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formDihadiri, setFormDihadiri] = useState(25);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80'
  ]);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState('');

  const isPrivileged = currentRole !== 'anggota';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedPhotos(prev => [event.target?.result as string, ...prev]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSamplePhoto = (url: string) => {
    if (!url) return;
    setUploadedPhotos(prev => [url, ...prev]);
    setPreviewPhotoUrl('');
  };

  const handleSaveKegiatan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul) return;

    const newKegiatan: Kegiatan = {
      id: `keg-${Date.now()}`,
      judul: formJudul,
      tanggal: formTanggal,
      lokasi: formLokasi,
      kategori: formKategori,
      deskripsi: formDeskripsi,
      fotos: uploadedPhotos.length > 0 ? uploadedPhotos : [
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80'
      ],
      dihadiriOleh: Number(formDihadiri),
      dokumentator: 'Pengurus Ranting Sirnajaya 1'
    };

    onAddKegiatan(newKegiatan);
    setShowUploadModal(false);
    setFormJudul('');
    setFormDeskripsi('');

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const filteredKegiatan = kegiatanList.filter((k) => {
    if (selectedKategori === 'all') return true;
    return k.kategori === selectedKategori;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-50 text-red-600">
              <Camera className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Dokumentasi & Galeri Kegiatan Ranting
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Arsip foto kegiatan, rapat kerja, diklat pendidik, aksi sosial dan peringatan HGN PGRI Sirnajaya 1.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isPrivileged && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Unggah Foto Kegiatan Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Semua Kegiatan' },
          { id: 'Konferensi Ranting', label: 'Konferensi & Raker' },
          { id: 'Diklat Guru', label: 'Pelatihan & Workshop' },
          { id: 'Sosial & Santunan', label: 'Aksi Sosial & Peduli' },
          { id: 'Rapat', label: 'Rapat Koordinasi' },
          { id: 'Peringatan HGN & HUT PGRI', label: 'HGN & HUT PGRI' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedKategori(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedKategori === cat.id
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Kegiatan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKegiatan.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
          >
            <div>
              {/* Photo Showcase */}
              <div 
                className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer"
                onClick={() => setActiveLightbox({ kegiatan: item, fotoIndex: 0 })}
              >
                <img
                  src={item.fotos[0]}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-extrabold uppercase shadow-sm">
                    {item.kategori}
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-3 text-white text-[11px] font-semibold flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{item.fotos.length} Foto</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-red-600" />
                    {item.tanggal}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    {item.dihadiriOleh} Hadir
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                  {item.judul}
                </h3>
                
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  {item.lokasi}
                </p>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>
            </div>

            {/* Thumbnail Gallery & Full View Button */}
            <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {item.fotos.slice(0, 3).map((f, i) => (
                  <img
                    key={i}
                    src={f}
                    alt="thumb"
                    onClick={() => setActiveLightbox({ kegiatan: item, fotoIndex: i })}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveLightbox({ kegiatan: item, fotoIndex: 0 })}
                className="text-xs text-red-600 font-bold hover:underline"
              >
                Buka Album →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black flex items-center justify-center">
              <img
                src={activeLightbox.kegiatan.fotos[activeLightbox.fotoIndex]}
                alt="preview"
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />

              {activeLightbox.kegiatan.fotos.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      const total = activeLightbox.kegiatan.fotos.length;
                      setActiveLightbox({
                        ...activeLightbox,
                        fotoIndex: (activeLightbox.fotoIndex - 1 + total) % total
                      });
                    }}
                    className="absolute left-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/80"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() => {
                      const total = activeLightbox.kegiatan.fotos.length;
                      setActiveLightbox({
                        ...activeLightbox,
                        fotoIndex: (activeLightbox.fotoIndex + 1) % total
                      });
                    }}
                    className="absolute right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/80"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 text-center text-white space-y-1">
              <h4 className="text-base font-bold">{activeLightbox.kegiatan.judul}</h4>
              <p className="text-xs text-white/70">
                {activeLightbox.kegiatan.lokasi} • {activeLightbox.kegiatan.tanggal} • Foto {activeLightbox.fotoIndex + 1} dari {activeLightbox.kegiatan.fotos.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Kegiatan Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-base">
                Unggah Dokumentasi Kegiatan Ranting
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveKegiatan} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama / Judul Kegiatan</label>
                <input
                  type="text"
                  required
                  value={formJudul}
                  onChange={(e) => setFormJudul(e.target.value)}
                  placeholder="Contoh: Rapat Pleno Persiapan HGN 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={formKategori}
                    onChange={(e) => setFormKategori(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="Rapat">Rapat Koordinasi</option>
                    <option value="Diklat Guru">Diklat Guru / Workshop</option>
                    <option value="Sosial & Santunan">Sosial & Santunan</option>
                    <option value="Konferensi Ranting">Konferensi Ranting</option>
                    <option value="Peringatan HGN & HUT PGRI">HGN & HUT PGRI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={formTanggal}
                    onChange={(e) => setFormTanggal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Kegiatan</label>
                  <input
                    type="text"
                    value={formLokasi}
                    onChange={(e) => setFormLokasi(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Anggota Hadir</label>
                  <input
                    type="number"
                    value={formDihadiri}
                    onChange={(e) => setFormDihadiri(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi & Notulen Singkat</label>
                <textarea
                  rows={3}
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  placeholder="Ringkasan jalannya kegiatan dan hasil yang dicapai..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              {/* Upload Foto Section */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Upload File Foto</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-red-400 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Pilih Foto dari Galeri / HP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Previews */}
                <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
                  {uploadedPhotos.map((photo, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                      <img src={photo} alt="prev" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setUploadedPhotos(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-md"
                >
                  Simpan & Publikasikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

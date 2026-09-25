import React, { useState, useRef } from 'react';
import { useLogo } from '../context/LogoContext';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Link as LinkIcon,
  ShieldCheck,
  Eye
} from 'lucide-react';

interface UploadLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadLogoModal: React.FC<UploadLogoModalProps> = ({ isOpen, onClose }) => {
  const { logoUrl, setLogoUrl, resetLogo, isCustomLogo } = useLogo();
  const [previewUrl, setPreviewUrl] = useState<string>(logoUrl);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Optimize and scale image using HTML Canvas to keep under localStorage quota
  const processImageFile = (file: File) => {
    setErrorMessage('');
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Mohon unggah file gambar yang valid (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Ukuran file maksimal 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Create canvas to normalize and optimize
        const canvas = document.createElement('canvas');
        const MAX_DIM = 512;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/png', 0.95);
          setPreviewUrl(optimizedDataUrl);
        } else {
          setPreviewUrl(result);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      setErrorMessage('Masukkan tautan gambar terlebih dahulu.');
      return;
    }
    setPreviewUrl(urlInput.trim());
    setErrorMessage('');
  };

  const handleSave = () => {
    setLogoUrl(previewUrl);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    resetLogo();
    setPreviewUrl(logoUrl);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                Upload & Ganti Logo Organisasi
              </h3>
              <p className="text-xs text-red-100">
                Sistem Manajemen PGRI Ranting Sirnajaya
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Success Banner */}
          {isSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-in slide-in-from-top">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Logo berhasil diperbarui dan diterapkan ke seluruh sistem!</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-xs font-semibold animate-in slide-in-from-top">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tab Selector */}
          <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Unggah dari File</span>
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all ${
                activeTab === 'url'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>Tautan URL Gambar</span>
            </button>
          </div>

          {/* Upload Area */}
          {activeTab === 'upload' ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-red-500 bg-red-50/70 scale-[0.99]'
                  : 'border-slate-300 hover:border-red-400 bg-slate-50/60 hover:bg-red-50/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3 shadow-inner">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-900 mb-1">
                Tarik & Lepaskan File Logo Di Sini
              </p>
              <p className="text-xs text-slate-500 mb-3">
                atau klik untuk memilih file dari komputer / galeri HP Anda
              </p>
              <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] text-slate-600 font-semibold shadow-2xs">
                Mendukung PNG, JPG, JPEG, SVG, WebP (Maks 8MB)
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Tautan URL Gambar Logo
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://contoh.com/logo-pgri.png"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                >
                  Terapkan
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Pastikan tautan dapat diakses secara publik dan berupa format gambar transparan.
              </p>
            </div>
          )}

          {/* Live Previews */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-slate-500" />
                Pratinjau Penerapan Logo
              </span>
              <span className="text-[11px] text-slate-500">
                Tampilan real-time di sistem
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Preview 1: Header Style */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-md border-2 border-red-600 ring-2 ring-red-100 flex-shrink-0">
                  <img
                    src={previewUrl}
                    alt="Pratinjau Logo"
                    className="w-full h-full object-contain p-0.5"
                    referrerPolicy="no-referrer"
                    onError={() => setErrorMessage('Gagal memuat pratinjau gambar.')}
                  />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                    Header Bar
                  </span>
                  <p className="text-xs font-extrabold text-slate-900 mt-1 line-clamp-1">
                    RANTING SIRNAJAYA
                  </p>
                </div>
              </div>

              {/* Preview 2: KTA Card Style */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950 to-red-900 text-white border border-red-800/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-md border border-red-300 flex-shrink-0">
                  <img
                    src={previewUrl}
                    alt="Pratinjau KTA"
                    className="w-full h-full object-contain p-0.5"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-red-300">
                    KTA Digital
                  </span>
                  <p className="text-xs font-black text-white line-clamp-1">
                    PERSATUAN GURU RI
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reset Information */}
          {isCustomLogo && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
              <span>Logo kustom aktif tersimpan di perangkat ini.</span>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 font-bold text-amber-800 hover:text-amber-950 underline text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset ke Default
              </button>
            </div>
          )}

        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200/70 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan & Terapkan Logo</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

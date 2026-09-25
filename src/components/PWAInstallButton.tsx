import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone } from 'lucide-react';
import { PlayStoreDownloadModal } from './PlayStoreDownloadModal';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title="Download & Install Aplikasi di HP (Play Store Ready)"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-sm shadow-emerald-600/20 text-xs font-bold transition-all active:scale-95 cursor-pointer ${className}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Download Aplikasi HP</span>
        <span className="sm:hidden">App HP</span>
      </button>

      <PlayStoreDownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

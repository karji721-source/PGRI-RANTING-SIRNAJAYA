import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-amber-600 text-white px-3.5 py-2 text-xs font-bold shadow-lg animate-in slide-in-from-bottom">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>Mode Offline — Anda sedang menggunakan data tersimpan.</span>
    </div>
  );
};

import React from 'react';
import { UserRole, NotificationItem } from '../types';
import { useLogo } from '../context/LogoContext';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  ShieldCheck, 
  CloudCheck, 
  Bell, 
  Users, 
  Building2, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Smartphone,
  Laptop,
  Upload,
  Camera
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBlastModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  notifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  isMobilePreview,
  setIsMobilePreview,
  setActiveTab,
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = React.useState(false);

  const unreadCount = notifications.filter(n => !n.dibaca).length;

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return { label: 'Ketua / Super Admin', color: 'bg-red-700 text-white border-red-800' };
      case 'bendahara':
        return { label: 'Bendahara Ranting', color: 'bg-emerald-700 text-white border-emerald-800' };
      case 'sekretaris':
        return { label: 'Sekretaris Ranting', color: 'bg-blue-700 text-white border-blue-800' };
      case 'anggota':
        return { label: 'Anggota Guru', color: 'bg-amber-700 text-white border-amber-800' };
    }
  };

  const roleInfo = getRoleBadge(currentRole);
  const { logoUrl, openUploadModal } = useLogo();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openUploadModal}
              title="Klik untuk Upload / Ganti Logo PGRI"
              className="group relative w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-md shadow-red-600/20 border-2 border-red-600 ring-2 ring-red-100 flex-shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <img
                src={logoUrl}
                alt="Logo PGRI Ranting Sirnajaya"
                className="w-full h-full object-contain p-0.5 transition-opacity group-hover:opacity-40"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <Camera className="w-4 h-4 text-white" />
                <span className="text-[8px] font-black uppercase tracking-tighter">Ubah</span>
              </div>
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                  RANTING SIRNAJAYA
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-600">
                  Cab. Kec. Sukamakmur, Kab. Bogor
                </span>
              </div>
              <h1 className="text-sm sm:text-lg font-black text-slate-900 tracking-tight leading-tight mt-0.5 uppercase">
                SISTEM MANAJEMEN PGRI RANTING SIRNAJAYA
              </h1>
            </div>
          </div>

          {/* Right Info: Status, Role Switcher, Notifications, Device Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Download / Install App PWA Button */}
            <PWAInstallButton />

            {/* Upload Logo Action Button */}
            <button
              onClick={openUploadModal}
              title="Upload / Ganti Logo PGRI"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden sm:inline">Upload Logo</span>
            </button>

            {/* Cloud & Security Status Badges (Desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <CloudCheck className="w-3.5 h-3.5" />
                <span>Cloud Sync Real-time</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>AES-256 Enkripsi</span>
              </div>
            </div>

            {/* Mobile View Toggle Button */}
            <button
              onClick={() => setIsMobilePreview(!isMobilePreview)}
              title={isMobilePreview ? "Beralih ke Tampilan Normal Desktop" : "Simulasikan Tampilan Layar HP Anggota"}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isMobilePreview 
                  ? 'bg-red-50 text-red-700 border-red-300' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isMobilePreview ? <Laptop className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5 text-slate-500" />}
              <span>{isMobilePreview ? 'Mode Desktop' : 'Mode Mobile Anggota'}</span>
            </button>

            {/* Role Switcher */}
            <div className="relative">
              <label htmlFor="role-select" className="sr-only">Pilih Peran Akses</label>
              <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-slate-500 ml-1.5 mr-1" />
                <select
                  id="role-select"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                  className="bg-transparent text-xs font-bold text-slate-800 pr-2 py-1 outline-hidden cursor-pointer"
                >
                  <option value="super_admin">Ketua / Super Admin</option>
                  <option value="bendahara">Bendahara Ranting</option>
                  <option value="sekretaris">Sekretaris Ranting</option>
                  <option value="anggota">Akses Mandiri Anggota</option>
                </select>
              </div>
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors focus:ring-2 focus:ring-red-500"
                aria-label="Notifikasi"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Panel */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">Pusat Notifikasi Ranting</span>
                      {unreadCount > 0 && (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                          {unreadCount} Baru
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Tandai Semua Dibaca
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          markNotificationAsRead(item.id);
                          if (item.actionLink) {
                            setActiveTab(item.actionLink);
                            setShowNotifDropdown(false);
                          }
                        }}
                        className={`py-3 px-2 rounded-lg cursor-pointer transition-colors ${
                          item.dibaca ? 'hover:bg-slate-50 opacity-75' : 'bg-red-50/50 hover:bg-red-50'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5">
                            {item.tipe === 'tagihan' ? (
                              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4" />
                              </div>
                            ) : item.tipe === 'rapat' ? (
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                                <Users className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-slate-900">{item.judul}</h4>
                              <span className="text-[10px] text-slate-400">{item.waktu}</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">{item.pesan}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 text-center">
                    <span className="text-[11px] text-slate-400">
                      Sistem Notifikasi Push Otomatis Ranting Sirnajaya 1
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

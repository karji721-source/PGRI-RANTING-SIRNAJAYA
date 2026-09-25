import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Camera, 
  Calendar, 
  CheckSquare, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unpaidDuesCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  unpaidDuesCount,
}) => {
  const tabs = [
    { id: 'ringkasan', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'anggota', label: 'Keanggotaan & Pengurus', icon: Users },
    { id: 'keuangan', label: 'Iuran & Kas Transparan', icon: Wallet, badge: unpaidDuesCount > 0 ? unpaidDuesCount : undefined },
    { id: 'galeri', label: 'Galeri Kegiatan', icon: Camera },
    { id: 'rapat', label: 'Jadwal Rapat', icon: Calendar },
    { id: 'tugas', label: 'Manajemen Tugas', icon: CheckSquare },
    { id: 'analitik', label: 'Analitik Divisi', icon: TrendingUp },
    { id: 'keamanan', label: 'Keamanan & Cloud', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Desktop & Tablet Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs shadow-red-600/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-white text-red-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Ultra-responsive mobile access) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 shadow-lg">
        <div className="flex items-center justify-around">
          {[
            { id: 'ringkasan', label: 'Beranda', icon: LayoutDashboard },
            { id: 'anggota', label: 'Anggota', icon: Users },
            { id: 'keuangan', label: 'Iuran', icon: Wallet, badge: unpaidDuesCount > 0 ? unpaidDuesCount : undefined },
            { id: 'galeri', label: 'Galeri', icon: Camera },
            { id: 'rapat', label: 'Rapat', icon: Calendar },
            { id: 'tugas', label: 'Tugas', icon: CheckSquare },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center p-1 rounded-xl relative transition-colors ${
                  isActive ? 'text-red-600 font-bold' : 'text-slate-500 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

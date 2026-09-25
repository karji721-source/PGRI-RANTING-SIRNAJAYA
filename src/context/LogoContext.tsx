import React, { createContext, useContext, useState } from 'react';
import { LOGO_PGRI_URL } from '../assets/logo';

interface LogoContextType {
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  resetLogo: () => void;
  isCustomLogo: boolean;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  isUploadModalOpen: boolean;
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export const LogoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logoUrl, setLogoUrlState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('pgri_custom_logo');
      return saved || LOGO_PGRI_URL;
    } catch {
      return LOGO_PGRI_URL;
    }
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const setLogoUrl = (url: string) => {
    setLogoUrlState(url);
    try {
      localStorage.setItem('pgri_custom_logo', url);
    } catch (e) {
      console.warn('Failed to save logo to localStorage', e);
    }
  };

  const resetLogo = () => {
    setLogoUrlState(LOGO_PGRI_URL);
    try {
      localStorage.removeItem('pgri_custom_logo');
    } catch (e) {
      console.warn('Failed to remove custom logo', e);
    }
  };

  const isCustomLogo = logoUrl !== LOGO_PGRI_URL;

  return (
    <LogoContext.Provider
      value={{
        logoUrl,
        setLogoUrl,
        resetLogo,
        isCustomLogo,
        openUploadModal: () => setIsUploadModalOpen(true),
        closeUploadModal: () => setIsUploadModalOpen(false),
        isUploadModalOpen,
      }}
    >
      {children}
    </LogoContext.Provider>
  );
};

export const useLogo = () => {
  const context = useContext(LogoContext);
  if (!context) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
};

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import type { SiteContent } from '@/types';
import { defaultContent } from '@/data/defaultContent';

interface SiteContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => void;
  updateCompanyName: (companyName: SiteContent['companyName']) => void;
  updateLogoUrl: (logoUrl: SiteContent['logoUrl']) => void;
  updateHero: (hero: SiteContent['hero']) => void;
  updateAbout: (about: SiteContent['about']) => void;
  updatePortfolio: (portfolio: SiteContent['portfolio']) => void;
  updateServices: (services: SiteContent['services']) => void;
  updateTestimonials: (testimonials: SiteContent['testimonials']) => void;
  updateContacts: (contacts: SiteContent['contacts']) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

const STORAGE_KEY = 'site_content';

export function SiteProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as SiteContent;
          if (parsed.hero?.primaryButtonText === 'Бесплатная консультация') {
            parsed.hero.primaryButtonText = defaultContent.hero.primaryButtonText;
          }
          return { ...defaultContent, ...parsed };
        } catch (e) {
          console.error('Failed to parse saved content:', e);
        }
      }
    }
    return defaultContent;
  });
  const hasStorageError = useRef(false);

  useEffect(() => {
    if (hasStorageError.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (error) {
      hasStorageError.current = true;
      console.error('Failed to persist content to localStorage:', error);
    }
  }, [content]);

  const updateContent = (newContent: SiteContent) => {
    setContent(newContent);
  };

  const updateCompanyName = (companyName: SiteContent['companyName']) => {
    setContent(prev => ({ ...prev, companyName }));
  };

  const updateLogoUrl = (logoUrl: SiteContent['logoUrl']) => {
    setContent(prev => ({ ...prev, logoUrl }));
  };

  const updateHero = (hero: SiteContent['hero']) => {
    setContent(prev => ({ ...prev, hero }));
  };

  const updateAbout = (about: SiteContent['about']) => {
    setContent(prev => ({ ...prev, about }));
  };

  const updatePortfolio = (portfolio: SiteContent['portfolio']) => {
    setContent(prev => ({ ...prev, portfolio }));
  };

  const updateServices = (services: SiteContent['services']) => {
    setContent(prev => ({ ...prev, services }));
  };

  const updateTestimonials = (testimonials: SiteContent['testimonials']) => {
    setContent(prev => ({ ...prev, testimonials }));
  };

  const updateContacts = (contacts: SiteContent['contacts']) => {
    setContent(prev => ({ ...prev, contacts }));
  };

  return (
    <SiteContext.Provider
      value={{
        content,
        updateContent,
        updateCompanyName,
        updateLogoUrl,
        updateHero,
        updateAbout,
        updatePortfolio,
        updateServices,
        updateTestimonials,
        updateContacts,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}

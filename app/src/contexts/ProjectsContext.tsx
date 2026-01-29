/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Project } from '@/types';

interface ProjectsContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  addImagesToProject: (projectId: string, images: string[]) => void;
  removeImageFromProject: (projectId: string, imageIndex: number) => void;
  reorderImages: (projectId: string, fromIndex: number, toIndex: number) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const STORAGE_KEY = 'site_projects';

// Demo projects with galleries
const defaultProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Современная квартира в ЖК "Ньютон"',
    category: 'apartments',
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    description: 'Проект дизайна интерьера трёхкомнатной квартиры площадью 95 м² для молодой семьи. Основная задача — создать светлое, воздушное пространство с элементами скандинавского стиля.',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
    ],
    area: '95 м²',
    location: 'Москва',
    year: '2024',
    createdAt: Date.now(),
  },
  {
    id: 'proj-2',
    title: 'Загородный дом в Подмосковье',
    category: 'houses',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-27b2c045efd7?w=1200&q=80',
    description: 'Полный редизайн интерьера двухэтажного загородного дома. Концепция — современный минимализм с тёплыми натуральными материалами.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-27b2c045efd7?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80',
    ],
    area: '240 м²',
    location: 'Подмосковье',
    year: '2023',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'proj-3',
    title: 'Офис IT-компании',
    category: 'commercial',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    description: 'Дизайн open-space офиса для технологической компании. Акцент на функциональность, комфорт сотрудников и современный образ.',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
      'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80',
    ],
    area: '350 м²',
    location: 'Москва',
    year: '2024',
    createdAt: Date.now() - 172800000,
  },
];

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // If saved data is empty array or invalid, use defaults
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.error('Failed to parse saved projects:', e);
        }
      }
    }
    return defaultProjects;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: Date.now(),
    };
    setProjects((prev) => [newProject, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const getProject = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  const addImagesToProject = (projectId: string, newImages: string[]) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, images: [...p.images, ...newImages] } : p
      )
    );
  };

  const removeImageFromProject = (projectId: string, imageIndex: number) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, images: p.images.filter((_, i) => i !== imageIndex) }
          : p
      )
    );
  };

  const reorderImages = (projectId: string, fromIndex: number, toIndex: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const images = [...p.images];
        const [removed] = images.splice(fromIndex, 1);
        images.splice(toIndex, 0, removed);
        return { ...p, images };
      })
    );
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        getProject,
        addImagesToProject,
        removeImageFromProject,
        reorderImages,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}

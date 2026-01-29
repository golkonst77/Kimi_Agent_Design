import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '@/contexts/ProjectsContext';
import { Header } from './Header';
import { Footer } from './Footer';
import type { Project } from '@/types';

const categories = [
  { id: 'all', label: 'Все проекты' },
  { id: 'apartments', label: 'Квартиры' },
  { id: 'houses', label: 'Дома' },
  { id: 'commercial', label: 'Коммерческие' },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const categoryLabels: Record<string, string> = {
    apartments: 'Квартира',
    houses: 'Дом',
    commercial: 'Коммерческий',
  };

  return (
    <Link
      ref={cardRef}
      to={`/project/${project.id}`}
      className={`group block transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative overflow-hidden rounded-lg">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="text-white/70 text-sm mb-2 block">
              {categoryLabels[project.category]}
              {project.area && ` • ${project.area}`}
            </span>
            <h3 className="text-white text-xl font-light">{project.title}</h3>
            <p className="text-white/80 text-sm mt-1 line-clamp-2">{project.description}</p>
            <span className="inline-flex items-center text-white/90 text-sm mt-3">
              Смотреть проект 
              <span className="ml-1">→</span>
            </span>
          </div>
        </div>

        {/* Always visible label */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-0 transition-opacity duration-300">
          <h3 className="text-white text-lg font-light">{project.title}</h3>
        </div>
        
        {/* Photo count badge */}
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {project.images.length} фото
        </div>
      </div>
      
      {/* Info below image */}
      <div className="mt-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{categoryLabels[project.category]}</span>
          {project.area && (
            <>
              <span>•</span>
              <span>{project.area}</span>
            </>
          )}
          {project.year && (
            <>
              <span>•</span>
              <span>{project.year}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProjectsPage() {
  const { projects } = useProjects();
  const [activeFilter, setActiveFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((item) => item.category === activeFilter);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-light text-white mb-4">
              Проекты
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto">
              Реализованные проекты — от концепции до воплощения
            </p>
          </div>
        </section>

        {/* Projects Grid Section */}
        <section
          ref={sectionRef}
          className="py-16 lg:py-20 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <div
              className={`flex flex-wrap justify-center gap-2 mb-10 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeFilter === category.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Projects Count */}
            <div className="text-center mb-8">
              <span className="text-gray-500">
                Показано {filteredProjects.length} из {projects.length} проектов
              </span>
            </div>

            {/* Grid */}
            {filteredProjects.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">Проекты не найдены</p>
                <Link to="/" className="text-gray-900 underline mt-2 inline-block">
                  Вернуться на главную
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

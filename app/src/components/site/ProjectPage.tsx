import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '@/contexts/ProjectsContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { ArrowLeft, MapPin, Maximize2, Ruler, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProject } = useProjects();
  const project = useMemo(() => getProject(projectId || ''), [projectId, getProject]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-light text-gray-900 mb-4">Проект не найден</h1>
            <Link to="/projects">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться к проектам
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  const categoryLabels: Record<string, string> = {
    apartments: 'Квартира',
    houses: 'Дом',
    commercial: 'Коммерческий проект',
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative h-[60vh] lg:h-[70vh]">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Back Button */}
          <div className="absolute top-6 left-4 lg:left-8">
            <Link to="/projects">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                К проектам
              </Button>
            </Link>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
            <div className="max-w-7xl mx-auto">
              <span className="text-white/70 text-sm uppercase tracking-wider">
                {categoryLabels[project.category]}
              </span>
              <h1 className="text-3xl lg:text-5xl font-light text-white mt-2">
                {project.title}
              </h1>
              
              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 mt-4">
                {project.area && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Ruler className="w-4 h-4" />
                    <span>{project.area}</span>
                  </div>
                )}
                {project.location && (
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                )}
                {project.year && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="w-4 h-4" />
                    <span>{project.year}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-light text-gray-900 mb-6">О проекте</h2>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
              {project.description}
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-light text-gray-900">
                Галерея проекта
              </h2>
              <span className="text-gray-500">
                {project.images.length} фотографий
              </span>
            </div>

            {/* Masonry Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {project.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative group cursor-pointer overflow-hidden rounded-lg ${
                    index === 0 ? 'col-span-2 row-span-2' : ''
                  }`}
                  onClick={() => openLightbox(index)}
                >
                  <div className={`${index === 0 ? 'aspect-square' : 'aspect-[4/3]'}`}>
                    <img
                      src={image}
                      alt={`${project.title} - фото ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Projects */}
        <OtherProjects currentProjectId={project.id} />
      </main>
      <Footer />

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <img
              src={project.images[currentImageIndex]}
              alt={`${project.title} - фото ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {project.images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Other Projects Component
function OtherProjects({ currentProjectId }: { currentProjectId: string }) {
  const { projects } = useProjects();
  const otherProjects = projects.filter((p) => p.id !== currentProjectId).slice(0, 3);

  if (otherProjects.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-light text-gray-900">Другие проекты</h2>
          <Link 
            to="/projects" 
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
          >
            Все проекты
            <span>→</span>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherProjects.map((project) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="group block"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-lg mb-3">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-medium group-hover:text-gray-600 transition-colors">
                {project.title}
              </h3>
              {project.area && (
                <p className="text-sm text-gray-500">{project.area}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

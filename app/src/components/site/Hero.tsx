import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSite } from '@/contexts/SiteContext';

export function Hero() {
  const { content } = useSite();
  const { hero } = content;
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const scrolled = window.scrollY;
        const parallaxElement = sectionRef.current.querySelector('.parallax-bg') as HTMLElement;
        if (parallaxElement) {
          parallaxElement.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div
        className="parallax-bg absolute inset-0 w-full h-[120%] -top-[10%]"
        style={{
          backgroundImage: `url(${hero.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight animate-fade-in-up">
            {hero.title}
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-10 font-light animate-fade-in-up animation-delay-200">
            {hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <Button
              onClick={() => scrollToSection('#contact')}
              size="lg"
              className="bg-white/95 text-gray-900 hover:bg-white px-8 shadow-lg shadow-black/20 ring-1 ring-white/70"
            >
              {hero.primaryButtonText}
            </Button>
            <Button
              onClick={() => navigate('/projects')}
              size="lg"
              variant="outline"
              className="border-white/80 text-white hover:bg-white hover:text-gray-900 px-8 bg-white/10 backdrop-blur-sm shadow-lg shadow-black/20"
            >
              {hero.secondaryButtonText}
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

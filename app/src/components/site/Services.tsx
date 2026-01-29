import { useEffect, useRef, useState } from 'react';
import { useSite } from '@/contexts/SiteContext';
import { MessageCircle, Palette, Eye, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, React.ElementType> = {
  MessageCircle,
  Palette,
  Eye,
  Package,
};

export function Services() {
  const { content } = useSite();
  const { services } = content;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-20 lg:py-32 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
            Услуги
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Полный спектр услуг по дизайну интерьера — от консультации до реализации проекта
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Palette;
            return (
              <div
                key={service.id}
                className={`group p-6 bg-gray-50 rounded-lg transition-all duration-500 hover:bg-white hover:shadow-lg hover:-translate-y-1 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="text-lg font-medium text-gray-900 mb-4">
                  {service.price}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={scrollToContact}
                >
                  Подробнее
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

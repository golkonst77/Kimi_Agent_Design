import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSite } from '@/contexts/SiteContext';

const navLinks = [
  { href: '/', label: 'Главная', isRoute: true },
  { href: '/projects', label: 'Проекты', isRoute: true },
  { href: '/#services', label: 'Услуги', isRoute: false },
  { href: '/#testimonials', label: 'Отзывы', isRoute: false },
  { href: '/#contact', label: 'Контакты', isRoute: false },
];

export function Header() {
  const { content } = useSite();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

      // Track active section on homepage
      if (isHomePage) {
        const sections = ['services', 'testimonials', 'contact'];
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.isRoute) {
      navigate(link.href);
    } else {
      // For hash links
      if (!isHomePage) {
        // Navigate to home first, then scroll
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(link.href.replace('/#', '#'));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.querySelector(link.href.replace('/#', '#'));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToContact = () => {
    if (!isHomePage) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('contact');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isActive = (link: typeof navLinks[0]) => {
    if (link.isRoute) {
      return location.pathname === link.href;
    }
    return activeSection === link.href.replace('/#', '');
  };

  if (isAdmin) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5'
            : isHomePage 
              ? 'bg-transparent' 
              : 'bg-white/90 backdrop-blur-xl shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 lg:h-20">
            {/* Logo */}
            <Link
              to="/"
              className={`flex items-center gap-3 text-xl lg:text-2xl font-light tracking-wide transition-colors duration-300 ${
                isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'
              }`}
            >
              <span
                className={`flex items-center justify-center rounded-lg p-1 ${
                  isScrolled || !isHomePage
                    ? 'bg-white/90'
                    : 'bg-white/80 backdrop-blur-sm'
                }`}
              >
                <img
                  src={content.logoUrl || '/logo-placeholder.svg'}
                  alt={`${content.companyName} logo`}
                  className="h-7 w-auto"
                />
              </span>
              <span className="text-sm sm:text-base">
                {content.companyName}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                    isActive(link)
                      ? isScrolled || !isHomePage
                        ? 'text-gray-900 bg-gray-100'
                        : 'text-white bg-black/30 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]'
                      : isScrolled || !isHomePage
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        : 'text-white/90 bg-black/20 hover:text-white hover:bg-black/30 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]'
                  }`}
                >
                  {link.label}
                  {isActive(link) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current" />
                  )}
                </button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Button
                onClick={scrollToContact}
                className={`relative overflow-hidden transition-all duration-300 ${
                  isScrolled || !isHomePage
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-white text-gray-900 hover:bg-white/90'
                }`}
              >
                <span className="relative z-10">Обсудить проект</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                isScrolled || !isHomePage
                  ? 'text-gray-900 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <div className="relative w-5 h-5">
                <span 
                  className={`absolute left-0 w-5 h-0.5 transition-all duration-300 ${
                    isScrolled || !isHomePage ? 'bg-gray-900' : 'bg-white'
                  } ${isMobileMenuOpen ? 'top-2 rotate-45' : 'top-0.5'}`}
                />
                <span 
                  className={`absolute left-0 top-2 w-5 h-0.5 transition-all duration-300 ${
                    isScrolled || !isHomePage ? 'bg-gray-900' : 'bg-white'
                  } ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
                />
                <span 
                  className={`absolute left-0 w-5 h-0.5 transition-all duration-300 ${
                    isScrolled || !isHomePage ? 'bg-gray-900' : 'bg-white'
                  } ${isMobileMenuOpen ? 'top-2 -rotate-45' : 'top-3.5'}`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-500 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <span className="text-lg font-light text-gray-900">Меню</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6">
              <ul className="space-y-2">
                {navLinks.map((link, index) => (
                  <li
                    key={link.href}
                    className={`transform transition-all duration-300 ${
                      isMobileMenuOpen 
                        ? 'translate-x-0 opacity-100' 
                        : 'translate-x-8 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 50 + 100}ms` }}
                  >
                    <button
                      onClick={() => handleNavClick(link)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 ${
                        isActive(link)
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100">
              <Button
                onClick={() => {
                  scrollToContact();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-gray-900 text-white hover:bg-gray-800"
              >
                Обсудить проект
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

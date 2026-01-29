import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSite } from '@/contexts/SiteContext';
import { Instagram, Send, MessageCircle } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Главная', isRoute: true },
  { href: '/projects', label: 'Проекты', isRoute: true },
  { href: '#services', label: 'Услуги', isRoute: false },
  { href: '#testimonials', label: 'Отзывы', isRoute: false },
  { href: '#contact', label: 'Контакты', isRoute: false },
];

export function Footer() {
  const { content } = useSite();
  const { contacts } = content;
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleNavClick = (link: typeof navLinks[number]) => {
    if (link.isRoute) {
      navigate(link.href);
      return;
    }

    if (!isHomePage) {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(link.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const element = document.querySelector(link.href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center rounded-lg bg-white/90 p-1">
                <img
                  src="/logo-placeholder.svg"
                  alt={`${content.companyName} logo`}
                  className="h-8 w-auto"
                />
              </span>
              <span className="text-2xl font-light tracking-wide text-white">
                {content.companyName}
              </span>
            </Link>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Профессиональный дизайн интерьера премиум-класса. 
              Создаю пространства, в которых хочется жить.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-4">
              Навигация
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-4">
              Контакты
            </h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a
                  href={`tel:${contacts.phone.replace(/\s/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {contacts.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contacts.email}`}
                  className="hover:text-white transition-colors"
                >
                  {contacts.email}
                </a>
              </li>
              <li>{contacts.address}</li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {contacts.socialLinks.instagram && (
                <a
                  href={contacts.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {contacts.socialLinks.telegram && (
                <a
                  href={contacts.socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
              {contacts.socialLinks.whatsapp && (
                <a
                  href={contacts.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {content.companyName}. Все права защищены.
          </p>
          <p className="text-gray-600 text-xs">Версия v{__APP_VERSION__}</p>
          <Link
            to="/admin"
            className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
          >
            Админ-панель
          </Link>
        </div>
      </div>
    </footer>
  );
}

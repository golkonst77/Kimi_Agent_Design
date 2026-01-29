import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSite } from '@/contexts/SiteContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Image,
  User,
  FolderOpen,
  MessageSquare,
  Phone,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/hero', label: 'Главная', icon: Image },
  { path: '/admin/about', label: 'Обо мне', icon: User },
  { path: '/admin/projects', label: 'Проекты', icon: FolderOpen },
  { path: '/admin/services', label: 'Услуги', icon: Settings },
  { path: '/admin/testimonials', label: 'Отзывы', icon: MessageSquare },
  { path: '/admin/contacts', label: 'Контакты', icon: Phone },
];

export function AdminLayout() {
  const { logout } = useAuth();
  const { content } = useSite();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Вы успешно вышли из системы');
    navigate('/admin');
  };

  const handlePreview = () => {
    window.open('/', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white fixed h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <span className="flex items-center justify-center rounded-md bg-white/90 p-1">
              <img
                src="/logo-placeholder.svg"
                alt={`${content.companyName} logo`}
                className="h-7 w-auto"
              />
            </span>
            <span className="text-xl font-light">Admin Panel</span>
          </Link>
          <p className="text-gray-400 text-sm mt-2">{content.companyName}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Выйти
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
              <h1 className="text-lg font-medium">
                {navItems.find((item) => item.path === location.pathname)?.label ||
                  'Админ-панель'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handlePreview}>
                Просмотр сайта
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

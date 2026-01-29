import { useSite } from '@/contexts/SiteContext';
import { useProjects } from '@/contexts/ProjectsContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MessageSquare, Settings, Image, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { content } = useSite();
  const { projects } = useProjects();

  const stats = [
    {
      title: 'Проекты',
      value: projects.length,
      icon: FolderOpen,
      link: '/admin/projects',
      description: 'с галереями',
    },
    {
      title: 'Услуги',
      value: content.services.length,
      icon: Settings,
      link: '/admin/services',
      description: 'активных',
    },
    {
      title: 'Отзывы',
      value: content.testimonials.length,
      icon: MessageSquare,
      link: '/admin/testimonials',
      description: 'от клиентов',
    },
  ];

  const quickLinks = [
    { title: 'Редактировать главную', link: '/admin/hero', icon: Image },
    { title: 'Создать новый проект', link: '/admin/projects', icon: FolderOpen },
    { title: 'Изменить услуги', link: '/admin/services', icon: Settings },
    { title: 'Добавить отзыв', link: '/admin/testimonials', icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-light text-gray-900">
          Добро пожаловать в админ-панель
        </h2>
        <p className="text-gray-500 mt-1">
          Управляйте контентом вашего сайта из одного места
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <p className="text-3xl font-light text-gray-900 mt-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {stat.description}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Быстрые действия</CardTitle>
            <CardDescription>
              Часто используемые разделы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.title}>
                    <Link
                      to={link.link}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="text-gray-700">{link.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Информация о сайте</CardTitle>
            <CardDescription>
              Общая статистика
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Заголовок сайта</span>
              <span className="text-gray-900">{content.companyName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Проекты с галереей</span>
              <span className="text-gray-900">{projects.length}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Всего фотографий</span>
              <span className="text-gray-900">{projects.reduce((acc, p) => acc + p.images.length, 0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Услуг</span>
              <span className="text-gray-900">{content.services.length}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Отзывов</span>
              <span className="text-gray-900">{content.testimonials.length}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Лет опыта</span>
              <span className="text-gray-900">{content.about.stats.years}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useSite } from '@/contexts/SiteContext';

export function PrivacyPolicy() {
  const { content } = useSite();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6">
            Политика конфиденциальности
          </h1>
          <p className="text-gray-600 leading-relaxed mb-4">
            В {content.companyName} мы уважаем вашу приватность и используем
            данные только для улучшения качества сервиса и связи с вами.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Мы можем использовать cookie‑файлы и инструменты аналитики
            (включая Яндекс.Метрику) для понимания поведения пользователей на
            сайте, улучшения структуры и контента. Вы можете в любой момент
            отозвать согласие, очистив данные cookies в браузере.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Если у вас есть вопросы, пожалуйста, свяжитесь с нами через раздел
            «Контакты».
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

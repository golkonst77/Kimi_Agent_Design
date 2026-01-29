import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CONSENT_KEY = 'analytics_consent';

type ConsentValue = 'unknown' | 'accepted' | 'rejected';

const getStoredConsent = (): ConsentValue => {
  if (typeof window === 'undefined') return 'unknown';
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === 'accepted' || value === 'rejected') return value;
  return 'unknown';
};

const getMetrikaId = () => {
  const raw = import.meta.env.VITE_YANDEX_METRIKA_ID;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const loadYandexMetrika = (id: number) => {
  if (typeof window === 'undefined') return;
  if (document.getElementById('yandex-metrika')) return;

  (window as Window & { ym?: (...args: unknown[]) => void }).ym =
    (window as Window & { ym?: (...args: unknown[]) => void }).ym ||
    function (...args: unknown[]) {
      const ym = (window as Window & { ym?: { a?: unknown[] } }).ym as {
        a?: unknown[];
      };
      ym.a = ym.a || [];
      ym.a.push(args);
    };
  (window as Window & { ym?: { l?: number } }).ym!.l = Date.now();

  const script = document.createElement('script');
  script.id = 'yandex-metrika';
  script.async = true;
  script.src = 'https://mc.yandex.ru/metrika/tag.js';
  document.head.appendChild(script);

  (window as Window & { ym?: (...args: unknown[]) => void }).ym?.(id, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
};

export function CookieConsent() {
  const location = useLocation();
  const [consent, setConsent] = useState<ConsentValue>(() => getStoredConsent());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [allowAnalytics, setAllowAnalytics] = useState(false);
  const metrikaId = useMemo(getMetrikaId, []);

  useEffect(() => {
    if (consent === 'accepted' && metrikaId) {
      loadYandexMetrika(metrikaId);
    }
  }, [consent, metrikaId]);

  useEffect(() => {
    if (consent === 'accepted') {
      setAllowAnalytics(true);
    }
  }, [consent]);

  if (!metrikaId) return null;
  if (location.pathname.startsWith('/admin')) return null;
  if (consent !== 'unknown') return null;

  const saveConsent = () => {
    const value: ConsentValue = allowAnalytics ? 'accepted' : 'rejected';
    localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  const rejectConsent = () => {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    setConsent('rejected');
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center p-3 sm:p-6">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl shadow-black/20 border border-black/5">
        <div className="p-4 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="text-base sm:text-lg">🍪</span>
            <div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                Согласие на обработку данных и аналитику
              </h3>
              <p className="mt-1 text-xs sm:text-base text-gray-600">
                Используем Яндекс.Метрику и cookies для анализа сайта. Подробнее:{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Политика конфиденциальности
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-gray-200 p-3 sm:mt-5 sm:rounded-xl sm:p-4">
            <label className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300"
                checked={allowAnalytics}
                onChange={(event) => setAllowAnalytics(event.target.checked)}
              />
              <span>
                Разрешаю аналитические cookies (Яндекс.Метрика)
              </span>
            </label>
          </div>

          {isSettingsOpen && (
            <div className="mt-3 text-xs sm:text-sm text-gray-500">
              <p>
                Аналитика помогает улучшать контент. Персональные чувствительные
                данные не собираем.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-4 pb-4 sm:px-8 sm:pb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              onClick={saveConsent}
              className="h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm bg-gray-900 text-white hover:bg-gray-800"
            >
              Сохранить
            </Button>
            <Button
              variant="outline"
              onClick={rejectConsent}
              className="h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm"
            >
              Отклонить
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsSettingsOpen((prev) => !prev)}
            className="h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm"
          >
            Настройки
          </Button>
        </div>
      </div>
    </div>
  );
}

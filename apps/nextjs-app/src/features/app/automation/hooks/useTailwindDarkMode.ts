// src/hooks/useTailwindDarkMode.ts
import { useState, useEffect } from 'react';

export function useTailwindDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    // Первоначальная проверка
    updateTheme();

    // Отслеживаем изменения атрибутов у <html>
    const observer = new MutationObserver(() => {
      updateTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

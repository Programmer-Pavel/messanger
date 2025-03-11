import { useEffect, useRef, RefObject } from 'react';

/**
 * Хук для отслеживания кликов вне указанного элемента
 * @param callback Функция, которая будет вызвана при клике вне элемента
 * @returns Ref, который нужно привязать к элементу
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void,
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
}

import { useEffect, useRef } from 'react';

export const useFocus = () => {
  const focusRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  }, []);

  return { focusRef };
};

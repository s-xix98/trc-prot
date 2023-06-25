import { useEffect } from 'react';

export const useKeyInput = (
  keyPressHandler: (e: KeyboardEvent) => void,
  keyReleaseHandler: (e: KeyboardEvent) => void,
) => {
  useEffect(() => {
    document.addEventListener('keydown', keyPressHandler, false);
    document.addEventListener('keyup', keyReleaseHandler, false);

    return () => {
      document.removeEventListener('keydown', keyPressHandler, false);
      document.removeEventListener('keyup', keyReleaseHandler, false);
    };
  }, [keyPressHandler, keyReleaseHandler]);
};

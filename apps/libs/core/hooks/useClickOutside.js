import { useEventListener } from './useEventListener';

export const useClickOutside = (ref, handler) => {
  const listener = (event) => {
    let contains = false;
    let current = false;
    if (Array.isArray(ref)) {
      for (let i = 0; i < ref.length; i++) {
        if (ref[i].current?.contains(event.target)) contains = true;
        if (ref[i].current) current = true;
      }
    } else {
      if (ref.current?.contains(event.target)) contains = true;
      if (ref.current) current = true;
    }
    if (!current || contains) {
      return;
    }
    handler(event);
  };

  useEventListener('mouseup', listener, document);
  useEventListener('touchstart', listener, document);
};

import { nanoid } from 'nanoid';
import { BehaviorSubject } from 'rxjs';

const configureRemix = () => {
  const refs = new Map();
  const bubbles = new Map();

  return {
    addRef(key, info) {
      const current_item = refs.get(key);

      if (!current_item) {
        const next_item = new BehaviorSubject(info);
        refs.set(key, next_item);
      } else {
        current_item.next(info);
      }
    },
    addBubble(key, state) {
      const current_item = bubbles.get(key);

      if (!current_item) {
        const next_item = new BehaviorSubject(state);
        bubbles.set(key, next_item);
        return bubbles;
      } else {
        current_item.next(state);
      }
    },
    removeRef({ key }) {
      const current_item = refs.get(key);

      if (current_item) {
        refs.delete(key);
      }
    },
    removeBubble({ key }) {
      const current_item = bubbles.get(key);

      if (current_item) {
        bubbles.delete(key);
      }
    },
    getValue(key) {
      return bubbles?.get(key)?.getValue()?.value;
    },
    refs,
    bubbles,
  };
};

export default configureRemix;

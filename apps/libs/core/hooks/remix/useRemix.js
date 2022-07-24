import remix from 'core/remix';
import { useState, useEffect, useMemo, useCallback } from 'react';
import usePrevious from '../usePrevious';
import { isEqual } from 'lodash';
export const useRemix = (bubble_id, selector) => {
  const [bubble, setBubble] = useState({
    value: undefined,
    setValue: undefined,
  });

  const [subject, setSubject] = useState();
  const prev_subject = usePrevious(subject);

  const updateBubble = useCallback(
    (next_value) => {
      if (bubble?.setValue) bubble.setValue(next_value);
      return next_value;
    },
    [bubble?.setValue],
  );
  const [bubbleSubscription, setBubbleSubscription] = useState();
  const [subjectSubscription, setSubjectSubscription] = useState();
  // Listen for subject mounting/unmounting
  useEffect(() => {
    const remix_bubbles = remix?.bubbles;
    if (!subject) {
      const current_subject = remix_bubbles?.get(bubble_id);
      if (remix_bubbles && !current_subject) {
        remix.addBubble(bubble_id, bubble);
        setBubbleSubscription(
          remix_bubbles.get(bubble_id).subscribe((next_bubbles) => {
            const update_bubble = remix_bubbles.get(bubble_id);
            const current_bubble = update_bubble?.getValue();
            //prevents infinite loop exceeding callstack and mem leak
            if (!isEqual(current_bubble, next_bubbles)) {
              update_bubble.next(next_bubbles);
            }
            if (!subject && update_bubble) {
              setSubject(update_bubble);
            }
          }),
        );
      } else {
        setSubject(current_subject);
      }
    }
    return () => {
      if (bubbleSubscription) bubbleSubscription.unsubscribe();
    };
  }, [subject]);

  // subscribe to ref
  useEffect(() => {
    if (!prev_subject && subject) {
      setSubjectSubscription(
        subject.subscribe((next_state) => {
          setBubble({
            ...next_state,
            value: next_state.value,
            setValue: next_state.setValue,
          });
        }),
      );
    }
    return () => {
      if (subjectSubscription) subjectSubscription.unsubscribe();
    };
  }, [subject]);

  const reduce_value = useMemo(() => {
    if (bubble?.value && selector) return selector(bubble?.value);
    else return bubble?.value;
  }, [bubble?.value]);

  return [reduce_value, updateBubble, !!bubble?.setValue];
};

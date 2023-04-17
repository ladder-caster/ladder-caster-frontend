import { useEffect, useState, useMemo } from 'react';
import mesh from './index';
import { nanoid } from 'nanoid';

export const useMesh = (key, selector) => {
  const unique_id = nanoid();
  // Get Initial State First
  const source = mesh.getSource(key);

  // Store the current state
  const [value, setValue] = useState(source?.getValue());

  // Create an observer for the current state
  const observer = {
    id: unique_id,
    next(next_value) {
      setValue(next_value);
    },
    complete() {
      setValue(undefined);
    },
  };

  // Subscribe to the current state
  useEffect(() => {
    setValue(source?.getValue());
    source?.subscribe(observer);
    return () => {
      source?.unsubscribe(observer);
    };
  }, []);

  // Update observable on setValue
  const updateSource = (next_value) => {
    if (source) source.next(next_value);
  };

  // Return data based on selector
  const select_value = useMemo(() => {
    if (selector) {
      return selector(value);
    } else {
      return value;
    }
  }, [value]);

  return [select_value, updateSource];
};

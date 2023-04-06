import { useEffect, useState, useMemo } from 'react';
import mesh from './mesh';
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
      if (String(next_value !== value)) {
        let newInstance;
        if (typeof next_value === 'string') {
          newInstance = String(next_value);
        } else if (Array.isArray(next_value)) {
          newInstance = [...next_value];
        } else if (typeof next_value === 'object' && next_value !== null) {
          if (next_value instanceof Map) {
            newInstance = new Map(next_value);
          } else {
            newInstance = { ...next_value };
          }
        } else {
          // Handle other types or return the original value if not supported
          newInstance = value;
        }

        setValue(newInstance);
      }
    },
    complete() {
      setValue(undefined);
    },
  };

  // Subscribe to the current state
  useEffect(() => {
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

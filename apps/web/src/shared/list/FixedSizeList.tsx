// @ts-ignore
import React from 'react';
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  FC,
  cloneElement,
  ReactElement,
} from 'react';
// @ts-ignore
import { useKeys } from 'core/hooks/useKeys';

interface FixedSizeListProps {
  children: ReactElement;
  itemCount: number;
  itemSize: number;
  height: number;
  width: number;
  padding: number;
  itemData: any[];
  orientation?: 'vertical' | 'horizontal';
}

const FixedSizeList: FC<FixedSizeListProps> = ({
  children,
  itemCount,
  itemSize,
  height,
  width,
  itemData,
  padding,
  orientation = 'vertical',
}) => {
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const outerRef = useRef<HTMLDivElement>(null);
  const isHorizontal = orientation === 'horizontal';
  const key = useKeys(itemCount);

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    const scrollValue = isHorizontal ? target.scrollLeft : target.scrollTop;
    const startIndex = Math.floor(scrollValue / itemSize);
    setVisibleStartIndex(startIndex);
  };

  const debouncedHandleScroll = useMemo(() => {
    const debounce = (func: any, wait: number) => {
      let timeout: any;
      return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    };

    return debounce(handleScroll, 2);
  }, [handleScroll]);

  useEffect(() => {
    if (outerRef.current) {
      outerRef.current.addEventListener('scroll', debouncedHandleScroll);

      return () =>
        outerRef.current?.removeEventListener('scroll', debouncedHandleScroll);
    }
  }, [debouncedHandleScroll, outerRef]);

  const calculateVisibleItemCount = useMemo(() => {
    const visible =
      Math.ceil((isHorizontal ? width || 0 : height || 0) / itemSize) + 3;
    return itemCount <= visible ? itemCount : visible;
  }, [isHorizontal, width, height, itemSize, itemCount]);

  const visibleItems = useMemo(() => {
    const visibleItemCount = calculateVisibleItemCount;
    const items = [];
    let key_count = 0;

    const cloneChildFixedKey = (element, i) => {
      const next_key = `fixed-${key[i]?.key}-${key_count}`;
      if (typeof element !== 'object' || element === null) {
        return element;
      }

      if (Array.isArray(element)) {
        return element.map(cloneChildFixedKey);
      }

      if (React.isValidElement(element) && element?.props?.key !== next_key) {
        key_count++;
        const clonedElement = cloneElement(element, {
          key: next_key,
          child_key: `child-${next_key}`,
        });

        if (element.props.children) {
          const clonedChildren = cloneChildFixedKey(element.props.children, i);
          return cloneElement(clonedElement, {}, clonedChildren);
        }

        return clonedElement;
      }

      return element;
    };

    for (let i = 0; i < visibleItemCount; i++) {
      const index = visibleStartIndex + i;
      if (index < itemCount) {
        const style = isHorizontal
          ? {
              position: 'absolute',
              left: index * itemSize + padding / 2,
              width: itemSize,
              height: `${height - padding}px`,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }
          : {
              position: 'absolute',
              top: index * itemSize + padding / 2,
              width: `${width - padding}px`,
              height: itemSize,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            };

        const RowCopy = React.cloneElement(children, {
          index,
          data: itemData,
          style,
        });

        if (children) {
          items.push(cloneChildFixedKey(RowCopy, i));
        }
      }
    }

    return items;
  }, [
    visibleStartIndex,
    itemCount,
    children,
    itemData,
    isHorizontal,
    itemSize,
    calculateVisibleItemCount,
    key,
  ]);

  const totalSize = useMemo(() => itemCount * itemSize + padding * 2, [
    itemCount,
    itemSize,
  ]);

  const innerStyle = useMemo(() => {
    return isHorizontal
      ? {
          width: `${totalSize}px`,
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }
      : {
          height: `${totalSize}px`,
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        };
  }, [isHorizontal, totalSize]);

  return (
    <div
      {...key[0]}
      ref={outerRef}
      style={{ position: 'relative', overflow: 'scroll', height, width }}
    >
      {/* @ts-ignore */}
      <div {...key[1]} style={innerStyle}>
        {visibleItems}
      </div>
    </div>
  );
};

export default FixedSizeList;

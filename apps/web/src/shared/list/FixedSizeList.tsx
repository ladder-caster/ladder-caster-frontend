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
  header: any[];
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
  header,
  orientation = 'vertical',
}) => {
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [nonPositionStylesCache, setNonPositionStylesCache] = useState({});
  const [stylesCache, setStylesCache] = useState({});

  const outerRef = useRef<HTMLDivElement>(null);
  const isHorizontal = orientation === 'horizontal';
  const key = useKeys(itemCount);

  const calculateNonPositionStyles = () => {
    const cacheKey = isHorizontal ? 'horizontal' : 'vertical';
    if (nonPositionStylesCache[cacheKey]) {
      return nonPositionStylesCache[cacheKey];
    }

    const styles = isHorizontal
      ? {
        width: itemSize,
        height: `${height - padding}px`,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }
      : {
        height: itemSize,
        width: `${width - padding}px`,
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      };

    setNonPositionStylesCache((prevCache) => ({
      ...prevCache,
      [cacheKey]: styles,
    }));
    return styles;
  };

  const calculateItemStyle = (index: number) => {
    const nonPositionStyles = calculateNonPositionStyles();
    if (stylesCache[index]) {
      return { ...nonPositionStyles, ...stylesCache[index] };
    }

    const style = {
      position: 'absolute',
      [isHorizontal ? 'left' : 'top']: index * itemSize + padding / 2,
      ...nonPositionStyles,
    };

    setStylesCache((prevCache) => ({ ...prevCache, [index]: style }));
    return style;
  };


  const bufferSize = 6;

  const calculateVisibleItemCount = useMemo(() => {
    const visible = Math.ceil(
      (isHorizontal ? width || 0 : height || 0) / itemSize
    );
    return Math.min(itemCount, visible + 2 * bufferSize);
  }, [isHorizontal, width, height, itemSize, itemCount, bufferSize]);

  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: calculateVisibleItemCount + bufferSize,
  });

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    const scrollValue = isHorizontal ? target.scrollLeft : target.scrollTop;
    const startIndex = Math.floor(scrollValue / itemSize);
    const endIndex = Math.min(startIndex + calculateVisibleItemCount + bufferSize, itemCount);
    setVisibleRange({ start: startIndex - bufferSize, end: endIndex });
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

    for (let i = visibleRange.start; i < visibleRange.end; i++) {
      const index = i;
      const style = {
        ...calculateNonPositionStyles(),
        [isHorizontal ? 'left' : 'top']: index * itemSize + padding / 2,
      };
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
              top: index * itemSize + (padding / 2),
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
    visibleRange,
    children,
    itemData,
    isHorizontal,
    itemSize,
    key,
  ]);

  const totalSize = useMemo(() => visibleRange.end * itemSize + padding * 2, [  visibleRange,  itemSize,]);

  const innerStyle = useMemo(() => {
    return isHorizontal
      ? {
          position: 'absolute',
          width: `${totalSize}px`,
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }
      : {
          position: 'absolute',
          height: `${totalSize}px`,
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        };
  }, [isHorizontal, totalSize]);

  return (
    <div
      {...key[0]}
      ref={outerRef}
      style={{ position: 'relative', overflowX: isHorizontal ? 'scroll' : 'visible', overflowY: isHorizontal ? 'visible' : 'scroll',height, width }}
    >
      {header || null}
      {/* @ts-ignore */}
      <div {...key[1]} style={innerStyle}>
        {visibleItems}
      </div>
    </div>
  );
};

export default FixedSizeList;

// @ts-ignore
import React from 'react';
import { useState, useEffect, useRef, useMemo, FC, cloneElement, ReactElement } from 'react';

interface FixedSizeListProps {
  children: ReactElement;
  itemCount: number;
  itemSize: number;
  height: number;
  width: number;
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
                                                       orientation = 'vertical',
                                                     }) => {
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const outerRef = useRef<HTMLDivElement>(null);
  const isHorizontal = orientation === 'horizontal';

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

    return debounce(handleScroll, 1);
  }, [handleScroll]);

  const attachScrollListener = () => {
    if (outerRef.current) {
      outerRef.current.addEventListener('scroll', debouncedHandleScroll);
      return () => outerRef.current?.removeEventListener('scroll', debouncedHandleScroll);
    }
  };

  useEffect(attachScrollListener, [debouncedHandleScroll]);

  const calculateVisibleItemCount = () => useMemo(() => {
    return Math.ceil((isHorizontal ? width : height) / itemSize) + 1;
  }, [isHorizontal, width, height, itemSize]);

  const visibleItems = useMemo(() => {
    const visibleItemCount = calculateVisibleItemCount();
    const items = [];

    for (let i = 0; i < visibleItemCount; i++) {
      const index = visibleStartIndex + i;
      if (index < itemCount) {
        const style = isHorizontal
          ? { position: 'absolute', left: index * itemSize, width: itemSize, height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }
          : { position: 'absolute', top: index * itemSize, width: '100%', height: itemSize, display: 'flex', flexDirection: 'column', alignItems: 'center' };

        items.push(
          React.cloneElement(children, {
            index,
            data: itemData,
            style,
            key: `${children?.key}`,
          }),
        );
      }
    }

    return items;
  }, [visibleStartIndex, itemCount, children, itemData, isHorizontal, itemSize, calculateVisibleItemCount]);


  const totalSize = useMemo(() => itemCount * itemSize, [itemCount, itemSize]);

  const innerStyle = useMemo(() => {
    return isHorizontal
      ? { width: `${totalSize}px`, height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center'  }
      : { height: `${totalSize}px`, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' };
  }, [isHorizontal, totalSize]);

  return (
    <div key={`asdadsaassadas`} ref={outerRef} style={{ overflow: isHorizontal ? 'auto' : 'auto', height, width }}>
      <div key='dsfdsfsdfsd' style={innerStyle}>{visibleItems}</div>
    </div>
  );
};

export default FixedSizeList;

import React from 'react';
import FixedSizeList from './FixedSizeList';
import { useKeys } from 'core/hooks/useKeys';

const Row = ({ index, style, data, child_key }) => {
  return (
    <div key={`row-item-${child_key}`} style={style}>
      {data[index]}
    </div>
  );
};

const RecycledList = ({
  items,
  height,
  width,
  padding,
  itemSize,
  orientation,
}) => {
  const key = useKeys(3);

  return (
    <FixedSizeList
      {...key[0]}
      height={height}
      width={width}
      padding={padding || 0}
      itemCount={items.length}
      itemSize={itemSize}
      itemData={items}
      orientation={orientation}
    >
      <Row {...key[1]} />
    </FixedSizeList>
  );
};

export default RecycledList;

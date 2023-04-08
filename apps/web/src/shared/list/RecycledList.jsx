import React from 'react';
import FixedSizeList from './FixedSizeList';

const Row = ({ index, style, data }) => {
  return (
    <div key={`uwertwteer${index}`} style={style}>
      {data[index]}
    </div>
  );
};

const RecycledList = ({ items, height, width, itemSize, orientation }) => {
  console.log('RECYCLED PROPS', items, height, width, itemSize);

  return (
    <FixedSizeList
      key={'asdasdsadasds'}
      height={height}
      width={width}
      itemCount={items.length}
      itemSize={itemSize}
      itemData={items}
      orientation={orientation}
    >
      <Row key={'ewrewryrerf'} />
    </FixedSizeList>
  );
};

export default RecycledList;

import React from 'react';
import RecycledList from './RecycledList';

const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

const App = () => {
  return (
    <div>
      <RecycledList items={items} height={400} width={300} itemSize={35} />
    </div>
  );
};

export default App;

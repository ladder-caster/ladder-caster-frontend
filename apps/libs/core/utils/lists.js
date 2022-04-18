export const gridList = (list) => {
  const grid_list = [];
  for (let i = 0; i < list?.length; i++) {
    let row = Math.floor(i / 2);
    const item = list?.[i];

    if (i === 0 || !grid_list[row]) {
      grid_list.push([item]);
    } else {
      grid_list[row] = [grid_list?.[row]?.[0], item];
    }
  }
  return grid_list;
};

export const findTilebyPosition = (map, position) => {
  const col = position?.[0];
  const level = +position?.slice(1);
  if (map) {
    for (let i = 0; i < map?.length; i++) {
      const row = map?.[i];
      if (level === row?.level) {
        return row?.[col];
      }
    }
  } else return undefined;
};

export const pickKeys = (obj, keys) => {
  const newObj = {};

  for (let key in obj) {
    if (keys.includes(key)) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
};

const stringShorter = (str: string, length: number = 110) => {
  if (str.length > length) {
    return str.substring(0, length) + '...';
  }
  return str;
};
export {stringShorter};

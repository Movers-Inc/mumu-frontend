const getDateString = () => {
  const date = new Date();
  const output = `${date.getFullYear()}.${
    date.getMonth() + 1
  }.${date.getDate()}`;

  return output;
};

export default getDateString;

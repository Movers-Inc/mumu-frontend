const getTelString = (str: string) => {
  let output = str;

  if (output.startsWith("010")) {
    if (str.length === 3) output = str + "-";
    if (str.length === 8) output = str + "-";
  }
  return output.slice(0, 13);
};

export default getTelString;

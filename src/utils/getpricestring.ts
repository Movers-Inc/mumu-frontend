const getPriceString = (number?: number): string => {
  if (number === undefined) {
    return ""; // 숫자가 없는 경우 빈 문자열 반환
  }

  const price = number.toString(); // 숫자를 문자열로 변환
  const parts = [];

  // 3자리마다 쉼표를 추가하여 배열에 추가
  for (let i = price.length - 3; i >= 0; i -= 3) {
    parts.unshift(price.slice(i, i + 3));
  }

  // 마지막 남은 숫자 추가
  const remainder = price.length % 3;
  if (remainder !== 0) {
    parts.unshift(price.slice(0, remainder));
  }

  return parts.join(","); // 쉼표로 구분된 문자열 반환
};

export default getPriceString;

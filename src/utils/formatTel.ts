const formatTel = (value: string) => {
  // 숫자만 남기고 나머지 제거
  const cleaned = value.replace(/\D/g, "");

  // 최대 길이를 11로 제한
  const truncated = cleaned.slice(0, 11);

  if (truncated.length <= 2) {
    // 2자리 이하일 경우 그대로 반환
    return truncated;
  } else if (truncated.length <= 3) {
    // 3자리일 경우 그대로 반환
    return truncated;
  } else if (truncated.length <= 6) {
    if (truncated.startsWith("02")) {
      // 서울 번호(2-3)
      return truncated.replace(/(\d{2})(\d{1,4})/, "$1-$2");
    } else {
      // 일반 번호(3-3)
      return truncated.replace(/(\d{3})(\d{1,3})/, "$1-$2");
    }
  } else if (truncated.length <= 7){
    if (truncated.startsWith("02")) {
      // 서울 번호(2-4-4)
      return truncated.replace(/(\d{2})(\d{4})(\d{0,4})/, "$1-$2-$3");
    } else {
      // 휴대폰 번호(3-4)
      return truncated.replace(/(\d{3})(\d{4})/, "$1-$2");
    }
  }
  else if (truncated.length <= 10) {
    if (truncated.startsWith("02")) {
      // 서울 번호(2-4-4)
      return truncated.replace(/(\d{2})(\d{4})(\d{0,4})/, "$1-$2-$3");
    } else {
      // 휴대폰 번호(3-4)
      return truncated.replace(/(\d{3})(\d{4})(\d{0,4})/, "$1-$2-$3");
    }
  } else if (truncated.length === 11) {
    // 휴대폰 번호(3-4-4)
    return truncated.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  return truncated; // 기본 반환
};

export default formatTel;
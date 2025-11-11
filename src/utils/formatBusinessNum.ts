const formatBusinessNum = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 10) {
    return cleaned
      .replace(/(\d{3})(\d{0,2})(\d{0,5})/, (match, p1, p2, p3) => {
        if (p2 && p3) return `${p1}-${p2}-${p3}`;
        if (p2) return `${p1}-${p2}`;
        return p1;
      });
  }
  return cleaned;
};

export default formatBusinessNum;
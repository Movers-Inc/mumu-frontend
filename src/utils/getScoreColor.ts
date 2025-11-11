export const getScoreColor = (score: number) => {
  if (score <= 50) return "#ff5e3a";
  if (50 < score && score <= 99) return "#FFAE00";
  return "#32B44A";
};

export const getLightScoreColor = (score: number) => {
  if (score <= 50) return "#FEE7E6";
  if (50 < score && score <= 99) return "#FFEDB3";
  return "#BFE8C6";
};

export const getScoreMessage = (score: number) => {
  if (score <= 50) return "부적합";
  if (50 < score && score <= 99) return "개선필요";
  return "적합";
};

export const getScoreChip = (score: number) => {
  if (score <= 50) return "관리가 잘 되지 않고 있어요 😥";
  if (50 < score && score <= 99) return "양호하지만 일부 수정이 필요해요 🙄";
  return "아주 잘 관리되고 있어요 ! 👍";
};

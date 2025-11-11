interface Output {
  msg: string;
  verified: boolean;
}

interface BusinessStatus {
  b_no: string; // 사업자등록번호
  b_stt_cd: string; // 상태 코드
  b_stt: string; // 상태 명칭
}

const getBusinessMan = async (num: string): Promise<Output> => {
  const serviceKey =
    "pEZozdDPHxuQQxwCJq+DlkIKd/MqHTVuR0OXigNi7MiJMf4z2M0ZyERMdztaJNQraGMRxm8MM+H0ZmhfJRBlxA==";
  const url = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${encodeURIComponent(
    serviceKey
  )}`; // API 키를 URI 인코딩합니다.

  const code = num.replace(/[-+\s]/g, ""); // 사업자번호에서 특수문자 제거

  const data = {
    b_no: [code] // API가 요구하는 배열 형태
  };

  console.log("요청 데이터:", data);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text(); // 서버 에러 메시지 확인
      console.error("HTTP 오류:", response.status, errorText);
      return { msg: "HTTP 오류", verified: false };
    }

    const result: { data: BusinessStatus[] } = await response.json();
    console.log("응답 데이터:", result);

    // 비즈니스 번호가 유효한지 확인
    const res: Output = { msg: "", verified: false };
    result?.data?.forEach((entry) => {
      if (entry.b_stt_cd === "01") {
        res.msg = "계속사업자";
        res.verified = true;
      } else if (entry.b_stt_cd === "02") {
        res.msg = "휴업자";
      } else if (entry.b_stt_cd === "03") {
        res.msg = "폐업자";
      } else {
        res.msg = "등록되지 않은 사업자등록번호";
      }
    });

    return res;
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    return { msg: "API 호출 오류", verified: false };
  }
};

export default getBusinessMan;

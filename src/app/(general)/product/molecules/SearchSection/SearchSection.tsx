import { AnalyticsAPI, AuthAPI } from "@/api";
import { SearchInput, Spinner } from "@/components/atoms";
import { Common } from "@/components/popups";
import { ProductDetailAnalytics } from "@/dtos/product/analytics/ProductAnalytics.dto";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation } from "react-query";

function SearchSection({
  onSuccess
}: {
  onSuccess: (data: ProductDetailAnalytics) => void;
}) {
  const { profile } = AuthAPI.useGetProfile();

  const router = useRouter();

  const [showFailPopup, setShowFailPopup] = useState(false);
  const [showTokenExpiredPopup, setShowTokenExpiredPopup] = useState(false);
  const [failReason, setFailReason] = useState<"default" | "scraping_failed">(
    "default"
  );

  const failPopupContent = useMemo(() => {
    if (failReason === "scraping_failed") {
      return {
        title: "상품 정보를 불러올 수 없습니다",
        body: [
          "네이버 측 정책 변경으로 인해 현재 상품 상세 정보를 수집할 수 없습니다.",
          "조금 뒤 다시 시도하거나 관리자에게 문의해주세요."
        ].join("\n")
      };
    }

    return {
      title: "상품 정보를 확인할 수 없습니다",
      body: [
        "상품 상세페이지 주소를 다시 확인해주세요.",
        "현재는 네이버 스마트스토어, 네이버 브랜드스토어, 아임웹 스토어만 상품 분석 기능을 사용할 수 있습니다."
      ].join("\n")
    };
  }, [failReason]);

  const { mutate: analyticsProduct, isLoading } = useMutation(
    (url: string) => AnalyticsAPI.getProductAnalytics(url),
    {
      onSuccess: (data) => {
        if (process.env.NODE_ENV !== "production") {
          console.log("[SearchSection] analyticsProduct success");
        }
        onSuccess(data);
      },
      onError: (error) => {
        if (process.env.NODE_ENV !== "production") {
          console.error("[SearchSection] analyticsProduct error:", error);
        }
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 400 &&
          error.response?.data.message === "ScrapingTokenExpired"
        ) {
          setShowTokenExpiredPopup(true);
          return;
        }

        if (
          axios.isAxiosError(error) &&
          error.response?.data?.message === "Scraping Failed"
        ) {
          setFailReason("scraping_failed");
        } else {
          setFailReason("default");
        }

        setShowFailPopup(true);
      }
    }
  );
  return (
    <>
      <SearchInput
        className="w-[860px] mt-[24px]"
        handleSearch={async (url) => {
          if (process.env.NODE_ENV !== "production") {
            console.log("[SearchSection] handleSearch called with:", url);
          }
          if (!url) {
            return;
          }

          if (!profile) {
            router.replace("/login");
            return;
          }

          analyticsProduct(url);
        }}
        buttonText="분석"
        placeholder="상품의 상세페이지 링크를 입력해주세요. 현재는 네이버 스마트/브랜드스토어, 아임웹 스토어만 지원합니다."
      />
      {isLoading && (
        <Spinner
          text={`상품 상세페이지를 분석하고 있습니다. \n 최대 2분까지 소요될 수 있습니다.`}
        />
      )}

      <Common
        open={showFailPopup}
        onClose={() => {
          setFailReason("default");
          setShowFailPopup(false);
        }}
        onNext={() => {
          setFailReason("default");
          setShowFailPopup(false);
        }}
        body={failPopupContent.body}
        title={failPopupContent.title}
        placeholder="닫기"
      />

      <Common
        open={showTokenExpiredPopup}
        onClose={() => setShowTokenExpiredPopup(false)}
        onNext={() => {
          setShowTokenExpiredPopup(false);
        }}
        body={
          "알 수 없는 Token 오류가 발생하여 상품 정보를 불러올 수 없습니다. 관리자에게 문의해주세요."
        }
        title={"상품 정보를 확인할 수 없습니다"}
        placeholder="닫기"
      />
    </>
  );
}

export default SearchSection;

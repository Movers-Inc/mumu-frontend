interface CategoryBase {
  name: string;
  id: string;
}

// 계층형 카테고리 구조
interface CategoryTree extends CategoryBase {
  subCategory?: CategoryTree;
}

export interface ProductDetail {
  provider: "NAVER" | "IMWEB";
  thumbnail: string;
  category?: CategoryTree; // NAVER Only
  name: string;
  brandName?: string; // NAVER Only
  review: {
    reviewScore?: number; // NAVER Only
    totalReviewCount: number;
  };
  manufacturerName?: string;
  providedNotices?: {
    [key: string]: string;
  };
  productImages: {
    src: string;
    width: number;
    height: number;
  }[];
  tags?: string[];

  // 네이버 Only
  benefits?: {
    discountedRatio: number; // 할인율
    textReviewPoint: number; // 텍스트 리뷰 포인트
    photoReviewPoint: number; // 사진 리뷰 포인트
    alarmPoint: number; // 알림 포인트
  };
  delivery?: {
    averageDeliveryTime: number; // 평균 배송 시간
  };
}

export interface ProductDetailAnalytics {
  productDetail: ProductDetail;

  seo: {
    productName: {
      score: number;
      checklist: {
        title: string;
        status: "PASS" | "FAIL";
      }[];
    };
    productImage: {
      score: number;
      checklist: {
        title: string;
        status: "PASS" | "FAIL";
      }[];
    };
    productInformation: {
      score: number;
      checklist: {
        title: string;
        status: "PASS" | "FAIL";
      }[];
    };
    productTag?: {
      score: number;
      checklist: {
        title: string;
        status: "PASS" | "FAIL";
      }[];
    };
  };
  promotion?: {
    discountedRatio: {
      score: number;
      checklist: {
        title: string;
        status: "PASS" | "FAIL";
      }[];
    };
    textReviewPoint: {
      score: number;
      checklist: {
        title: string;
        status: "PASS" | "FAIL";
      }[];
    };
    photoReviewPoint: {
      score: number;
      checklist: {
        title: string;
        status: "PASS" | "FAIL";
      }[];
    };
    alarmPoint: {
      score: number;
      checklist: {
        title: string;
        status: "PASS" | "FAIL";
      }[];
    };
  };
  delivery?: {
    averageDeliveryTime: {
      score: number;
      checklist: {
        title: string;
        status: "PASS" | "FAIL";
      }[];
    };
  };
  analyticsAt: string | Date;
  image?: any;
}

import { ProductDetailAnalytics } from "@/dtos/product/analytics/ProductAnalytics.dto";

export const DEFAULT_PRODUCT: ProductDetailAnalytics = {
  productDetail: {
    provider: "NAVER",
    thumbnail:
      "https://shop-phinf.pstatic.net/20230228_69/1677575587423o48bR_JPEG/78711415239354134_667353168.jpg",
    category: {
      id: "50000000",
      name: "패션의류",
      subCategory: {
        id: "50000167",
        name: "여성의류",
        subCategory: { id: "50000813", name: "코트" },
      },
    },
    name: "메일리 핸드메이드 울100 양모 오버핏 겨울 울 모직 더블 여성 여자 롱 코트 아우터",
    brandName: "메일리Maily",
    review: { reviewScore: 4.62, totalReviewCount: 554 },
    manufacturerName: "메일리Maily 협력업체",
    providedNotices: {
      제품소재: "울(Woo)100%",
      색상: "베이지,블랙",
      치수: "Free Size(44-77)",
      "제조자(사)": "메일리Maily 협력업체",
      제조국: "국산",
      "세탁방법 및 취급시 주의사항": "상품상세참조",
      제조연월: "상품상세참조",
      품질보증기준: "상품상세참조",
      "A/S 책임자와 전화번호": "********",
    },
    productImages: [
      {
        src: "https://shop-phinf.pstatic.net/20230228_69/1677575587423o48bR_JPEG/78711415239354134_667353168.jpg",
        width: 2391,
        height: 2391,
      },
      {
        src: "https://shop-phinf.pstatic.net/20230228_159/1677575592830J5Ejt_JPEG/78711420647154074_1796480449.jpg",
        width: 2508,
        height: 2508,
      },
      {
        src: "https://shop-phinf.pstatic.net/20221014_9/1665736852600xshPs_JPEG/66872687422629115_639834111.jpg",
        width: 2700,
        height: 2700,
      },
      {
        src: "https://shop-phinf.pstatic.net/20221014_82/1665736856711LCk7l_JPEG/66872691531799530_81097265.jpg",
        width: 2700,
        height: 2700,
      },
      {
        src: "https://shop-phinf.pstatic.net/20221014_35/1665736861458uePOO_JPEG/66872696271429120_1355126646.jpg",
        width: 2700,
        height: 2700,
      },
      {
        src: "https://shop-phinf.pstatic.net/20221014_201/1665736866040f9doe_JPEG/66872700862992736_1386536261.jpg",
        width: 2600,
        height: 2600,
      },
      {
        src: "https://shop-phinf.pstatic.net/20221014_162/1665736885979PuwUr_JPEG/66872720795012052_1087429076.jpg",
        width: 2700,
        height: 2700,
      },
      {
        src: "https://shop-phinf.pstatic.net/20221014_198/1665736870596hhOIF_JPEG/66872705293245151_1038479769.jpg",
        width: 2700,
        height: 2700,
      },
      {
        src: "https://shop-phinf.pstatic.net/20230228_197/1677575616571UHQph_JPEG/78711444339791570_861627439.jpg",
        width: 2700,
        height: 2700,
      },
      {
        src: "https://shop-phinf.pstatic.net/20221014_4/1665736878652SUTnA_JPEG/66872713471342041_1240590328.jpg",
        width: 2700,
        height: 2700,
      },
    ],
    tags: [
      "겨울롱코트",
      "핸드메이드코트",
      "핸드메이드롱코트",
      "여성겨울코트",
      "여자겨울코트",
      "여성롱코트",
      "여성핸드메이드코트",
      "여자핸드메이드코트",
      "겨울모직코트",
      "여성울코트",
    ],
    benefits: {
      discountedRatio: 38,
      textReviewPoint: 550,
      photoReviewPoint: 1150,
      alarmPoint: 0,
    },
    delivery: { averageDeliveryTime: 2 },
  },
  seo: {
    productName: {
      score: 100,
      checklist: [
        { title: "상품명이 50자 미만이에요.", status: "PASS" },
        { title: "특수문자가 포함되어 있지 않아요.", status: "PASS" },
        { title: "주요 기호가 한 번 이하로 사용되었어요.", status: "PASS" },
        {
          title:
            "이벤트, 가격, 할인, 쿠폰, 적립 정보가 상품명에 포함되어 있지 않아요.",
          status: "PASS",
        },
        { title: "동일한 단어가 반복되지 않아요.", status: "PASS" },
      ],
    },
    productImage: {
      score: 100,
      checklist: [
        {
          title: "모든 상품 이미지의 가로 세로 해상도가 1000px 이상이에요.",
          status: "PASS",
        },
        { title: "모든 상품 이미지가 정방형(1:1) 비율이에요.", status: "PASS" },
        { title: "등록된 이미지 개수가 3개 이상이에요.", status: "PASS" },
      ],
    },
    productInformation: {
      score: 100,
      checklist: [
        { title: "브랜드/제조사 필드가 채워져 있어요.", status: "PASS" },
        { title: "상품정보 제공고시가 적절히 작성되었어요.", status: "PASS" },
      ],
    },
    productTag: {
      score: 100,
      checklist: [
        { title: "최소 1개 이상의 태그가 등록되었어요.", status: "PASS" },
        {
          title: "등록된 태그가 상품명, 브랜드, 제조사와 중복되지 않아요.",
          status: "PASS",
        },
      ],
    },
  },
  promotion: {
    discountedRatio: {
      score: 100,
      checklist: [
        {
          title: "동일 카테고리 상위 10개 제품 평균(21%) 이상이에요.",
          status: "PASS",
        },
      ],
    },
    textReviewPoint: {
      score: 100,
      checklist: [
        {
          title: "동일 카테고리 상위 10개 제품 평균(150포인트) 이상이에요.",
          status: "PASS",
        },
      ],
    },
    photoReviewPoint: {
      score: 100,
      checklist: [
        {
          title: "동일 카테고리 상위 10개 제품 평균(450포인트) 이상이에요.",
          status: "PASS",
        },
      ],
    },
    alarmPoint: {
      score: 100,
      checklist: [
        {
          title: "동일 카테고리 상위 10개 제품 평균(0포인트) 이상이에요.",
          status: "PASS",
        },
      ],
    },
  },
  delivery: {
    averageDeliveryTime: {
      score: 0,
      checklist: [
        {
          title: "동일 카테고리 상위 10개 제품 평균(1.4일)보다 느려요.",
          status: "FAIL",
        },
      ],
    },
  },
  analyticsAt: "2024-12-01T06:57:52.948Z",
};

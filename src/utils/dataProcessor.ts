import { EmployeeType } from "@/dtos/brand/Dashboard.dto";

export const processDashboardData = (data: any) => {
  return {
    doughnut: {
      labels: data.businessTypeData.map((item: any) => item.type),
      data: data.businessTypeData.map((item: any) => item.ratio * data.brandCnt),
      brandCnt: data.brandCnt,
    },
    horizontalBar: {
      labels: [
        "연매출 1억원 미만",
        "연매출 1억 ~ 10억원 미만",
        "연매출 10억 ~ 20억원 미만",
        "연매출 20억 ~ 50억원 미만",
        "연매출 50억 ~ 100억원 미만",
        "연매출 100억원 이상",
      ],
      data: data.salesData.map((item: any) => item.ratio * data.brandCnt),
    },
    verticalBar: {
      labels: data.newcomerData.map((item: any) => item.createdAt),
      values: data.newcomerData.map((item: any) => item.value),
    },
    bubbleChart: data.employeesData.map((item: any, index: number) => ({
      name: ["1-10명", "11-50명", "51-100명", "101-500명", "500명 이상"][item.employeeType] || "",
      value: item.ratio * data.brandCnt,
      detail: `${(item.ratio * 100).toFixed(0)}%, ${Math.round(item.ratio * data.brandCnt)}개사`,
    })),
  };
};

export default processDashboardData;
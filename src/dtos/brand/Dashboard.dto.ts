export enum SaleType {
  UNDER_100M = 'UNDER_100M',
  UNDER_1B = 'UNDER_1B',
  UNDER_2B = 'UNDER_2B',
  UNDER_5B = 'UNDER_5B',
  UNDER_10B = 'UNDER_10B',
  OVER_10B = 'OVER_10B',
}

export interface Sales {
  saleType: SaleType;
  ratio: number;
}

export enum EmployeeType {
  UNDER_10 = 'UNDER_10',
  UNDER_50 = 'UNDER_50',
  UNDER_100 = 'UNDER_100',
  UNDER_500 = 'UNDER_500',
  OVER_500 = 'OVER_500',
}

export interface Employees {
  employeeType: EmployeeType;
  ratio: number;
}

export interface BusinessType {
  type: string;
  ratio: number;
}

export interface NewComer {
  createdAt: string; // ISO 8601 format date string
  value: number;
}

export interface DashboardDto {
  brandCnt: number; // 등록된 브랜드의 개수
  businessTypeData: BusinessType[]; // 전체 업종
  salesData: Sales[]; // 매출액 데이터
  newcomerData: NewComer[]; // 신규가입 추이 데이터
  employeesData: Employees[]; // 회사 규모 데이터
}
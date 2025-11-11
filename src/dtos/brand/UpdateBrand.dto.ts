export interface UpdateBrandDto {
  /** 브랜드 이름 (Main) */
  mainName?: string;

  /** 브랜드 이름 (Sub) */
  subName?: string;

  /** 사업자등록번호 */
  businessNum?: string;

  /** 업종 */
  businessType?: string;

  /** 연간 매출액 */
  yearlySale?: number;

  /** 직원수 */
  employeeCnt?: number;

  /** 대표자 */
  ceoName?: string;

  /** 대표 관리자 ID (이메일) */
  userId?: string;

  /** 대표 관리자 연락처 */
  phone?: string;

  /** 대표 관리자 패스워드 */
  password?: string;
}
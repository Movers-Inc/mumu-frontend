import { Role } from "../common";

export interface AdminDto {
  /** 관리자의 ID */
  id: number;

  /** 관리자의 이름 */
  name: string;

  /** 관리자의 ID (이메일) */
  userId: string;

  /** 관리자의 직급 */
  position: string;

  /** 관리자 종류 */
  role: Role;

  /** 관리자의 연락처 */
  phone: string;

  /** 관리자의 생년월일 */
  birth?: string;

  brandId? : number;

  /** 관리자의 입사일 */
  joinAt?: string;

  /** 관리자의 주소 */
  address?: string;

  /** 관리자의 마지막 수정일 */
  updatedAt: Date;
}

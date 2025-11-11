import { Role } from "../common";

export interface CreateAdminDto {
  /** 관리자의 ID (이메일) */
  userId: string;

  /** 관리자의 PW (비밀번호)) */
  password: string;

  /** 관리자의 이름 */
  name: string;

  /** 관리자의 직급 */
  position: string;

  /** 관리자 종류 */
  role: Role;

  /** 관리자의 연락처 */
  phone: string;

  /** 관리자의 생년월일 */
  birth?: string;

  /** 관리자의 입사일 */
  joinAt?: string;

  /** 관리자의 주소 */
  address?: string;
}

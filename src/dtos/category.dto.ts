export interface CategoryDto {
  /** 카테고리 ID */
  cid: number;

  /** 부모 카테고리 ID (루트 카테고리의 경우 null) */
  pid?: number;

  /** 카테고리 이름 */
  name: string;

  /** 부모 경로 */
  parentPath: string;

  /** 카테고리 레벨 */
  level: number;

  /** 노출 순서 */
  expsOrder: number;

  /** 리프 여부 */
  leaf: boolean;

  /** 삭제 여부 */
  deleted: boolean;

  /** 서비스 사용 여부 */
  svcUse: boolean;

  /** 블로그 사용 여부 */
  sblogUse: boolean;

  /** 전체 경로 */
  fullPath: string;

  /** 생성일 */
  createdAt: Date;

  /** 수정일 */
  updatedAt: Date;
}

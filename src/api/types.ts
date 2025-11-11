export type Pagination = {
  page?: number;
  size?: number;
};

export type Response<D, M = unknown> = {
  data: D;
  meta: M;
};

export type PaginationResponse<D, M = unknown> = {
  data: D[];
  meta: M & {
    pagination: {
      page: number;
      size: number;
      total: number;
      totalPages: number;
    };
  };
};

export interface ErrorResponse {
  error: string;
  message: string[];
  statusCode: number;
}

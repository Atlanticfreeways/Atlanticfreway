export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Parse pagination parameters from query
 */
export const parsePaginationParams = (query: any): PaginationParams => {
  let page = parseInt(query.page) || 1;
  let limit = parseInt(query.limit) || 20;

  // Validate
  page = Math.max(1, page);
  limit = Math.min(Math.max(1, limit), 100); // Max 100 per page

  return { page, limit };
};

/**
 * Paginate array results
 */
export const paginateResults = <T>(
  data: T[],
  page: number,
  limit: number
): PaginatedResult<T> => {
  const total = data.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: data.slice(start, end),
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    },
  };
};

export default { parsePaginationParams, paginateResults };

export const successResponse = (
  message: string,
  data?: any,
  statusCode: number = 200
) => {
  return {
    success: true,
    message,
    data,
    statusCode,
  };
};

export const errorResponse = (
  message: string,
  statusCode: number = 500,
  error?: any
) => {
  return {
    success: false,
    message,
    error,
    statusCode,
  };
};

export const paginatedResponse = (
  data: any[],
  page: number,
  limit: number,
  total: number
) => {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

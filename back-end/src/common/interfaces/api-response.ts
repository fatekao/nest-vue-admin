export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ErrorResponse {
  code: number;
  message: string;
  error: string;
  path: string;
  timestamp: string;
}

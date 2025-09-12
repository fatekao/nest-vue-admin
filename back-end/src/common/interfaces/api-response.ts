export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ErrorResponse {
  code: number;
  message: string | string[]; // 改为更具体的类型，支持字符串或字符串数组
  path: string;
  timestamp: string;
}

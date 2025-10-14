import type {ReactNode} from 'react';

// 用户相关类型
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

// 登录请求类型
export interface LoginRequest {
  userId: string;
  password: string;
  platform: string;
  captcha: string;
  captchaKey: string;
}

// 登录响应类型
export interface LoginResponse {
  user: User;
  message?: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  restCode: string;
  message: string;
  data: T;
  success: boolean;
  errors: any[];
  errorsMap: Record<string, any>;
}

// 分页类型
export interface PaginationParams {
  page: number;
  pageSize: number;
  total?: number;
}

export interface PaginatedResponse<T> {
  list: T[];
  pagination: PaginationParams;
}

// 菜单项类型
export interface MenuItem {
  key: string;
  icon?: ReactNode;
  label: string;
  path?: string;
  children?: MenuItem[];
}

// 统计数据类型
export interface StatisticData {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
  suffix?: string;
}

// 订单类型
export interface Order {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// 错误类型
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

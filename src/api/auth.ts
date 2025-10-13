import request from './request';
import type { LoginRequest, LoginResponse, ApiResponse } from '../types';

// 登录接口
export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await request.post<ApiResponse<LoginResponse>>('/rest/auth/login', data);
  return response.data;
};

// 登出接口
export const logoutApi = async (): Promise<void> => {
  await request.post('/auth/logout');
};

// 获取用户信息接口
export const getUserInfoApi = async (): Promise<any> => {
  const response = await request.get<ApiResponse<any>>('/rest/auth/userinfo');
  return response.data;
};

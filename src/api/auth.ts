import request from './request';
import type { LoginRequest, LoginResponse, ApiResponse } from '../types';

// 登录接口
export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const respData = await request.post<LoginResponse>('/rest/auth/login', data);
  return respData as unknown as LoginResponse;
};

// 登出接口
export const logoutApi = async (): Promise<void> => {
  await request.post('/rest/auth/logout');
};

// 获取用户信息接口
export const getUserInfoApi = async (): Promise<any> => {
  const respData = await request.get<ApiResponse<any>>('/rest/auth/userinfo');
  return respData as unknown as any;
};

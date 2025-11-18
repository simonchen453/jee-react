import request from './request';
import type {
  SessionSearchForm,
  SessionListResponse,
  ApiResponse
} from '../types';

export const getSessionListApi = async (searchForm: SessionSearchForm): Promise<SessionListResponse> => {
  const response = await request.post<ApiResponse<SessionListResponse['data']>>('/admin/session/list', searchForm);
  return {
    data: response.data,
    restCode: response.restCode,
    message: response.message,
    success: response.success
  };
};

export const suspendSessionApi = async (id: string): Promise<ApiResponse> => {
  const response = await request.patch<ApiResponse>(`/admin/session/suspend/${id}`);
  return response;
};

export const unsuspendSessionApi = async (id: string): Promise<ApiResponse> => {
  const response = await request.patch<ApiResponse>(`/admin/session/unsuspend/${id}`);
  return response;
};

export const killSessionApi = async (id: string): Promise<ApiResponse> => {
  const response = await request.patch<ApiResponse>(`/admin/session/kill/${id}`);
  return response;
};


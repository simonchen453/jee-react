import request from './request';
import type { BackendMenuItem } from '../types';

// 获取菜单列表
export const getMenuList = async (): Promise<BackendMenuItem[]> => {
  try {
    const response = await request.get<BackendMenuItem[]>('/common/menus');
    return response.data || [];
  } catch (error) {
    console.error('获取菜单列表失败:', error);
    return [];
  }
};

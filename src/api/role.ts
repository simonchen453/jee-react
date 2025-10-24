import request from './request';
import type { ApiResponse } from '../types';

// 角色搜索表单
export interface RoleSearchForm {
  name?: string;
  display?: string;
  status?: string;
  system?: string;
  pageNo?: number;
  pageSize?: number;
  totalNum?: number;
}

// 角色实体
export interface RoleEntity {
  id?: string;
  name: string;
  display: string;
  status: string;
  system: string;
  menuNames?: string[];
}

// 角色列表响应
export interface RoleListResponse {
  records: RoleEntity[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
}

// 菜单树节点
export interface MenuTreeNode {
  id: string;
  label: string;
  children?: MenuTreeNode[];
}

// 角色菜单树响应
export interface RoleMenuTreeResponse {
  menus: MenuTreeNode[];
  checkedKeys: string[];
}

// 查询角色列表
export const getRoleListApi = (params: RoleSearchForm): Promise<ApiResponse<RoleListResponse>> => {
  return request.post('/admin/role/list', params);
};

// 获取角色详情
export const getRoleDetailApi = (id: string): Promise<ApiResponse<RoleEntity>> => {
  return request.get(`/admin/role/detail/${id}`);
};

// 创建角色
export const createRoleApi = (params: RoleEntity): Promise<ApiResponse<RoleEntity>> => {
  return request.post('/admin/role/create', params);
};

// 更新角色
export const updateRoleApi = (params: RoleEntity): Promise<ApiResponse<RoleEntity>> => {
  return request.patch('/admin/role/edit', params);
};

// 删除角色
export const deleteRoleApi = (ids: string): Promise<ApiResponse<{ success: boolean }>> => {
  return request.delete(`/admin/role/delete?ids=${ids}`);
};

// 获取菜单树结构
export const getMenuTreeApi = (): Promise<ApiResponse<MenuTreeNode[]>> => {
  return request.get('/common/menu/treeSelect');
};

// 根据角色获取菜单树结构
export const getRoleMenuTreeApi = (roleName: string): Promise<ApiResponse<RoleMenuTreeResponse>> => {
  return request.get(`/common/menu/roleMenuTreeSelect/${roleName}`);
};

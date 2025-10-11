import axios, { AxiosError, AxiosResponse } from 'axios';
import { message } from 'antd';
import type {ApiResponse} from '../types/index';

const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || '/api',
    timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        const { data } = response;
        
        // 如果API返回了错误码
        if (data.code !== 200 && data.code !== 0) {
            message.error(data.message || '请求失败');
            return Promise.reject(new Error(data.message || '请求失败'));
        }
        
        return data;
    },
    (error: AxiosError) => {
        let errorMessage = '网络错误，请稍后重试';
        
        if (error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 401:
                    errorMessage = '未授权，请重新登录';
                    localStorage.removeItem('token');
                    // 可以在这里跳转到登录页
                    break;
                case 403:
                    errorMessage = '拒绝访问';
                    break;
                case 404:
                    errorMessage = '请求的资源不存在';
                    break;
                case 500:
                    errorMessage = '服务器内部错误';
                    break;
                default:
                    errorMessage = (data as any)?.message || `请求失败 (${status})`;
            }
        } else if (error.request) {
            errorMessage = '网络连接失败，请检查网络';
        }
        
        message.error(errorMessage);
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default request;
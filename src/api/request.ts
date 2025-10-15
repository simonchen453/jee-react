import axios, { AxiosError, type AxiosResponse } from 'axios';
import { useAuthStore } from '../stores/useUserStore';

const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || '/api',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        // 使用session认证，浏览器会自动发送cookie
        // 设置withCredentials确保cookie被发送
        config.withCredentials = true;
        return config;
    },
    (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
    (response: AxiosResponse) => {
        const { data } = response;
        
        // 如果API返回了错误码
        if (data.restCode !== '200' && data.restCode !== '0' && !data.success) {
            // 抛出包含原始响应体的数据，供调用方自行处理提示
            return Promise.reject({ response: { data } });
        }
        
        return data;
    },
    (error: AxiosError) => {
        // 仅将错误抛给调用方处理，不在拦截器内做全局弹窗
        if (error.response && error.response.status === 401) {
            // session过期时，清除本地认证状态并跳转登录
            try {
                const { clearAuth } = useAuthStore.getState();
                clearAuth();
            } catch (_) {}
            if (typeof window !== 'undefined') {
                const current = window.location.pathname + window.location.search;
                const redirect = encodeURIComponent(current);
                if (!window.location.pathname.startsWith('/login')) {
                    window.location.href = `/login?redirect=${redirect}`;
                }
            }
        }
        return Promise.reject(error);
    }
);

export default request;
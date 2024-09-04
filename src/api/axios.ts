import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { HandleNetworkError, HostApp } from "./_host";
import * as authApi from './auth';

const RETRY_INTERVAL = 60000; // 60 seconds
const MAX_RETRIES = 3;

// 不需要重定向的路径
const NON_REDIRECT_PATHS = ['/login', '/register', '/home'];

// 扩展 AxiosRequestConfig 类型
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
    retryCount?: number;
}

const instance = axios.create({
    baseURL: `${HostApp()}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = authApi.getToken();
    if (!token) {
        // 如果没有 token，直接返回一个错误
        return Promise.reject({ 
            response: { 
                status: 401, 
                data: { message: "未发现登录态" } 
            } 
        });
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const handleUnauthorized = async (error: AxiosError) => {
    try {
        // 尝试刷新 token
        await authApi.refreshToken();
        
        // 如果刷新成功，重试原始请求
        if (error.config) {
            return instance(error.config);
        }
    } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // 如果刷新失败，清除认证状态
        authApi.logout();
        
        const currentPath = window.location.pathname;
        const shouldRedirect = !NON_REDIRECT_PATHS.some(path => currentPath.includes(path));
        
        if (shouldRedirect) {
            window.location.href = '/home';
        }
    }
    return Promise.reject(error);
};

const retryRequest = async (error: AxiosError): Promise<any> => {
    const config = error.config as ExtendedAxiosRequestConfig;
    if (!config) {
        return Promise.reject(error);
    }

    config.retryCount = config.retryCount || 0;

    if (config.retryCount >= MAX_RETRIES || (error.response && error.response.status >= 400 && error.response.status < 500)) {
        return Promise.reject(error);
    }

    config.retryCount += 1;

    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`Retrying request, attempt ${config.retryCount}`);
            resolve(instance(config));
        }, RETRY_INTERVAL);
    });
};

instance.interceptors.response.use(
    response => response, 
    async (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            return handleUnauthorized(error);
        }
        try {
            return await retryRequest(error);
        } catch (retryError) {
            return HandleNetworkError(retryError);
        }
    }
);

export default instance;
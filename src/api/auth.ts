import axios from "axios";
import Cookies from 'js-cookie';
import {HandleNetworkError, HostIAM} from "./_host";

const axiosAuth = axios.create({
    baseURL: `${HostIAM()}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});
axiosAuth.interceptors.response.use(response => response, HandleNetworkError);

const TOKEN_KEY = 'ACCESS_TOKEN';
const USER_KEY = 'USER';

export const setToken = (token: string) => {
    Cookies.set(TOKEN_KEY, token, { expires: 7 }); // 设置 7 天过期
};

export const getToken = () => Cookies.get(TOKEN_KEY);

export const removeToken = () => Cookies.remove(TOKEN_KEY);

export const setUser = (user: { username: string }) => {
    Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7 });
};

export const getUser = () => {
    const user = Cookies.get(USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const removeUser = () => Cookies.remove(USER_KEY);

// 由 authContext 负责和 storage/cookie交互, token 位于 resp.data.token
export const login = async (data: {
    username: string;
    password: string;
}) => {
    const response = await axiosAuth.post('/auth/login', data);
    setToken(response.data.token);
    setUser({ username: data.username });
    return response;
};

export const register = (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}) => axiosAuth.post('/auth/register', data);

export const verifyToken = () => {
    const token = getToken();
    if (!token) {
        return Promise.reject('No token found');
    }
    return axiosAuth.get('/session/validate', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const refreshToken = async () => {
    const token = getToken();
    if (!token) {
        return Promise.reject('No token found');
    }
    const response = await axiosAuth.post('/auth/refresh', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    setToken(response.data.token);
    return response;
};

export const logout = () => {
    removeToken();
    removeUser();
};
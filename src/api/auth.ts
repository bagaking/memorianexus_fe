import axios from "axios";
import {HandleNetworkError, HostIAM} from "./_host";

const axiosAuth = axios.create({
    baseURL: `${HostIAM()}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});
axiosAuth.interceptors.response.use(response => response, HandleNetworkError);

// 由 authContext 负责和 storage/cookie交互, token 位于 resp.data.token
export const login = (data: {
    username: string;
    password: string;
}) => axiosAuth.post('/auth/login', data);

export const register = (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}) => axiosAuth.post('/auth/register', data);

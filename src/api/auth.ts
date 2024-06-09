import axios from "axios";

const axiosAuth = axios.create({
    baseURL: 'http://localhost:18080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 由 authContext 负责和 storage/cookie交互, token 位于 resp.data.token
export const login = (data: {username: string; password: string}) => {
    return axiosAuth.post('/auth/login', data);
};

export const register = (data: { username: string; email: string; password: string; confirmPassword: string }) => {
    return axiosAuth.post('/auth/register', data);
};

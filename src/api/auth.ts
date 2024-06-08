import axios from "axios";

const axiosAuth = axios.create({
    baseURL: 'http://localhost:18080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = (data: {
                          username: string;
                          password: string;
                      }
) => {
    return axiosAuth.post('/auth/login', data).then(resp => {
        localStorage.setItem('ACCESS_TOKEN', resp.data.token);
        return resp
    });
};

export const register = (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}) => {
    return axiosAuth.post('/auth/register', data);
};

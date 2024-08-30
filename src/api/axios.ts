import axios from 'axios';
import Cookies from "js-cookie";
import {HandleNetworkError, HostApp} from "./_host";

const instance = axios.create({
    baseURL: `${HostApp()}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use((config) => {
    const token = Cookies.get('ACCESS_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use(response => response, HandleNetworkError)

export default instance;
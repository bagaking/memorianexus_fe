
// 获取用户信息
import axios from "./axios";

export const getProfile = async () => {
    return axios.get('/profile/me');
};

// 更新用户信息
export const updateProfile = async (data: {
    nickname: string;
    avatar_url: string;
    bio: string
}) => {
    return axios.put('/profile/me', data);
};
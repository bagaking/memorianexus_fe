import axios from './axios';

// 创建学习材料
export const createItem = async (data: { content: string; type: string; book_ids?: number[]; tags?: string[] }) => {
    return axios.post('/items', data);
};

// 获取所有学习材料
export const getItems = async () => {
    return axios.get('/items');
};

// 获取学习材料详情
export const getItemDetail = async (id: string) => {
    return axios.get(`/items/${id}`);
};

// 更新学习材料信息
export const updateItem = async (id: string, data: { content: string; type: string; tags?: string[] }) => {
    return axios.put(`/items/${id}`, data);
};

// 删除学习材料
export const deleteItem = async (id: string) => {
    return axios.delete(`/items/${id}`);
};

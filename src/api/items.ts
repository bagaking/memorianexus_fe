import axios from './axios';


// 获取所有学习材料
export const getItems = async (params: {page: number, limit: number, search?: string, user_id?: string}) => {
    return axios.get('/items', {params});
};

// 获取学习材料详情
export const getItemById = async (id: string) => {
    return axios.get(`/items/${id}`);
};


// 创建学习材料
export const createItem = async (data: { content: string; type: string; book_ids?: number[]; tags?: string[] }) => {
    return axios.post('/items', data);
};

// 更新学习材料信息
export const updateItem = async (id: string, data: { content: string; type: string; tags?: string[] }) => {
    return axios.put(`/items/${id}`, data);
};

// 删除学习材料
export const deleteItem = async (id: string) => {
    return axios.delete(`/items/${id}`);
};

// 上传文件批量导入 items
export const uploadItems = async (file: File, params: {book_id?: string}) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post('/items/upload', formData, {
        params,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
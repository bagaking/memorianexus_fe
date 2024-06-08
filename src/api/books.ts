import axios from './axios';

// 创建书籍
export const createBook = async (data: { title: string; description: string; tags?: string[] }) => {
    return axios.post('/books', data);
};

// 获取所有书籍
export const getBooks = async () => {
    return axios.get('/books');
};

// 获取书籍详情
export const getBookDetail = async (id: string) => {
    return axios.get(`/books/${id}`);
};

// 更新书籍信息
export const updateBook = async (id: string, data: { title: string; description: string; tags?: string[] }) => {
    return axios.put(`/books/${id}`, data);
};

// 删除书籍
export const deleteBook = async (id: string) => {
    return axios.delete(`/books/${id}`);
};
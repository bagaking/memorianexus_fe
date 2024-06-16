import axios from './axios';

// 创建书籍
export const createBook = async (data: { title: string; description: string; tags?: string[] }) => {
    return axios.post('/books', data);
};

// 获取所有书籍
export const getBooks = async (params: { page: number, limit: number }) => {
    return axios.get('/books', { params });
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

export const getBookItems = async (data: { bookId: string, page: number, limit: number }) => {
    let {bookId, page, limit } = data
    return axios.get(`/books/${bookId}/items?page=${page}&limit=${limit}`);
}

export const getTagItems = async (data: { tag: string, page: number, limit: number }) => {
    // todo: 后端还提供的接口还是 tag_id
    let {tag, page, limit } = data
    return axios.get(`/tags/${tag}/items?page=${page}&limit=${limit}`);
}

export const addBookItem = (data: {bookId: string, itemId: string}) => {
    let {bookId, itemId } = data
    return axios.post(`/books/${bookId}/items`, { "item_ids": [ itemId ] });
};

export const addBookItems = (data: {bookId: string, itemIds: string[]}) => {
    let {bookId, itemIds } = data
    return axios.post(`/books/${bookId}/items`, { "item_ids": itemIds });
};

export const removeBookItems = (data: {bookId: string, itemIds: string[]}) => {
    let {bookId, itemIds } = data
    if (!itemIds || !itemIds.length) {
        return null;
    }
    return axios.delete(`/books/${bookId}/items`, { params: { item_ids: itemIds.join(',') } });
};
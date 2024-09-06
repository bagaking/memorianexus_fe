import { AxiosResponse } from 'axios';
import axios from './axios';
import { 
    RespBookCreate, 
    RespBookDelete, 
    RespBookGet, 
    RespBookUpdate, 
    RespBooks, 
    RespItemList, 
    RespBookAddItems, 
    RespBookRemoveItems 
} from './_dto';
import { UInt64 } from './_common';

// 创建书籍
export const createBook = async (data: { title: string; description: string; tags?: string[] }): Promise<AxiosResponse<RespBookCreate>> => {
    return axios.post<RespBookCreate>('/books', data);
};

// 获取所有书籍
export const getBooks = async (params: { page: number, limit: number, search?: string }): Promise<AxiosResponse<RespBooks>> => {
    return axios.get<RespBooks>('/books', { params });
};

// 获取书籍详情
export const getBookDetail = async (id: UInt64): Promise<AxiosResponse<RespBookGet>> => {
    return axios.get<RespBookGet>(`/books/${id}`);
};

// 更新书籍信息
export const updateBook = async (id: UInt64, data: { title: string; description: string; tags?: string[] }): Promise<AxiosResponse<RespBookUpdate>> => {
    return axios.put<RespBookUpdate>(`/books/${id}`, data);
};

// 删除书籍
export const deleteBook = async (id: UInt64): Promise<AxiosResponse<RespBookDelete>> => {
    return axios.delete<RespBookDelete>(`/books/${id}`);
};

export const getBookItems = async (data: { bookId: UInt64, page: number, limit: number, search?: string }): Promise<AxiosResponse<RespItemList>> => {
    const { bookId, page, limit, search } = data;
    return axios.get<RespItemList>(`/books/${bookId}/items`, { params: { page, limit, search }});
};

export const getTagItems = async (data: { tag: string, page: number, limit: number, search?: string }): Promise<AxiosResponse<RespItemList>> => {
    const { tag, page, limit, search } = data;
    return axios.get<RespItemList>(`/tags/name/${tag}/items`, { params: { page, limit, search }});
};

export const addBookItem = (data: { bookId: UInt64, itemId: UInt64 }): Promise<AxiosResponse<RespBookAddItems>> => {
    const { bookId, itemId } = data;
    return axios.post<RespBookAddItems>(`/books/${bookId}/items`, { item_ids: [itemId] });
};

export const addBookItems = (data: { bookId: UInt64, itemIds: UInt64[] }): Promise<AxiosResponse<RespBookAddItems>> => {
    const { bookId, itemIds } = data;
    return axios.post<RespBookAddItems>(`/books/${bookId}/items`, { item_ids: itemIds });
};

export const removeBookItems = (data: { bookId: UInt64, itemIds: UInt64[] }): Promise<AxiosResponse<RespBookRemoveItems>> => {
    const { bookId, itemIds } = data;
    if (!itemIds || !itemIds.length) {
        return Promise.resolve({} as AxiosResponse<RespBookRemoveItems>);
    }
    return axios.delete<RespBookRemoveItems>(`/books/${bookId}/items`, { params: { item_ids: itemIds.join(',') } });
};
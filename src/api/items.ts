import axios from './axios';
import { UInt64 } from './_common';
import { RespItemList, RespItemGet, RespItemCreate, RespItemUpdate, RespItemDelete, Item } from './_dto';
import { AxiosResponse } from 'axios';

// 获取所有学习材料
export const getItems = async (params: {page: number, limit: number, search?: string, user_id?: string}): Promise<AxiosResponse<RespItemList>> => {
    return axios.get<RespItemList>('/items', {params});
};

// 获取学习材料详情
export const getItemById = async (id: UInt64): Promise<AxiosResponse<RespItemGet>> => {
    return axios.get<RespItemGet>(`/items/${id}`);
};

// 创建学习材料
export const createItem = async (data: { content: string; type: string; book_ids?: UInt64[]; tags?: string[] }): Promise<AxiosResponse<RespItemCreate>> => {
    return axios.post<RespItemCreate>('/items', data);
};

// 更新学习材料信息
export const updateItem = async (id: UInt64, data: Partial<Item>): Promise<AxiosResponse<RespItemUpdate>> => {
    return axios.put<RespItemUpdate>(`/items/${id}`, data);
};

// 删除学习材料
export const deleteItem = async (id: UInt64): Promise<AxiosResponse<RespItemDelete>> => {
    return axios.delete<RespItemDelete>(`/items/${id}`);
};

// 上传文件批量导入 items
export const uploadItems = async (file: File, params: {book_id?: UInt64}): Promise<AxiosResponse<RespItemCreate>> => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post<RespItemCreate>('/items/upload', formData, {
        params,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
import axios from './axios';

// 创建复习计划
export const createDungeon = async (data: { title: string; description: string; type: string; rule: string; books?: number[]; items?: number[]; tag_names?: string[] }) => {
    return axios.post('/dungeon/dungeons', data);
};

// 获取所有复习计划
export const getDungeons = async () => {
    return axios.get('/dungeon/dungeons');
};

// 获取复习计划详情
export const getDungeonDetail = async (id: number) => {
    return axios.get(`/dungeon/dungeons/${id}`);
};

// 更新复习计划信息
export const updateDungeon = async (id: number, data: { title: string; description: string; type: string }) => {
    return axios.put(`/dungeon/dungeons/${id}`, data);
};

// 删除复习计划
export const deleteDungeon = async (id: number) => {
    return axios.delete(`/dungeon/dungeons/${id}`);
};
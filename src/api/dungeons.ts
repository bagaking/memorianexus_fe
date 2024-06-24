import axios from './axios';

export interface Dungeon {
    id: string;
    title: string;
    description: string;
    rule: string;
    books?: string[];
    items?: string[];
    tag_names?: string[];
    created_at?: string;
    updated_at?: string;
}

export interface PracticeResult {
    monster_id: string;
    result: "defeat" | "miss" | "hit" | "kill" | "complete"
}


// 创建复习计划
export const createCampaign = async (data: Partial<Dungeon>) => {
    (data as any).type = "campaign"
    return axios.post('/dungeon/dungeons', data);
};

// 创建复习计划
export const createDungeon = async (data: Partial<Dungeon>) => {
    return axios.post('/dungeon/dungeons', data);
};

// 获取所有复习计划
export const getDungeons = async (params: {page: number, limit: number}) => {
    return axios.get('/dungeon/dungeons', {params});
};

// 获取复习计划详情
export const getDungeonDetail = async (id: string) => {
    return axios.get(`/dungeon/dungeons/${id}`);
};

// 更新复习计划信息
export const updateDungeon = async (id: string, data: Partial<Dungeon>) => {
    return axios.put(`/dungeon/dungeons/${id}`, data);
};

// 删除复习计划
export const deleteDungeon = async (id: string) => {
    return axios.delete(`/dungeon/dungeons/${id}`);
};

// 获取复习计划的 Books
export const getDungeonBooks = async (dungeonId: string) => {
    return axios.get(`/dungeon/dungeons/${dungeonId}/books`);
};

// 向现有复习计划添加书籍
export const addDungeonBooks = async (dungeonId: string, books: number[]) => {
    return axios.post(`/dungeon/dungeons/${dungeonId}/books`, { books });
};

// 删除复习计划的 Books
export const removeDungeonBooks = async (dungeonId: string, books: number[]) => {
    return axios.delete(`/dungeon/dungeons/${dungeonId}/books`, { data: { books } });
};

// 获取复习计划的 Items
export const getDungeonItemsId = async (dungeonId: string, params?: {page?: number, limit?: number}) => {
    return axios.get(`/dungeon/dungeons/${dungeonId}/items`, {params});
};


// 向现有复习计划添加学习材料
export const addDungeonItems = async (dungeonId: string, items: string[]) => {
    return axios.post(`/dungeon/dungeons/${dungeonId}/items`, { items });
};

// 删除复习计划的 Items
export const removeDungeonItems = async (dungeonId: string, items: string[]) => {
    return axios.delete(`/dungeon/dungeons/${dungeonId}/items`, { data: { items } });
};

// 获取复习计划的 Tags
export const getDungeonTags = async (dungeonId: string) => {
    return axios.get(`/dungeon/dungeons/${dungeonId}/tags`);
};

// 向现有复习计划添加标签
export const addDungeonTags = async (dungeonId: string, tags: string[]) => {
    return axios.post(`/dungeon/dungeons/${dungeonId}/tags`, { tags });
};

// 删除复习计划的 Tags
export const removeDungeonTags = async (dungeonId: string, tags: string[]) => {
    return axios.delete(`/dungeon/dungeons/${dungeonId}/tags`, { data: { tags } });
};

// 获取复习计划的 Monsters
export const getPracticeMonsters = async (dungeonId: string, count: number, strategy: string) => {
    return axios.get(`/dungeon/campaigns/${dungeonId}/practice`, { params: { count, strategy } });
};

// 上报复习计划的 Monster 结果
export const submitPracticeResult = async (dungeonId: string, result: PracticeResult) => {
    return axios.post(`/dungeon/campaigns/${dungeonId}/submit`, result);
};

// 获取复习计划的结果
export const getPracticeResults = async (dungeonId: string) => {
    return axios.get(`/dungeon/campaigns/${dungeonId}/results`);
};


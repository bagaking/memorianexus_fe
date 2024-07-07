import axios from './axios';


// 获取 Campaign 的 Monster 列表
export const getCampaignMonsters = async (dungeonId: string, page: number = 0, limit: number = 10) => {
    return axios.get(`/dungeon/campaigns/${dungeonId}/monsters`, {
        params: { page, limit },
    });
};
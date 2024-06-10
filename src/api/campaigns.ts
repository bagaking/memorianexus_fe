import axios from './axios';


// 获取 Campaign 的 Monster 列表
export const getCampaignMonsters = async (dungeonId: string, offset: number = 0, limit: number = 10) => {
    return axios.get(`/dungeon/campaigns/${dungeonId}/monsters`, {
        params: { offset, limit },
    });
};
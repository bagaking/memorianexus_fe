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
export const getPracticeMonsters = async (dungeonId: string, count: number) => {
    return axios.get(`/dungeon/campaigns/${dungeonId}/practice`, { params: { count } });
};

// 上报复习计划的 Monster 结果
/* example
{
    "message": "user-monster practice result updated",
    "data": {
        "from": {
            "dungeon_id": "7394140847492562945",
            "item_id": "7394140727355228161",
            "practice_at": "2024-09-01T16:06:15.34422696+08:00",
            "next_practice_at": "2024-09-01T16:35:09.355465134+08:00",
            "practice_count": 1,
            "familiarity": "16%",
            "difficulty": 1,
            "importance": 1,
            "description": "## 营养计划需要因人而异的原因，具体有哪些分类？\n\n营养计划需要个性化的原因主要分为以下几类：\n\n- **生���特征**：包括遗传、性别、年龄、体型、身体成分。\n- **健康状况**：包括病史和运动损伤。\n- **营养和生活习惯**：包括运动员的饮食习惯、生活习惯、食物和口味偏好。\n- **环境和资源**：包括训练环境、食材获取难易程度、烹饪能力、经济条件。\n- **训练要求**：包括当前的训练计划和设定的营养目标。\n- **补剂使用情况**：考虑运动员已经使用或计划使用的营养补剂。\n",
            "source_type": 1,
            "source_id": "7394140727355228161",
            "created_at": "2024-07-22T01:23:30+08:00"
        },
        "updates": {
            "familiarity": 16,
            "next_practice_at": "2024-09-01T16:35:09.355465134+08:00",
            "practice_at": "2024-09-01T16:06:15.34422696+08:00",
            "practice_count": {
                "SQL": "practice_count + ?",
                "Vars": [
                    1
                ],
                "WithoutParentheses": false
            },
            "visibility": 0
        },
        "points_update": {
            "cash": "44",
            "gem": "0",
            "vip_score": "0"
        }
    }
}
*/
export const submitPracticeResult = async (dungeonId: string, result: PracticeResult): Promise<PracticeResultResponse> => {
    const resp = await axios.post(`/dungeon/campaigns/${dungeonId}/submit`, result);
    return resp.data
};

export type PracticeResultEnum = "defeat" | "miss" | "hit" | "kill" | "complete"

export interface PracticeResult {
    monster_id: string;
    result: PracticeResultEnum;
}

export interface PracticeResultResponse {
    message: string;
    data: {
        from: {
            dungeon_id: string;
            item_id: string;
            practice_at: string;
            next_practice_at: string;
            practice_count: number;
            familiarity: string;
            difficulty: number;
            importance: number;
            description: string;
            source_type: number;
            source_id: string;
            created_at: string;
        };
        updates: {
            familiarity: number;
            next_practice_at: string;
            practice_at: string;
            practice_count: {
                SQL: string;
                Vars: number[];
                WithoutParentheses: boolean;
            };
            visibility: number;
        };
        points_update: {
            cash: string;
            gem: string;
            vip_score: string;
        };
    };
}

// 获取复习计划的结果
export const getPracticeResults = async (dungeonId: string) => {
    return axios.get(`/dungeon/campaigns/${dungeonId}/results`);
};


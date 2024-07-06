export interface DungeonMonster {
    dungeon_id: string;
    item_id: string;
    source_type: string;
    source_id: string;
    practice_at: string;
    next_practice_at: string;
    practice_count: number;
    visibility: number;
    avatar: string;
    name: string;
    description: string;
    familiarity: number;
    difficulty: string;
    importance: string;
    created_at?: string;
}

export interface Item {
    id: string;
    type: string;
    content: string;

    creator_id?: string;
    book_ids?: number[];
    tags?: string[];

    created_at?: string;
    updated_at?: string;
    difficulty?: number;
    importance?: number;
}

export const DefaultItem: Item = {
    id: "",
    type: "",
    content: "",
}

export interface Book {
    id: string;
    title: string;
    description: string;
    tags?: string[];
}
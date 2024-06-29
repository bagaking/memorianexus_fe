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
    familiarity: number;
    difficulty: string;
    importance: string;
    created_at: string;
}

export interface Item {
    id?: string;
    content: string;
    type: string;
    book_ids?: number[];
    tags?: string[];
}


export interface Book {
    id: string;
    title: string;
    description: string;
    tags?: string[];
}
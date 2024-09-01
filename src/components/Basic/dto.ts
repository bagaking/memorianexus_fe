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
    familiarity: string;
    difficulty: string;
    importance: string;
    created_at?: string;
}

export interface SubmitResultResponse {
    familiarity: number;
    next_practice_at: string;
    practice_at: string;
    practice_count: number;
}

export interface DungeonMonsterWithResult extends DungeonMonster {
    submitResult?: SubmitResultResponse;
}


export interface Points {
    cash: string ; // uint64 str
    gem: string ; // uint64 str
    vip_score: string ; // uint64 str
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

export interface Dungeon {
    id?: string;
    created_at?: string;
    updated_at?: string;
    books?: string[];
    items?: string[];
    tags?: string[];
    review_interval? : string[]; //ReviewInterval *def.RecallIntervalLevel `json:"review_interval,omitempty"`
    difficulty_preference? : string; //DifficultyPreference *utils.Percentage `json:"difficulty_preference,omitempty"`
    quiz_mode? : string; //QuizMode *def.QuizMode `json:"quiz_mode,omitempty"`
    priority_mode? : string[]; //PriorityMode *def.PriorityMode `json:"priority_mode,omitempty"`
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


export const ParseUint64 = (x: string | number | undefined | null) => {
    if (!x) return 0
    if (typeof(x) == "number") {
        return x
    }
    return Number.parseInt(x)
}

export const ParsePercentage = (x: string | number | undefined | null) => {
    if (!x) {
        return 0
    }
    if (typeof(x) == "number") {
        return x
    }
    if (x.endsWith("%")) {
        x = x.substring(0, x.length - 1)
    }
    return Number.parseInt(x)
}
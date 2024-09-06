import { Percentage, UInt64 } from './_common';
import { DifficultyLevel, ImportanceLevel, DungeonType, RecallIntervalLevel, QuizMode, PriorityMode, MonsterSource, PracticeResultEnum,  } from './_enums';

// 具体业务类型
// ---------------

/**
 * 学习词条接口
 */
export interface Item {
    id: UInt64;
    creator_id: UInt64;
    type: string;
    content: string;
    tags?: string[];
    created_at: string;
    updated_at: string;
    difficulty: DifficultyLevel;
    importance: ImportanceLevel;
}

/**
 * 书籍接口
 */
export interface Book {
    id: UInt64;
    user_id: UInt64;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    tags?: string[];
}

export interface BookItem {
    book_id: UInt64;
    item_id: UInt64;
}


/**
 * 记忆设置接口
 */
export interface SettingsMemorization {
    review_interval?: RecallIntervalLevel;
    difficulty_preference?: Percentage;
    quiz_mode?: QuizMode;
    priority_mode?: PriorityMode;
}

/**
 * 地牢（复习计划）数据接口
 */
export interface DungeonData extends Partial<SettingsMemorization> {
    type: DungeonType;
    title: string;
    description: string;
}

/**
 * 地牢（复习计划）接口
 */
export interface Dungeon extends DungeonData {
    id: UInt64;

    created_at: string;
    updated_at: string;
    books?: UInt64[];
    items?: UInt64[];
    tags?: string[];
}

/**
 * 地牢怪物（学习项目）接口
 */
export interface DungeonMonster {
    dungeon_id: UInt64;
    item_id: UInt64;
    practice_at: string;
    next_practice_at: string;
    practice_count: number;

    familiarity: Percentage;
    difficulty: DifficultyLevel;
    importance: ImportanceLevel;
    visibility: Percentage;

    avatar: string;
    name: string;
    description: string;
    source_type: MonsterSource;
    source_id: UInt64;
    created_at: string;
}

/**
 * 个人资料接口
 */
export interface Profile {
    id: UInt64;
    nickname: string;
    email: string;
    bio: string;
    avatar_url?: string;
    created_at: string;
}

/**
 * 高级设置接口
 */
export interface SettingsAdvance {
    theme: string;
    language: string;
    email_notifications: boolean;
    push_notifications: boolean;
}

/**
 * 积分接口
 */
export interface Points {
    cash: UInt64;
    gem: UInt64;
    vip_score: UInt64;
}

// Response Model
// ---------------

/**
 * 提交结果接口
 */
export interface DungenUpdateResults {
    updater: Updater<DungeonMonster>;
    points_update: Points;
}


// 通用响应类型
// ---------------

/**
 * 通用成功响应接口
 */
export interface RespSuccess<T> {
    message: string;
    data?: T;
}

/**
 * 更新器接口
 */
export interface Updater<T> {
    from?: T;
    to?: T;
    updates?: Record<string, any>;
}

/**
 * 分页器接口
 */
export interface Pager {
    offset: number;
    limit: number;
    total: number;
}

/**
 * 带分页的成功响应接口
 */
export interface RespSuccessPage<T> extends Pager {
    message: string;
    data: T[];
    extra?: any;
}


/**
 * ID列表响应类型
 */
export type RespIDList = RespSuccessPage<UInt64>;

// 响应类型
// ---------------

export type RespBookGet = RespSuccess<Book>;
export type RespBookCreate = RespSuccess<Book>;
export type RespBookUpdate = RespSuccess<Book>;
export type RespBookDelete = RespSuccess<UInt64>;
export type RespBooks = RespSuccessPage<Book>;


export type RespBookAddItems = RespSuccess<BookItem[]>;
export type RespBookRemoveItems = RespSuccess<BookItem[]>;

export type RespItemGet = RespSuccess<Item>;
export type RespItemDelete = RespSuccess<Item>;
export type RespItemCreate = RespSuccess<Item>;
export type RespItemUpdate = RespSuccess<Item>;
export type RespItemList = RespSuccessPage<Item>;

export type RespDungeon = RespSuccess<Dungeon>;
export type RespDungeonList = RespSuccessPage<Dungeon>;

export type RespMonsterUpdate = RespSuccess<DungenUpdateResults>;
export type RespMonsterGet = RespSuccess<DungeonMonster>;
export type RespMonsterList = RespSuccessPage<DungeonMonster>;

export type RespProfile = RespSuccess<Profile>;
export type RespSettingsMemorization = RespSuccess<SettingsMemorization>;
export type RespSettingsAdvance = RespSuccess<SettingsAdvance>;
export type RespPoints = RespSuccess<Points>;

export type RespTagGet = RespSuccess<string>;
export type RespTagList = RespSuccessPage<string>;


// Custom
// ---------------

// DungeonMonsterWithResult
export interface DungeonMonsterWithResult extends DungeonMonster {
    submitResult?: Partial<PractiveSubmit>;
}

/**
 * 练习结果接口
 */
export interface PracticeResult {
    monster_id: UInt64;
    result: PracticeResultEnum;
}

export interface PractiveSubmit {
    familiarity: Percentage;

    practice_at: string;
    next_practice_at: string;
    
    visibility: Percentage;

    practice_count?: number | {
        SQL: string;
        Vars: number[];
        WithoutParentheses: boolean;
    };
}

/**
 * 练习结果响应接口
 */
export interface PracticeResultResponse {
    message: string;
    data: {
        from: DungeonMonster;
        updates: PractiveSubmit;
        points_update: Points;
    };
}


// 辅助函数
// ---------------

/**
 * 解析 uint64 字符串为数字
 * @param x - 要解析的值
 * @returns 解析后的数字
 */
export const parseUint64 = (x: string | number | undefined | null): number => {
    if (!x) return 0;
    if (typeof x === "number") {
        return x;
    }
    return Number.parseInt(x);
};

/**
 * 解析百分比字符串为数字
 * @param x - 要解析的值
 * @returns 解析后的数字
 */
export const parsePercentage = (x: string | number | undefined | null): number => {
    if (!x) {
        return 0;
    }
    if (typeof x === "number") {
        return x;
    }
    if (typeof x === "string" && x.endsWith("%")) {
        x = x.substring(0, x.length - 1);
    }
    return Number.parseInt(x);
};
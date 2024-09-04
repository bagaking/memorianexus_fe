import { Book, Item, Dungeon } from "./_dto";
import { DifficultyLevel, ImportanceLevel, DungeonType } from "./_enums";

// 默认值
// ---------------

/**
 * 默认学习条目
 */
export const DEFAULT_ITEM: Readonly<Item> = {
    id: "0",
    creator_id: "0",
    type: "",
    content: "",
    created_at: "",
    updated_at: "",
    difficulty: DifficultyLevel.Normal,
    importance: ImportanceLevel.Normal,
} as const;

/**
 * 默认书籍
 */
export const DEFAULT_BOOK: Readonly<Book> = {
    id: '0',
    user_id: '0',
    title: '',
    description: '',
    tags: [] as string[],
    created_at: '',
    updated_at: ''
} as const;

/**
 * 默认 dungeon
 */
export const DEFAULT_DUNGEON: Readonly<Dungeon> = {
    id: '0',
    type: DungeonType.Campaign,
    title: '',
    description: '',
    created_at: '',
    updated_at: ''
} as const;
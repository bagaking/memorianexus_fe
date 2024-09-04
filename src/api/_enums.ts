/**
 * 难度等级枚举
 */
export enum DifficultyLevel {
    VeryEasy = 1,
    Easy = 2,
    Normal = 3,
    Hard = 4,
    VeryHard = 5
}

/**
 * 重要性等级枚举
 */
export enum ImportanceLevel {
    VeryLow = 1,
    Low = 2,
    Normal = 3,
    High = 4,
    VeryHigh = 5
}

/**
 * 地牢类型枚举
 */
export enum DungeonType {
    Campaign = "campaign",
    Endless = "endless",
    Instance = "instance",
}

/**
 * 回忆间隔等级枚举
 */
export enum RecallIntervalLevel {
    VeryShort = "very_short",
    Short = "short",
    Medium = "medium",
    Long = "long",
    VeryLong = "very_long"
}

/**
 * 测验模式枚举
 */
export enum QuizMode {
    Random = "random",
    Ordered = "ordered",
    Adaptive = "adaptive"
}

/**
 * 优先级模式枚举
 */
export enum PriorityMode {
    Difficulty = "difficulty",
    Importance = "importance",
    DueDate = "due_date"
}

/**
 * 怪物来源枚举
 */
export enum MonsterSource {
    Book = "book",
    Item = "item",
    Tag = "tag"
}

/**
 * 练习结果枚举
 */
export enum PracticeResultEnum {
    Defeat = "defeat",
    Miss = "miss",
    Hit = "hit",
    Kill = "kill",
    Complete = "complete"
}
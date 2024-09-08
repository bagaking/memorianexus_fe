import React from 'react';
import { DungeonMonsterWithResult } from "../../api";

interface MonsterResultInfoProps {
    submitResult: DungeonMonsterWithResult['submitResult'];
}

const MonsterResultInfo: React.FC<MonsterResultInfoProps> = ({ submitResult }) => {
    const getPracticeCount = (practiceCount: number | { SQL: string; Vars: number[]; WithoutParentheses: boolean }) => {
        return typeof practiceCount === 'number' ? practiceCount : '更新中';
    };

    if (!submitResult) return null;

    return (
        <div className="monster-result-info">
            <p>熟练度: {submitResult.familiarity}%</p>
            <p>下次复习: {new Date(submitResult.next_practice_at || '').toLocaleString()}</p>
            <p>上次练习: {new Date(submitResult.practice_at || '').toLocaleString()}</p>
            <p>练习次数: {getPracticeCount(submitResult.practice_count || 0)}</p>
        </div>
    );
};

export default React.memo(MonsterResultInfo);
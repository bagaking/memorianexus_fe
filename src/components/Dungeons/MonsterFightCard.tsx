import React, { useState, useEffect } from 'react';
import MonsterHealthBar from './MonsterHealthBar';
import MonsterPortrait from './MonsterPortrait';
import { TaggedMarkdown } from '../Common/TaggedMarkdown';
import { DungeonMonsterWithResult, Item, parsePercentage } from "../../api";
import './MonsterFightCard.less'; // 导入样式文件
import FirstLineMD from '../Common/FirstLineMD';
import { DifficultyImportance } from '../Basic/ItemComponents'; // 导入 DifficultyImportance 组件

interface MonsterFightCardProps {
    monster: DungeonMonsterWithResult;
    itemDetail: Item | undefined;
    isActive: boolean;
    isPrev: boolean;
    disableTransition: boolean;
    showFullContent: boolean; // 从外部传入的属性
    onClick: () => void;
}

const MonsterFightCard: React.FC<MonsterFightCardProps> = ({
    monster,
    itemDetail,
    isActive,
    isPrev,
    disableTransition,
    showFullContent, // 使用外部传入的 showFullContent
    onClick
}) => {
    const [localShowFullContent, setLocalShowFullContent] = useState(showFullContent); // 本地状态

    // 监控外部 showFullContent 的变化
    useEffect(() => {
        setLocalShowFullContent(showFullContent);
    }, [showFullContent]);

    const toggleContent = () => {
        setLocalShowFullContent(prev => !prev); // 切换状态
    };

    console.log('localShowFullContent:', localShowFullContent); // 调试信息
    console.log('monster.submitResult:', monster.submitResult); // 调试信息

    const getPracticeCount = (practiceCount: number | { SQL: string; Vars: number[]; WithoutParentheses: boolean }) => {
        if (typeof practiceCount === 'number') {
            return practiceCount;
        }
        return '更新中';
    };

    return (
        <div 
            onClick={() => {
                onClick(); // 调用父组件的点击处理
                toggleContent(); // 切换内容显示状态
            }}
            className={`monster-card ${isActive ? 'active' : ''} ${isPrev ? 'prev' : ''} ${disableTransition ? 'no-transition' : ''}`} >
            <div className="monster-image-container">
                <MonsterPortrait 
                    id={monster.item_id}
                    alt="Monster Avatar" 
                />
                <div className="monster-info-bar">
                    <MonsterHealthBar 
                        health={100 - parsePercentage(monster.familiarity)}
                        fillClassName={`${disableTransition ? 'no-transition' : ''}`}
                    >
                        <DifficultyImportance 
                            difficulty={monster.difficulty} 
                        />
                    </MonsterHealthBar>
                </div>
                <div className={`monster-title-container ${localShowFullContent ? 'hide' : ''}`}>
                    <div className="monster-title">
                        <FirstLineMD content={itemDetail?.content || ''} allowToggle={false} />
                    </div>
                </div>
            </div>
            
            <div className={`monster-front-content ${disableTransition ? 'no-transition' : ''} ${localShowFullContent ? 'show-full-content' : ''}`}>
                {monster.submitResult && (
                    <div className="monster-result-info">
                        <p>熟练度: {monster.submitResult.familiarity}%</p>
                        <p>下次复习: {new Date(monster.submitResult.next_practice_at || '').toLocaleString()}</p>
                        <p>上次练习: {new Date(monster.submitResult.practice_at || '').toLocaleString()}</p>
                        <p>练习次数: {getPracticeCount(monster.submitResult.practice_count || 0)}</p>
                    </div>
                )}
                <TaggedMarkdown mode='tag' showDivider={true}>{itemDetail?.content || ''} </TaggedMarkdown>
            </div>
        </div>
    );
};

export default MonsterFightCard;
import React, { useCallback, useMemo } from 'react';
import MonsterHealthBar from './MonsterHealthBar';
import MonsterPortrait from './MonsterPortrait';
import { TaggedMarkdown } from '../Common/TaggedMarkdown';
import { DungeonMonsterWithResult, Item, parsePercentage } from "../../api";
import './MonsterFightCard.less';
import FirstLineMD from '../Common/FirstLineMD';
import { DifficultyImportance } from '../Basic/ItemComponents';
import MonsterResultInfo from './MonsterResultInfo';

interface MonsterFightCardProps {
    monster: DungeonMonsterWithResult;
    itemDetail: Item | undefined;
    isActive: boolean;
    isOpen: boolean;
    disableTransition: boolean;
    onClick: () => void;
}

const MonsterFightCard: React.FC<MonsterFightCardProps> = ({
    monster,
    itemDetail,
    isActive,
    isOpen,
    disableTransition,
    onClick
}) => {
    const handleClick = useCallback(() => {
        onClick();
    }, [onClick]);

    const renderMonsterInfo = useMemo(() => (
        <div className="monster-info-bar">
            <MonsterHealthBar 
                health={100 - parsePercentage(monster.familiarity)}
                fillClassName={disableTransition ? 'no-transition' : ''}
            >
                <DifficultyImportance difficulty={monster.difficulty} />
            </MonsterHealthBar>
        </div>
    ), [monster.familiarity, monster.difficulty, disableTransition]);

    const renderMonsterTitle = useMemo(() => (
        <div className={`monster-title-container ${isOpen ? 'hide' : ''}`}>
            <div className="monster-title">
                <FirstLineMD content={itemDetail?.content || ''} allowToggle={false} />
            </div>
        </div>
    ), [isOpen, itemDetail]);

    const renderMonsterContent = useMemo(() => (
        <div className={`monster-front-content ${disableTransition ? 'no-transition' : ''} ${isOpen ? 'show-full-content' : ''}`}>
            <MonsterResultInfo submitResult={monster.submitResult} />
            <TaggedMarkdown mode='tag' showDivider={true}>{itemDetail?.content || ''}</TaggedMarkdown>
        </div>
    ), [monster.submitResult, itemDetail, isOpen, disableTransition]);

    return (
        <div 
            onClick={handleClick}
            className={`monster-card ${isActive ? 'active' : ''} ${isOpen ? 'open' : ''} ${disableTransition ? 'no-transition' : ''}`}
        >
            <div className="monster-image-container">
                <MonsterPortrait 
                    id={monster.item_id}
                    alt="Monster Avatar" 
                />
                {renderMonsterInfo}
                {renderMonsterTitle}
            </div>
            {renderMonsterContent}
        </div>
    );
};

export default React.memo(MonsterFightCard);
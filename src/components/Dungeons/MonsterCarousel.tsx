import React from 'react';
import { DungeonMonster, Item, ParsePercentage } from '../Basic/dto';
import MonsterPortrait from './MonsterPortrait';
import MonsterHealthBar from './MonsterHealthBar';
import { TaggedMarkdown } from '../Common/TaggedMarkdown';
import './MonsterCarousel.less';

interface MonsterCarouselProps {
    monsters: DungeonMonster[];
    itemDetails: Item[];
    currentMonsterIndex: number;
    showFullContent: boolean;
    toggleMonsterContent: () => void;
    setCurrentMonsterIndex: (index: number) => void;
}

const MonsterCarousel: React.FC<MonsterCarouselProps> = ({
    monsters,
    itemDetails,
    currentMonsterIndex,
    showFullContent,
    toggleMonsterContent,
    setCurrentMonsterIndex
}) => {
    const getFirstNonEmptyLine = (content: string = "") => {
        return content.split('\n').filter(line => line.trim() !== '')[0] || '';
    };

    const handleCardClick = (index: number, isActive: boolean) => {
        if (isActive) {
            toggleMonsterContent();
        } else {
            setCurrentMonsterIndex(index);
        }
    };

    const getMonsterCard = (index: number, isActive: boolean) => {
        if (index < 0 || index >= monsters.length) return null;
        const monster = monsters[index];
        const itemDetail = itemDetails.find(detail => detail.id === monster.item_id);
        return (
            <div 
                className={`monster-card ${isActive ? 'active' : ''} ${showFullContent && isActive ? 'show-full-content' : ''}`} 
                onClick={() => handleCardClick(index, isActive)}
            >
                <div className="monster-image-container">
                    <MonsterPortrait 
                        src="/portraits/skeleton_warrior_01.png" 
                        alt="Monster Avatar" 
                    />
                    <MonsterHealthBar 
                        health={100 - ParsePercentage(monster.familiarity)}
                    />
                    <h2 className="monster-title">
                        <TaggedMarkdown>{getFirstNonEmptyLine(itemDetail?.content)}</TaggedMarkdown>
                    </h2>
                </div>
                <div className="monster-content">
                    <TaggedMarkdown mode='both'>{itemDetail?.content || ''}</TaggedMarkdown>
                </div>
            </div>
        );
    };

    const renderMonsterCards = () => {
        return (
            <div className="monster-cards-container">
                <div className="monster-card-wrapper prev">
                    {currentMonsterIndex > 0 ? getMonsterCard(currentMonsterIndex - 1, false) : <div className="placeholder"></div>}
                </div>
                <div className="monster-card-wrapper current">
                    {getMonsterCard(currentMonsterIndex, true)}
                </div>
                <div className="monster-card-wrapper next">
                    {currentMonsterIndex < monsters.length - 1 ? getMonsterCard(currentMonsterIndex + 1, false) : <div className="placeholder"></div>}
                </div>
            </div>
        );
    };

    return (
        <div className="monster-carousel">
            {renderMonsterCards()}
        </div>
    );
};

export default MonsterCarousel;
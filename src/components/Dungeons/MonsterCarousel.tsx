import React, { useState, useEffect, useRef } from 'react';
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
    const [isLoaded, setIsLoaded] = useState(false);
    const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [disableTransition, setDisableTransition] = useState(false);
    const [displayedIndex, setDisplayedIndex] = useState(currentMonsterIndex);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (slideDirection) {
            setIsTransitioning(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setIsTransitioning(false);
                setSlideDirection(null);
                setDisableTransition(true);
                setDisplayedIndex(currentMonsterIndex);
                requestAnimationFrame(() => {
                    // 稍微延迟一下再禁用过渡效果
                    setTimeout(() => {
                        setDisableTransition(false);
                    }, 50);
                });
            }, 300);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [slideDirection, currentMonsterIndex]);

    const handleCardClick = (index: number, isActive: boolean) => {
        if (isActive && !isTransitioning) {
            toggleMonsterContent();
        } else if (!isTransitioning && !slideDirection) {
            setSlideDirection(index > displayedIndex ? 'left' : 'right');
            setCurrentMonsterIndex(index);
        }
    };

    const getFirstNonEmptyLine = (content: string = "") => {
        return content.split('\n').filter(line => line.trim() !== '')[0] || '';
    };

    const renderMonsterCard = (index: number) => {
        if (index < 0 || index >= monsters.length) return null;
        const monster = monsters[index];
        const itemDetail = itemDetails.find(detail => detail.id === monster.item_id);
        const isActive = index === currentMonsterIndex;

        return (
            <div 
                className={`monster-card ${isActive ? 'active' : ''} ${showFullContent && isActive ? 'show-full-content' : ''} ${disableTransition ? 'no-transition' : ''}`} 
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
                <div className={`monster-content ${disableTransition ? 'no-transition' : ''}`}>
                    <TaggedMarkdown mode='both'>{itemDetail?.content || ''}</TaggedMarkdown>
                </div>
            </div>
        );
    };

    const renderMonsterCards = () => {
        const prevIndex = displayedIndex - 1;
        const nextIndex = displayedIndex + 1;
        const farPrevIndex = displayedIndex - 2;
        const farNextIndex = displayedIndex + 2;

        return (
            <div className={`monster-cards-container ${isLoaded ? 'loaded' : ''} ${slideDirection ? `slide-${slideDirection}` : ''} ${disableTransition ? 'no-transition' : ''}`}>
                <div className={`monster-card-wrapper far-prev ${disableTransition ? 'no-transition' : ''}`}>
                    {farPrevIndex >= 0 && renderMonsterCard(farPrevIndex)}
                </div>
                <div className={`monster-card-wrapper prev ${disableTransition ? 'no-transition' : ''}`}>
                    {prevIndex >= 0 && renderMonsterCard(prevIndex)}
                </div>
                <div className={`monster-card-wrapper current ${disableTransition ? 'no-transition' : ''}`}>
                    {renderMonsterCard(displayedIndex)}
                </div>
                <div className={`monster-card-wrapper next ${disableTransition ? 'no-transition' : ''}`}>
                    {nextIndex < monsters.length && renderMonsterCard(nextIndex)}
                </div>
                <div className={`monster-card-wrapper far-next ${disableTransition ? 'no-transition' : ''}`}>
                    {farNextIndex < monsters.length && renderMonsterCard(farNextIndex)}
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
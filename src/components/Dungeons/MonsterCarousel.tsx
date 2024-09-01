import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { DungeonMonsterWithResult, Item, ParsePercentage } from '../Basic/dto';
import MonsterPortrait from './MonsterPortrait';
import MonsterHealthBar from './MonsterHealthBar';
import { TaggedMarkdown } from '../Common/TaggedMarkdown';
import './MonsterCarousel.less';

interface MonsterCarouselProps {
    monsters: DungeonMonsterWithResult[];
    itemDetails: Item[];
    currentMonsterIndex: number;
    showFullContent: boolean;
    toggleMonsterContent: () => void;
    setCurrentMonsterIndex: (index: number) => void;
    onCardChange: (index: number) => void;
}

export interface MonsterCarouselRef {
    moveToNextCard: () => void;
}
const hashCode = function(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

const getMonsterPortrait = (id: string): string => {
    const hash = hashCode(id); // 假设 id 是字符串，使用 hashCode 方法
    const portraits = [
        "skeleton_warrior_01.png",
        "skeleton_warrior_02.png",
        "skeleton_warrior_03.png",
        "skeleton_warrior_04.png",
        "skeleton_warrior_05.png",
        "skeleton_warrior_06.png",
        "skeleton_warrior_07.png",
        "evil_warrior_01.png",
        "evil_warrior_02.png",
        "evil_warrior_03.png",
        "evil_warrior_04.png",
        "evil_warrior_05.png",
        "evil_warrior_06.png",
        "human_warrior_01.png",
        "human_warrior_02.png",
        "human_warrior_03.png",
        "human_warrior_04.png",
        "human_warrior_05.png",
        "human_warrior_06.png",
        "goblin_warrior_01.png",
        "goblin_warrior_02.png",
        "goblin_warrior_03.png",
        "goblin_warrior_04.png",
        "sea_warrior_01.png",
        "sea_warrior_02.png",
        "sea_warrior_03.png",
        "sea_warrior_04.png",
        "sea_warrior_05.png",
        "sea_warrior_06.png",
        "sea_warrior_07.png",
        "engineer_warrior_01.png",
        "engineer_warrior_02.png",
        "engineer_warrior_03.png",
        "engineer_warrior_04.png",
        "engineer_warrior_05.png",
        "engineer_warrior_06.png",
    ];

    // 使用 hash 值来选择头像，确保在 portraits 数组范围内
    const index = Math.abs(hash) % portraits.length;
    return `/portraits/${portraits[index]}`;
};


const MonsterCarousel = forwardRef<MonsterCarouselRef, MonsterCarouselProps>(({
    monsters,
    itemDetails,
    currentMonsterIndex,
    showFullContent,
    toggleMonsterContent,
    setCurrentMonsterIndex,
    onCardChange
}, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [disableTransition, setDisableTransition] = useState(false);
    const [displayedIndex, setDisplayedIndex] = useState(currentMonsterIndex);
    const [localShowFullContent, setLocalShowFullContent] = useState(showFullContent);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const TRANSITION_DURATION = 500; // 与 CSS 中的过渡时间保持一致

    const resetCarousel = useCallback(() => {
        setDisableTransition(true);
        setSlideDirection(null);
        setDisplayedIndex(currentMonsterIndex);
        
        // 如果 monster-content 是显示状态，则关闭它
        if (showFullContent) {
            toggleMonsterContent();
        }
        
        requestAnimationFrame(() => {
            setDisableTransition(false);
        });
    }, [currentMonsterIndex, showFullContent, toggleMonsterContent]);

    const changeCard = useCallback((newIndex: number, animate: boolean = true) => {
        if (newIndex < 0 || newIndex >= monsters.length) return;

        if (showFullContent) {
            toggleMonsterContent();
        }

        if (animate) {
            setSlideDirection(newIndex > displayedIndex ? 'left' : 'right');
            setIsTransitioning(true);
            setCurrentMonsterIndex(newIndex);
        } else {
            setDisableTransition(true);
            setCurrentMonsterIndex(newIndex);
            setDisplayedIndex(newIndex);
            requestAnimationFrame(() => {
                setTimeout(() => {
                    setDisableTransition(false);
                }, 100);
            });
        }

        onCardChange(newIndex);
    }, [displayedIndex, monsters.length, showFullContent, toggleMonsterContent, setCurrentMonsterIndex, onCardChange]);

    const moveToNextCard = useCallback(() => {
        const nextIndex = (currentMonsterIndex + 1) % monsters.length;
        changeCard(nextIndex, true);
    }, [currentMonsterIndex, monsters.length, changeCard]);

    useImperativeHandle(ref, () => ({
        moveToNextCard
    }));

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isTransitioning) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                resetCarousel();
                setIsTransitioning(false);
            }, TRANSITION_DURATION);
        }
    }, [isTransitioning, resetCarousel]);

    useEffect(() => {
        if (!isTransitioning) {
            setDisplayedIndex(currentMonsterIndex);
        }
    }, [currentMonsterIndex, isTransitioning]);

    useEffect(() => {
        setLocalShowFullContent(showFullContent);
    }, [showFullContent]);

    const handleCardClick = (index: number) => {
        // 只允许当前显示的卡片被点击
        if (index !== displayedIndex) return;

        if (!isTransitioning) {
            // 如果当前卡片有 submitResult，保持全内容状态
            const monster = monsters[index];
            if (monster.submitResult) {
                setLocalShowFullContent(true);
            } else {
                setLocalShowFullContent(!localShowFullContent);
                toggleMonsterContent();
            }
        }
    };

    const getFirstNonEmptyLine = (content: string = "") => {
        return content.split('\n').filter(line => line.trim() !== '')[0] || '';
    };

    const renderMonsterCard = (index: number) => {
        if (index < 0 || index >= monsters.length) return null;
        const monster = monsters[index];
        const itemDetail = itemDetails.find(detail => detail.id === monster.item_id);
        const isActive = index === displayedIndex;
        const isPrev = index === displayedIndex - 1;

        const getPracticeCount = (practiceCount: number | { SQL: string; Vars: number[]; WithoutParentheses: boolean }) => {
            if (typeof practiceCount === 'number') {
                return practiceCount;
            }
            return '更新中';
        };

        console.log("Monster:", monster);

        return (
            <div 
                onClick={() => handleCardClick(index)}
                className={`monster-card 
                    ${isActive ? 'active' : ''} 
                    ${isPrev ? 'prev' : ''} 
                    ${(localShowFullContent && isActive || monster.submitResult) ? 'show-full-content' : ''} 
                    ${disableTransition ? 'no-transition' : ''}`
                } 
            >
                <div className="monster-image-container">
                    <MonsterPortrait 
                        src={getMonsterPortrait(monster.item_id)} // 使用头像映射函数
                        alt="Monster Avatar" 
                    />
                    <MonsterHealthBar 
                        health={100 - ParsePercentage(monster.familiarity)} fillClassName={`${disableTransition ? 'no-transition' : ''}`}
                    />
                    <div className="monster-title-container">
                        <div className="monster-title">
                            <TaggedMarkdown mode='tag'>{getFirstNonEmptyLine(itemDetail?.content)}</TaggedMarkdown>
                        </div>
                    </div>
                </div>
                
                <div className={`monster-content ${disableTransition ? 'no-transition' : ''} `}>
                    {monster.submitResult && (
                        <div className="monster-result-info">
                            <p>熟练度: {monster.submitResult.familiarity}%</p>
                            <p>下次复习: {new Date(monster.submitResult.next_practice_at).toLocaleString()}</p>
                            <p>上次练习: {new Date(monster.submitResult.practice_at).toLocaleString()}</p>
                            <p>练习次数: {getPracticeCount(monster.submitResult.practice_count || 0)}</p>
                        </div>
                    )}
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
                    {renderMonsterCard(farPrevIndex)}
                </div>
                <div className={`monster-card-wrapper prev ${disableTransition ? 'no-transition' : ''}`}>
                    {renderMonsterCard(prevIndex)}
                </div>
                <div className={`monster-card-wrapper current ${disableTransition ? 'no-transition' : ''}`}>
                    {renderMonsterCard(displayedIndex)}
                </div>
                <div className={`monster-card-wrapper next ${disableTransition ? 'no-transition' : ''}`}>
                    {renderMonsterCard(nextIndex)}
                </div>
                <div className={`monster-card-wrapper far-next ${disableTransition ? 'no-transition' : ''}`}>
                    {renderMonsterCard(farNextIndex)}
                </div>
            </div>
        );
    };

    return (
        <div className="monster-carousel">
            {renderMonsterCards()}
        </div>
    );
});

export default MonsterCarousel;
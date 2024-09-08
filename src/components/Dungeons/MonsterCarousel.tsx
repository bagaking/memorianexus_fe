import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { DungeonMonsterWithResult, Item } from "../../api";
import MonsterFightCard from './MonsterFightCard'; // 导入新的 MonsterFightCard 组件
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

// 这个轮播组件实现的是有 3D 感的卡牌切换
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

    const handleCardClick = (index: number) => {
        console.log(`Clicked index: ${index}, displayedIndex: ${displayedIndex}`); // 调试信息
        if (index !== displayedIndex) return;

        if (!isTransitioning) {
            // 直接设置 showFullContent
            toggleMonsterContent(); // 调用切换内容的函数
        }
    };

    const renderMonsterCard = (index: number) => {
        if (index < 0 || index >= monsters.length) return null;
        const monster = monsters[index];
        const itemDetail = itemDetails.find(detail => detail.id === monster.item_id);
        const isActive = index === displayedIndex;
        const isPrev = index === displayedIndex - 1;

        // 传递 showFullContent 给当前和之前的卡片
        return (
            <MonsterFightCard 
                monster={monster}
                itemDetail={itemDetail}
                isActive={isActive}
                isPrev={isPrev}
                disableTransition={disableTransition}
                showFullContent={isActive || isPrev} // 当前或之前的卡片都显示内容
                onClick={() => handleCardClick(index)} // 处理点击事件
            />
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
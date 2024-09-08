import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { DungeonMonsterWithResult, Item } from "../../api";
import MonsterFightCard from './MonsterFightCard';
import './MonsterCarousel.less';

interface MonsterCarouselProps {
    monsters: DungeonMonsterWithResult[];
    itemDetails: Item[];
    currentMonsterIndex: number;
    setCurrentMonsterIndex: (index: number) => void;
    onCardChange: (index: number) => void;
    onNeedMoreData: () => void;
}

export interface MonsterCarouselRef {
    moveToNextCard: (newMonsters?: DungeonMonsterWithResult[], newItemDetails?: Item[]) => void;
}

const TRANSITION_DURATION = 500;
const PRELOAD_THRESHOLD = 3; // 当剩余3个怪物时开始预加载

// # AI 不要删这一段
// ## 动画说明: ------------------
// 切换时的动画连贯很重要，要避免更新数据导致内容看起来跳变。整个动画交互看起来的效果是：
// 卡片向左飞行时，应该严格飞行到前一张卡片所在的位置，即 current 飞到与之前 prev 重合的位置，next 飞到与之前 current 重合的位置
// 中间的卡片会飞到左边，这个 content 要保持一直打开的状态再飞过去，也就是原本如果是打开的，
// 就要把 sammary 刷上去以后开始飞，如果原本没打开，就替用户打开。而右边的卡片飞到中间变成 
// current 卡片，保持关闭的状态。
// ## 数据刷新时机: ---------------
// 数据更新要等动画播完, 要在位置刷回来的瞬间赋值。
// 也就是说，动画播完，位置刷回来，再赋值（在同一瞬间），这样动画和数据都是连贯的。
// ## 卡片交互说明: ---------------
// 另所有比 current 比当前早 (靠左) 的卡片，都要始终保持打开状态;
// 当前卡片一开始关闭，可以点击打开或关闭; 
// 之后的卡片保持关闭;

const MonsterCarousel = forwardRef<MonsterCarouselRef, MonsterCarouselProps>(({
    monsters,
    itemDetails,
    currentMonsterIndex,
    setCurrentMonsterIndex,
    onCardChange,
    onNeedMoreData
}, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [disableTransition, setDisableTransition] = useState(false);
    const [displayedIndex, setDisplayedIndex] = useState(currentMonsterIndex);
    const [openCardIndex, setOpenCardIndex] = useState<number | null>(null);
    const [displayedMonsters, setDisplayedMonsters] = useState(monsters);
    const [displayedItemDetails, setDisplayedItemDetails] = useState(itemDetails);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pendingUpdateRef = useRef<{ monsters?: DungeonMonsterWithResult[], itemDetails?: Item[], newIndex?: number } | null>(null);

    const resetCarousel = useCallback(() => {
        setDisableTransition(true);
        setSlideDirection(null);
        
        // 关键: 在重置位置的同时更新数据
        if (pendingUpdateRef.current) {
            const { monsters: newMonsters, itemDetails: newItemDetails, newIndex } = pendingUpdateRef.current;
            if (newMonsters) setDisplayedMonsters(newMonsters);
            if (newItemDetails) setDisplayedItemDetails(newItemDetails);
            if (newIndex !== undefined) {
                setDisplayedIndex(newIndex);
                setCurrentMonsterIndex(newIndex);
            }
            pendingUpdateRef.current = null;
        }
        
        // 使用 requestAnimationFrame 确保在下一帧重新启用过渡效果
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setDisableTransition(false);
                setSlideDirection(null);
            });
        });
    }, [setCurrentMonsterIndex]);

    const changeCard = useCallback((newIndex: number, animate: boolean = true, newMonsters?: DungeonMonsterWithResult[], newItemDetails?: Item[]) => {
        if (newIndex < 0 || newIndex >= displayedMonsters.length) return;

        if (animate) {
            // 开始动画
            setSlideDirection(newIndex > displayedIndex ? 'left' : 'right');
            setIsTransitioning(true);
            setOpenCardIndex(null);  // 新的当前卡片应该是关闭的

            // 存储待更新的数据
            pendingUpdateRef.current = { monsters: newMonsters, itemDetails: newItemDetails, newIndex };

            // 设置一个延迟,等待动画完成后更新数据
            setTimeout(() => {
                setIsTransitioning(false);
                resetCarousel();  // 重置轮播并更新数据
            }, TRANSITION_DURATION);
        } else {
            // 立即更新，不进行动画
            setDisableTransition(true);
            setDisplayedIndex(newIndex);
            setCurrentMonsterIndex(newIndex);
            setOpenCardIndex(null);
            if (newMonsters) setDisplayedMonsters(newMonsters);
            if (newItemDetails) setDisplayedItemDetails(newItemDetails);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setDisableTransition(false);
                });
            });
        }

        onCardChange(newIndex);

        // 检查是否需要预加载新数据
        if (displayedMonsters.length - newIndex <= PRELOAD_THRESHOLD) {
            // 触发预加载逻辑
            onNeedMoreData();
        }
    }, [displayedIndex, displayedMonsters.length, onCardChange, resetCarousel, setCurrentMonsterIndex, onNeedMoreData]);

    const moveToNextCard = useCallback((newMonsters?: DungeonMonsterWithResult[], newItemDetails?: Item[]) => {
        const nextIndex = (displayedIndex + 1) % displayedMonsters.length;
        changeCard(nextIndex, true, newMonsters, newItemDetails);
    }, [displayedIndex, displayedMonsters.length, changeCard]);

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

    const handleCardClick = useCallback((index: number) => {
        if (index === displayedIndex && !isTransitioning) {
            setOpenCardIndex(openCardIndex === index ? null : index);
            onCardChange(index);
        }
    }, [displayedIndex, isTransitioning, onCardChange, openCardIndex]);

    const renderMonsterCard = useCallback((index: number, position: string) => {
        // 使用模运算确保索引总是在有效范围内
        const wrappedIndex = ((index % displayedMonsters.length) + displayedMonsters.length) % displayedMonsters.length;
        const monster = displayedMonsters[wrappedIndex];
        const itemDetail = displayedItemDetails.find(detail => detail.id === monster.item_id);
        const isActive = wrappedIndex === displayedIndex;
        const isOpen = wrappedIndex < displayedIndex || wrappedIndex === openCardIndex;

        return (
            <MonsterFightCard 
                monster={monster}
                itemDetail={itemDetail}
                isActive={isActive}
                isOpen={isOpen}
                disableTransition={disableTransition}
                onClick={() => handleCardClick(wrappedIndex)}
            />
        );
    }, [displayedMonsters, displayedItemDetails, displayedIndex, openCardIndex, disableTransition, handleCardClick]);

    const renderMonsterCards = useCallback(() => {
        return (
            <div className={`monster-cards-container ${isLoaded ? 'loaded' : ''} ${slideDirection ? `slide-${slideDirection}` : ''} ${disableTransition ? 'no-transition' : ''}`}>
                {['far-prev', 'prev', 'current', 'next', 'far-next'].map((position, i) => (
                    <div key={position} className={`monster-card-wrapper ${position} ${disableTransition ? 'no-transition' : ''}`}>
                        {renderMonsterCard(displayedIndex + i - 2, position)}
                    </div>
                ))}
            </div>
        );
    }, [isLoaded, slideDirection, disableTransition, displayedIndex, renderMonsterCard]);

    return (
        <div className="monster-carousel">
            {renderMonsterCards()}
        </div>
    );
});

export default React.memo(MonsterCarousel);
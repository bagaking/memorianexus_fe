import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

interface ScrollAnimationOptions {
    animationDuration?: number;
    flashCount?: number;
    flashDuration?: number;
}

const flashAnimation = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const AnimatedTitleBase = styled.div<{ isFlashing: boolean }>`
  animation: ${flashAnimation} 0.5s ease-in-out;
  animation-play-state: ${props => props.isFlashing ? 'running' : 'paused'};
`;

export const useScrollAnimation = (
    loading: boolean,
    options: ScrollAnimationOptions = {}
) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [isFlashing, setIsFlashing] = useState(false);
    const [animationExecuted, setAnimationExecuted] = useState(false);

    const flashTitle = useCallback((count: number, flashDuration: number) => {
        return new Promise<void>((resolve) => {
            const flash = (remainingCount: number) => {
                if (remainingCount > 0) {
                    setIsFlashing(true);
                    setTimeout(() => {
                        setIsFlashing(false);
                        setTimeout(() => flash(remainingCount - 1), flashDuration / 2);
                    }, flashDuration / 2);
                } else {
                    resolve();
                }
            };
            flash(count);
        });
    }, []);

    const scrollToBottom = useCallback((duration: number) => {
        const startTime = performance.now();
        const startPosition = window.pageYOffset;
        const targetPosition = document.documentElement.scrollHeight - window.innerHeight;
        const distance = targetPosition - startPosition;

        const easeInOutCubic = (t: number): number => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

        const animateScroll = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    }, []);

    useEffect(() => {
        if (loading || animationExecuted || !contentRef.current || !titleRef.current) {
            return;
        }

        const {
            animationDuration = 3000,
            flashCount = 3,
            flashDuration = 500
        } = options;

        const runAnimation = async () => {
            await flashTitle(flashCount, flashDuration);
            scrollToBottom(animationDuration - flashCount * flashDuration);
            setAnimationExecuted(true);
        };

        runAnimation();
    }, [loading, options, flashTitle, scrollToBottom]);

    const AnimatedTitle: React.FC<React.PropsWithChildren<{}>> = useCallback(({ children }) => (
        <AnimatedTitleBase ref={titleRef} isFlashing={isFlashing}>{children}</AnimatedTitleBase>
    ), [isFlashing]);

    return { 
        contentRef, 
        AnimatedTitle
    };
};
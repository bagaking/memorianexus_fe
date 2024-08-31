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
    const [isFlashing, setIsFlashing] = useState(false);
    const animationExecutedRef = useRef(false);

    const flashTitle = useCallback((count: number, flashDuration: number) => {
        return new Promise<void>((resolve) => {
            let flashCount = 0;
            const flash = () => {
                if (flashCount < count) {
                    setIsFlashing(true);
                    setTimeout(() => {
                        setIsFlashing(false);
                        flashCount++;
                        setTimeout(flash, flashDuration / 2);
                    }, flashDuration / 2);
                } else {
                    resolve();
                }
            };
            flash();
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
        if (loading || animationExecutedRef.current || !contentRef.current) {
            return;
        }

        const {
            animationDuration = 3000,
            flashCount = 3,
            flashDuration = 500
        } = options;

        const runAnimation = async () => {
            animationExecutedRef.current = true;
            await flashTitle(flashCount, flashDuration);
            scrollToBottom(animationDuration - flashCount * flashDuration);
        };

        runAnimation();
    }, [loading, options, flashTitle, scrollToBottom]);

    const AnimatedTitle = useCallback<React.FC<React.PropsWithChildren<{}>>>(({ children }) => (
        <AnimatedTitleBase isFlashing={isFlashing}>{children}</AnimatedTitleBase>
    ), [isFlashing]);

    return { 
        contentRef, 
        AnimatedTitle
    };
};
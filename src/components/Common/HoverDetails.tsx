import React, { useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import styled from 'styled-components';

interface HoverDetailsProps {
    content: ReactNode;
    trigger: ReactNode;
    placement?: TooltipPlacement;
    color?: string;
    showCopyButton?: boolean;
    copyText?: string;
    [key: string]: any;
}

const TriggerDiv = styled.div<{ $bgColor: string; $isHovered: boolean }>`
  padding: 4px 8px;
  background: ${props => props.$isHovered ? 'rgba(24, 144, 255, 0.1)' : props.$bgColor};
  border-radius: 4px;
  transition: all 0.3s;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: ${props => props.$isHovered ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none'};
  & > * {
    margin: 0;
    padding: 0;
  }
`;

const ContentWrapper = styled.div<{ $width: number }>`
  background-color: #fff;
  color: #000;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 16px;
  width: ${props => props.$width}px;
  max-height: 80vh;
  overflow: auto;
`;

const StyledTooltip = styled(Tooltip)`
  .ant-tooltip-inner {
    background-color: transparent;
    padding: 0;
    box-shadow: none;
  }
`;

const HoverDetails: React.FC<HoverDetailsProps> = ({ 
    content, 
    trigger,
    placement = "top", 
    color = "transparent",
    showCopyButton = false,
    copyText,
    ...rest 
}) => {
    // 状态声明
    const [isVisible, setIsVisible] = useState(false);
    const [contentWidth, setContentWidth] = useState(600);
    const [adjustedPlacement, setAdjustedPlacement] = useState<TooltipPlacement>(placement);
    
    // ref 声明
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 处理鼠标进入事件
    const handleMouseEnter = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setIsVisible(true);
    }, []);

    // 处理鼠标离开事件
    const handleMouseLeave = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 100);
    }, []);

    // 计算内容位置和大小
    const calculateContentPosition = useCallback(() => {
        if (triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const padding = 20; // 边缘padding
            let newPlacement = placement;
            let width = 600;

            // 根据触发元素位置和视口大小调整 Tooltip 的位置和宽度
            // 调整水平位置
            if (placement.includes('left') && triggerRect.left < width + padding) {
                // 如果左侧空间不足，将 Tooltip 放在右侧
                newPlacement = newPlacement.includes('top') ? 'topRight' : 'bottomRight';
                width = Math.min(viewportWidth - triggerRect.right - padding, 600);
            } else if (placement.includes('right') && triggerRect.right + width + padding > viewportWidth) {
                // 如果右侧空间不足，将 Tooltip 放在左侧
                newPlacement = newPlacement.includes('top') ? 'topLeft' : 'bottomLeft';
                width = Math.min(triggerRect.left - padding, 600);
            } else if (!placement.includes('left') && !placement.includes('right')) {
                // 处理上/下位置的情况
                if (triggerRect.left + width / 2 > viewportWidth) {
                    newPlacement = placement.includes('top') ? 'topRight' : 'bottomRight';
                    width = Math.min(viewportWidth - triggerRect.left - padding, 600);
                } else if (triggerRect.right - width / 2 < 0) {
                    newPlacement = placement.includes('top') ? 'topLeft' : 'bottomLeft';
                    width = Math.min(triggerRect.right - padding, 600);
                }
            }

            // 调整垂直位置
            if (newPlacement.includes('top') && triggerRect.top < viewportHeight / 2) {
                // 如果上方空间不足，将 Tooltip 放在下方
                newPlacement = newPlacement.includes('Left') ? 'bottomLeft' : 'bottomRight';
            } else if (newPlacement.includes('bottom') && triggerRect.bottom > viewportHeight / 2) {
                // 如果下方空间不足，将 Tooltip 放在上方
                newPlacement = newPlacement.includes('Left') ? 'topLeft' : 'topRight';
            }

            // 更新状态
            setAdjustedPlacement(newPlacement as TooltipPlacement);
            setContentWidth(width);
        }
    }, [placement]);

    // 当 Tooltip 可见时，计算位置
    useEffect(() => {
        if (isVisible) {
            calculateContentPosition();
        }
    }, [isVisible, calculateContentPosition]);

    // 处理全局鼠标移动事件
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isVisible) return;

            const triggerElement = triggerRef.current;
            const tooltipElement = tooltipRef.current;

            if (triggerElement && tooltipElement) {
                // 检查鼠标是否在触发元素或 Tooltip 上
                const triggerRect = triggerElement.getBoundingClientRect();
                const tooltipRect = tooltipElement.getBoundingClientRect();

                const isOverTrigger = e.clientX >= triggerRect.left && e.clientX <= triggerRect.right &&
                                      e.clientY >= triggerRect.top && e.clientY <= triggerRect.bottom;

                const isOverTooltip = e.clientX >= tooltipRect.left && e.clientX <= tooltipRect.right &&
                                      e.clientY >= tooltipRect.top && e.clientY <= tooltipRect.bottom;

                if (!isOverTrigger && !isOverTooltip) {
                    handleMouseLeave();
                } else {
                    handleMouseEnter();
                }
            }
        };

        // 添加全局鼠标移动事件监听器
        document.addEventListener('mousemove', handleMouseMove);

        // 清理函数
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isVisible, handleMouseEnter, handleMouseLeave]);

    // 渲染组件
    return (
        <StyledTooltip
            title={
                <ContentWrapper ref={tooltipRef} $width={contentWidth}>
                    {content}
                </ContentWrapper>
            }
            placement={adjustedPlacement}
            visible={isVisible}
            onVisibleChange={setIsVisible}
            overlayInnerStyle={{ 
                padding: 0,
                maxWidth: 'none',
            }}
        >
            <TriggerDiv 
                ref={triggerRef}
                $bgColor={color} 
                $isHovered={isVisible}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                {...rest}
            >
                {trigger}
            </TriggerDiv>
        </StyledTooltip>
    );
};

export default HoverDetails;
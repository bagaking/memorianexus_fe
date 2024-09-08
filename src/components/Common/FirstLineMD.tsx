import React from 'react';
import { Link } from "react-router-dom";
import { TooltipPlacement } from 'antd/es/tooltip';
import TaggedMarkdown from './TaggedMarkdown';
import HoverDetails from './HoverDetails';
import styled from 'styled-components';

interface FirstLineProps {
    content: string;
    color?: string;
    placement?: TooltipPlacement;
    showName?: string;
    link?: string;
    linkText?: string;
    allowToggle?: boolean; // 新增属性，控制是否允许悬停显示内容
    [key: string]: any;
}

const ContentWrapper = styled.div`
  max-height: 60vh; // 使用视口高度的百分比
  overflow-y: auto;
  margin-bottom: 12px;
  line-height: 1.6;
  color: #333;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
    border-radius: 3px;
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  text-align: right;
  color: #1890ff;
  font-weight: 500;
  transition: all 0.3s;
  &:hover { 
    color: #40a9ff;
    text-decoration: underline;
  }
`;

const InlineContent = styled.span`
  display: inline-flex;
  align-items: center;
  max-width: 100%;
`;

const Ellipsis = styled.span`
  margin-left: 4px;
  color: #999;
`;

const FirstLineMD: React.FC<FirstLineProps> = ({ 
    content, 
    color = "transparent", 
    placement = "top", 
    showName, 
    link,
    linkText = "",
    allowToggle = true, // 默认允许悬停显示
    ...rest 
}) => {
    const firstLine = content.split('\n')[0];
    const hasMoreContent = content.split('\n').length > 1;

    const tooltipContent = (
        <>
            <ContentWrapper>
                <TaggedMarkdown mode="tag" showDivider={true}>{content}</TaggedMarkdown>
            </ContentWrapper>
            {link && linkText && (
                <StyledLink to={link} target="_blank">{linkText}</StyledLink>
            )}
        </>
    );

    const triggerContent = (
        <InlineContent>
            <TaggedMarkdown mode="tag">
                {showName || firstLine}
            </TaggedMarkdown>
            {hasMoreContent && allowToggle && <Ellipsis>...</Ellipsis>}
        </InlineContent>
    );

    if (!allowToggle) {
        return triggerContent;
    }

    return (
        <HoverDetails
            content={tooltipContent}
            trigger={triggerContent}
            color={color}
            placement={placement}
            overlayStyle={{ maxWidth: '90vw' }} // 添加这一行
            {...rest}
        />
    );
};

export default FirstLineMD;
import React from 'react';
import styled from 'styled-components';
import { Tag, Tooltip } from 'antd';
import { StarFilled, TrophyFilled, LinkOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import CopyableID from '../Common/CopyableID';
import FirstLineMD from '../Common/FirstLineMD';

export const TypeTag = styled(Tag)`
  margin-right: 0;
  padding: 0 4px;
  font-size: 10px;
`;

const DifficultyImportanceWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconWrapper = styled.span<{ level: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => `hsl(${props.level * 120}, 70%, 50%)`};
  color: white;
  font-size: 10px;
`;

interface DifficultyImportanceProps {
  difficulty: number | undefined;
  importance: number | undefined;
}

export const DifficultyImportance: React.FC<DifficultyImportanceProps> = ({ difficulty, importance }) => {
  const difficultyLevel = difficulty ? Math.floor(difficulty / 16) : 0; // 0 to 4
  const importanceLevel = importance ? Math.min(Math.floor(importance / 20), 5) : 0; // 0 to 5

  return (
    <DifficultyImportanceWrapper>
      <Tooltip title={`Difficulty: ${difficulty || 'N/A'}`}>
        <IconWrapper level={difficultyLevel / 4}>
          <TrophyFilled />
        </IconWrapper>
      </Tooltip>
      <Tooltip title={`Importance: ${importance || 'N/A'}`}>
        <div>
          {[...Array(5)].map((_, index) => (
            <StarFilled key={index} style={{ color: index < importanceLevel ? '#fadb14' : '#898989' }} />
          ))}
        </div>
      </Tooltip>
    </DifficultyImportanceWrapper>
  );
};

const IdWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconLink = styled(Link)`
  color: #1890ff;
  opacity: 0.6;
  transition: opacity 0.3s;
  font-size: 12px;
  &:hover {
    opacity: 1;
  }
`;

interface ItemIDProps {
  id: string;
}

export const ItemID: React.FC<ItemIDProps> = ({ id }) => {
  return (
    <IdWrapper>
      <CopyableID id={id} maxWidth={80} showBackground={false} tooltipTitle="点击复制 ID" />
      <Tooltip title="查看详情">
        <IconLink to={`/items/${id}`}>
          <LinkOutlined />
        </IconLink>
      </Tooltip>
    </IdWrapper>
  );
};

interface ItemContentProps {
  id: string;
  content: string;
}

export const ItemContent: React.FC<ItemContentProps> = ({ id, content }) => {
  return <FirstLineMD content={content} link={`/items/${id}`} linkText="" />
};

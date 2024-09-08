import React from 'react';
import styled from 'styled-components';
import { Tag, Tooltip, Progress } from 'antd'; // 导入 Progress 组件
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
  importance?: number;
  familiarity?: number | string; // 修改 familiarity 属性为可能的浮点数或字符串
}

export const DifficultyImportance: React.FC<DifficultyImportanceProps> = ({ difficulty, importance, familiarity }) => {
  const difficultyLevel = difficulty ? Math.floor(difficulty / 16) : 0; // 0 to 4
  const importanceLevel = importance ? Math.min(Math.floor(importance / 20), 5) : 0; // 0 to 5

  // 处理 familiarity，支持浮点数和字符串
  const familiarityValue = typeof familiarity === 'string' ? parseFloat(familiarity) : familiarity;
  const familiarityLevel = familiarityValue ? Math.min(Math.floor(familiarityValue / 20), 5) : 0; // 0 to 5

  return (
    <DifficultyImportanceWrapper>
      <Tooltip title={`Difficulty: ${difficulty || 'N/A'}`}>
        <IconWrapper level={difficultyLevel / 4}>
          <TrophyFilled />
        </IconWrapper>
      </Tooltip>
      {importance !== undefined && 
      <Tooltip title={`Importance: ${importance || 'N/A'}`}>
        <div>
          {[...Array(5)].map((_, index) => (
            <StarFilled key={index} style={{ color: index < importanceLevel ? '#fadb14' : '#898989' }} />
          ))}
        </div>
      </Tooltip>
      }
      {familiarityValue !== undefined && (
        <Tooltip title={`Familiarity: ${familiarityValue || 'N/A'}`}>
          <div style={{ width: '100px' }}> {/* 设置宽度以保持一致性 */}
            <Progress 
              percent={(familiarityValue / 100) * 100} // 假设 familiarity 的最大值为 100
              strokeColor="#52c41a" 
              showInfo={false} 
              size="small" 
            />
          </div>
        </Tooltip>
      )}
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

import React from 'react';
import { Typography, Tooltip, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Text } = Typography;

interface CopyableIDProps {
  id: string;
  maxWidth?: number;
  showBackground?: boolean;
  style?: React.CSSProperties;
  tooltipTitle?: string;
}

const CopyableGroup = styled.div<{ showBackground: boolean }>`
  display: flex;
  align-items: center;
  background-color: ${props => props.showBackground ? '#f0f2f5' : 'transparent'};
  border-radius: 4px;
  padding: ${props => props.showBackground ? '2px 8px' : '0'};
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.showBackground ? '#e6f7ff' : 'transparent'};
  }
`;

const CopyableText = styled(Text)`
  margin-right: 4px;
`;

const CopyIcon = styled(CopyOutlined)`
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s;

  ${CopyableGroup}:hover & {
    opacity: 1;
  }
`;

const CopyableID: React.FC<CopyableIDProps> = ({
  id,
  maxWidth = 200,
  showBackground = true,
  style,
  tooltipTitle = "点击复制 ID"
}) => {
  const copyToClipboard = (event: React.MouseEvent) => {
    event.stopPropagation(); // 防止事件冒泡
    
    navigator.clipboard.writeText(id).then(() => {
      message.success('已复制到剪贴板');
    }, () => {
      message.error('复制失败');
    });
  };

  return (
    <Tooltip title={<>
      <div>{id}</div>
      <div>{tooltipTitle}</div>
    </>} mouseEnterDelay={0.5}>
      <CopyableGroup onClick={copyToClipboard} showBackground={showBackground} style={style}>
        <CopyableText ellipsis={{ tooltip: false }} style={{ maxWidth }}>
          {id}
        </CopyableText>
        <CopyIcon />
      </CopyableGroup>
    </Tooltip>
  );
};

export default CopyableID;
import React from 'react';
import styled from 'styled-components';
import { useUserPoints } from '../../context/UserPointsContext';
import CDNImage from './CDNImage';

// 导入图标路径
import goldIcon from '../../assets/icons/gold_icon.png';
import gemIcon from '../../assets/icons/gem_icon.png';
import vipIcon from '../../assets/icons/vip_icon.png';

interface PointsContainerProps {
  $inline?: boolean;  // 注意这里的 $ 前缀
}

const PointsContainer = styled.div<PointsContainerProps>`
  display: flex;
  align-items: center;
  justify-content: space-around;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  flex-direction: ${props => props.$inline ? 'row' : 'column'};
`;

interface PointItemProps {
  $inline?: boolean;  // 注意这里的 $ 前缀
}

const PointItem = styled.div<PointItemProps>`
  display: flex;
  flex-direction: ${props => props.$inline ? 'row' : 'column'};
  align-items: center;
  margin: ${props => props.$inline ? '0 8px' : '4px 0'};
`;

const PointIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 4px;
`;

interface TextProps {
  $bold?: boolean;  // 注意这里的 $ 前缀
}

const PointName = styled.span<TextProps>`
  font-size: 0.875rem;
  margin-right: 4px;
  font-weight: ${props => props.$bold ? 'bold' : 'normal'};
`;

const PointValue = styled.span<TextProps>`
  font-size: 1rem;
  font-weight: ${props => props.$bold ? 'bold' : 'normal'};
`;

const IconImage = styled(CDNImage)<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;

interface PointItemData {
  icon?: React.ReactNode;
  iconSrc?: string;
  alt: string;
  name: string;
}

interface PointsProps {
  showName?: boolean;
  className?: string;
  style?: React.CSSProperties;
  pointItems?: PointItemData[];
  iconSize?: number;
  inline?: boolean;
  bold?: boolean;
}

const defaultIconSize = 16; // 默认图标尺寸

const defaultPointItems: PointItemData[] = [
  { iconSrc: goldIcon, alt: "Cash", name: "Cash" },
  { iconSrc: gemIcon, alt: "Gem", name: "Gem" },
  { iconSrc: vipIcon, alt: "VIP Score", name: "VIP" },
];

const PointsBar: React.FC<PointsProps> = ({ 
  showName = true, 
  className, 
  style, 
  pointItems = defaultPointItems,
  iconSize = defaultIconSize,
  inline = true,
  bold = false
}) => {
  const { points, loading, error } = useUserPoints();

  if (loading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  return (
    <PointsContainer className={className} style={style} $inline={inline}>
      {pointItems.map((item, index) => (
        <PointItem key={index} className="point-item" $inline={inline}>
          <PointIcon className="point-icon">
            {item.icon ? (
              item.icon
            ) : item.iconSrc ? (
              <IconImage src={item.iconSrc} alt={item.alt} size={iconSize} />
            ) : null}
          </PointIcon>
          {showName && <PointName className="point-name" $bold={bold}>{item.name}</PointName>}
          <PointValue className="point-value" $bold={bold}>{points?.[item.alt.toLowerCase() as keyof typeof points] ?? '--'}</PointValue>
        </PointItem>
      ))}
    </PointsContainer>
  );
};

export default PointsBar;
import React from 'react';
import styled from 'styled-components';
import { useUserPoints } from '../../context/UserPointsContext';

import goldIcon from '../../assets/icons/gold_icon.png';
import gemIcon from '../../assets/icons/gem_icon.png';
import vipIcon from '../../assets/icons/vip_icon.png';

const PointsContainer = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  gap: 0.5rem;
`;

const PointItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PointIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const PointValue = styled.span`
  font-size: 0.875rem;
`;

interface PointsProps {
  showName?: boolean;
  style?: React.CSSProperties;
}

const PointsBar: React.FC<PointsProps> = ({ showName = true, style }) => {
  const { points, loading, error } = useUserPoints();

  if (loading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  const pointItems = [
    { icon: goldIcon, alt: "Cash", value: points?.cash, name: "Cash" },
    { icon: gemIcon, alt: "Gem", value: points?.gem, name: "Gem" },
    { icon: vipIcon, alt: "VIP Score", value: points?.vip_score, name: "VIP" },
  ];

  return (
    <PointsContainer style={style}>
      {pointItems.map((item, index) => (
        <PointItem key={index}>
          <PointIcon src={item.icon} alt={item.alt} />
          <PointValue>
            {showName ? `${item.name}: ` : ''}{item.value ?? '--'}
          </PointValue>
        </PointItem>
      ))}
    </PointsContainer>
  );
};

export default PointsBar;
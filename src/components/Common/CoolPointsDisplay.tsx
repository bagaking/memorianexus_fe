import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { GoldOutlined, DollarOutlined, TrophyOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useUserPoints } from '../../context/UserPointsContext';

const StyledCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
`;

const StyledStatistic = styled(Statistic)`
  .ant-statistic-title {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
  }
  .ant-statistic-content {
    color: white;
    font-size: 1.5rem;
  }
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
`;

const CoolPointsDisplay: React.FC = () => {
  const { points, loading, error } = useUserPoints();

  if (loading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  return (
    <StyledCard>
      <Row gutter={16} justify="space-around" align="middle">
        <Col span={8}>
          <IconWrapper><GoldOutlined /></IconWrapper>
          <StyledStatistic title="Cash" value={points?.cash ?? '--'} />
        </Col>
        <Col span={8}>
          <IconWrapper><DollarOutlined /></IconWrapper>
          <StyledStatistic title="Gem" value={points?.gem ?? '--'} />
        </Col>
        <Col span={8}>
          <IconWrapper><TrophyOutlined /></IconWrapper>
          <StyledStatistic title="VIP Score" value={points?.vip_score ?? '--'} />
        </Col>
      </Row>
    </StyledCard>
  );
};

export default CoolPointsDisplay;
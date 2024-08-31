import React from 'react';
import { Card, Row, Col } from 'antd';
import styled from 'styled-components';
import PointsBar from './PointsBar';
import { GoldOutlined, DollarOutlined, TrophyOutlined } from '@ant-design/icons';

const StyledCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
`;

const StyledPointsBar = styled(PointsBar)`
  .point-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
  }

  .point-icon {
    font-size: 2rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 0.5rem;
  }

  .point-name {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
  }

  .point-value {
    color: white;
    font-size: 1.5rem;
  }
`;

const pointItems = [
    { icon: <GoldOutlined />, alt: "Cash", name: "Cash" },
    { icon: <DollarOutlined />, alt: "Gem", name: "Gem" },
    { icon: <TrophyOutlined />, alt: "VIP Score",  name: "VIP" },
  ];

const CoolPointsDisplay: React.FC = () => {
  return (
    <StyledCard>
      <Row justify="space-around" align="middle">
        <Col span={24}>
          <StyledPointsBar showName={true} pointItems={pointItems} />
        </Col>
      </Row>
    </StyledCard>
  );
};

export default CoolPointsDisplay;
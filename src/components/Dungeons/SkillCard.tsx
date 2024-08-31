import React from 'react';
import { Card } from 'antd';
import './SkillCard.less';

interface SkillCardProps {
    icon: React.ReactNode;
    onClick: () => void;
    title: string;
    backgroundImage: string;
    resultType: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ icon, onClick, title, backgroundImage, resultType }) => {
    return (
        <Card
            className={`skill-card ${resultType}`}
            onClick={onClick}
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="skill-icon">{icon}</div>
            {title && <div className="skill-title">{title}</div>}
        </Card>
    );
};

export default SkillCard;
import React from 'react';
import { Card } from 'antd';
import { ReactNode } from 'react';

interface SkillCardProps {
    icon: ReactNode;
    onClick: () => void;
    resultType: "defeat" | "miss" | "hit" | "kill" | "complete";
    title: string;
    backgroundImage: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ icon, onClick, resultType, title, backgroundImage }) => {
    return (
        <div
            className={`skill-card skill-card-${resultType}`}
            onClick={onClick}
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="skill-card-content">
                {icon}
                <div className="skill-card-title">{title}</div>
            </div>
        </div>
    );
};

export default SkillCard;
import React from 'react';
import { Card, Button } from 'antd';
import { CardProps } from 'antd/lib/card';
import { ButtonProps } from 'antd/lib/button';
import './SkillCard.css';

interface SkillCardProps extends CardProps {
    icon: React.ReactNode;
    buttonProps?: ButtonProps;
    title: string;
    resultType?: "defeat" | "miss" | "hit" | "kill" | "complete";
    onClick: () => void; // 添加 onClick 属性
}

const SkillCard: React.FC<SkillCardProps> = ({ icon, buttonProps, title, resultType, onClick, ...cardProps }) => {
    return (
        <Card className={["skill-card", (resultType || "default")].join(" ")} {...cardProps} onClick={onClick}>
            <div className="skill-card-content">
                <div className="skill-card-icon">{icon}</div>
                <div className="skill-card-title">{title}</div>
            </div>
            <Button className="skill-card-button" {...(buttonProps || {})} />
        </Card>
    );
};

export default SkillCard;
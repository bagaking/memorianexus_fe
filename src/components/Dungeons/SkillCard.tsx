import React, {useEffect} from 'react';
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

    const calculateCardScaleRate = () => {
        const rate = window.innerWidth / 1920
        const minScale = 0.5;
        const maxScale = 1;

        // const scaleRate = minScale + (cardWidth - minWidth) * (maxScale - minScale) / (maxWidth - minWidth);
        const realRate = Math.min(Math.max(rate, minScale), maxScale);
        // console.log("realRate", realRate)
        return realRate
    };

    const setCardScaleRate = () => {
        const scaleRate = calculateCardScaleRate();
        document.documentElement.style.setProperty('--card-scale-rate', scaleRate.toString());
    };

    useEffect(() => {
        setCardScaleRate();
        window.addEventListener('resize', setCardScaleRate);
        return () => {
            window.removeEventListener('resize', setCardScaleRate);
        };
    }, []);

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
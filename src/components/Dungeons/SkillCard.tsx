import React from 'react';
import { useIsMobile } from '../../hooks/useWindowSize';
import './SkillCard.less';

interface SkillCardProps {
    icon: React.ReactNode;
    title: string;
    resultType: string;
    onClick: () => void;
    backgroundImage: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ icon, title, resultType, onClick, backgroundImage }) => {
    const isMobile = useIsMobile();

    return (
        <div 
            className={`skill-card ${resultType} ${isMobile ? 'mobile' : ''}`} 
            onClick={onClick}
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="skill-card-content">
                <div className="skill-card-icon">{icon}</div>
                {!isMobile && <div className="skill-card-title">{title}</div>}
            </div>
        </div>
    );
};

export default SkillCard;
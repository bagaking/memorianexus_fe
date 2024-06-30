// src/components/Common/Points.tsx
import React from 'react';
import gemIcon from '../../assets/icons/gem_icon.png';
import goldIcon from '../../assets/icons/gold_icon.png';
import vipIcon from '../../assets/icons/vip_icon.png';
import './Points.css';

interface PointsProps {
    cash: number;
    gem: number;
    vipScore: number;
    style?: any;
    showName?: boolean;
}

const Points: React.FC<PointsProps> = ({ cash, gem, vipScore, style, showName = false }) => {
    return (
        <div className="points-container" style={style}>
            <div className="point-item" >
                <img src={goldIcon} alt="Cash" className="point-icon" />
                <span>{(showName ? "Cash:" : "") + cash}</span>
            </div>
            <div className="point-item">
                <img src={gemIcon} alt="Gem" className="point-icon" />
                <span>{(showName ? "Gem:" : "") +gem}</span>
            </div>
            <div className="point-item">
                <img src={vipIcon} alt="VIP Score" className="point-icon" />
                <span>{(showName ? "Vip:" : "") +vipScore}</span>
            </div>
        </div>
    );
};

export default Points;
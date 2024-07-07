// src/components/Common/Points.tsx
import React from 'react';
import goldIcon from '../../assets/icons/gold_icon.png';
import gemIcon from '../../assets/icons/gem_icon.png';
import vipIcon from '../../assets/icons/vip_icon.png';
import './PointsBar.css';
import {useUserPoints} from "../../context/UserPointsContext";

interface PointsProps {
    style?: any;
    showName?: boolean;
}

const PointsBar: React.FC<PointsProps> = (
    { style, showName = false}
) => {
    const { points, loading, error } = useUserPoints();
    return (
        <div className="points-container" style={style}>
            <div className="point-item" >
                <img src={goldIcon} alt="Cash" className="point-icon" />
                <span>{(showName ? "Cash:" : "") + points?.cash}</span>
            </div>
            <div className="point-item">
                <img src={gemIcon} alt="Gem" className="point-icon" />
                <span>{(showName ? "Gem:" : "") + points?.gem}</span>
            </div>
            <div className="point-item">
                <img src={vipIcon} alt="VIP Score" className="point-icon" />
                <span>{(showName ? "Vip:" : "") + points?.vip_score}</span>
            </div>
        </div>
    );
};

export default PointsBar;
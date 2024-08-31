import React from 'react';
import './MonsterHealthBar.less';

interface MonsterHealthBarProps {
    health: number;
}

const MonsterHealthBar: React.FC<MonsterHealthBarProps> = ({ health }) => {
    return (
        <div className="monster-health-bar">
            <div className="health-bar-fill" style={{ width: `${health}%` }}></div>
            <div className="health-bar-text">{`${Math.round(health)}%`}</div>
        </div>
    );
};

export default MonsterHealthBar;
import React from 'react';
import './MonsterHealthBar.less';

interface MonsterHealthBarProps {
    health: number;
    fillClassName?: string;
}

const MonsterHealthBar: React.FC<MonsterHealthBarProps> = ({ health, fillClassName}) => {
    return (
        <div className={`monster-health-bar`}>
            <div className={`health-bar-fill ${fillClassName}`} style={{ width: `${health}%` }}></div>
            <div className="health-bar-text">{`${Math.round(health)}%`}</div>
        </div>
    );
};

export default MonsterHealthBar;
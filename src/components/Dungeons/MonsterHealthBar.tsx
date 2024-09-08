import React, { ReactNode } from 'react';
import './MonsterHealthBar.less';

interface MonsterHealthBarProps {
    health: number;
    fillClassName?: string;
    children?: ReactNode;
}

const MonsterHealthBar: React.FC<MonsterHealthBarProps> = ({ health, fillClassName, children }) => {
    return (
        <div className="monster-health-bar-container">
            {children && <div className="monster-health-bar-prefix">{children}</div>}
            <div className="monster-health-bar">
                <div className={`health-bar-fill ${fillClassName || ''}`} style={{ width: `${health}%` }}></div>
                <div className="health-bar-text">{`${Math.round(health)}%`}</div>
            </div>
        </div>
    );
};

export default MonsterHealthBar;
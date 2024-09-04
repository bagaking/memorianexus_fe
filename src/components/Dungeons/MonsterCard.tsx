import React from 'react';
import { Card } from 'antd';
import { Link } from "react-router-dom";
import { DungeonMonster } from "../../api/_dto";

interface MonsterCardProps {
    monster: DungeonMonster;
    onClick?: () => void;
    selected?: boolean;
}

const MonsterCard: React.FC<MonsterCardProps> = ({ monster, onClick, selected }) => {
    return (
        <Card
            className={`monster-card ${selected ? 'selected' : ''}`}
            onClick={onClick}
            cover={
                <img
                    alt={monster.item_id}
                    src={monster.avatar || "/portraits/skeleton_warrior_01.png"}
                />
            }
        >
            <div className="monster-info">
                <Link to={`/Items/${monster.item_id}`} target="_blank" className="monster-id">{monster.item_id}</Link>
                <div className="monster-stats">
                    <span>D:{monster.difficulty}</span>
                    <span>I:{monster.importance}</span>
                    <span>F:{monster.familiarity}</span>
                </div>
            </div>
        </Card>
    );
};

export default MonsterCard;
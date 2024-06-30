// ItemCard.tsx
import React from 'react';
import {Avatar, Card} from 'antd';
import Meta from "antd/es/card/Meta";
import {Link} from "react-router-dom";

import {DungeonMonster} from "../Basic/dto";
import "./MonsterCard.css"

interface MonsterCardProps {
    monster: DungeonMonster;
    onClick?: () => void;
    selected?: boolean;
}

const MonsterCard: React.FC<MonsterCardProps> = ({ monster, onClick, selected }) => {


    return (
        // <Tooltip title={()=><Markdown>{monster.avatar}</Markdown>}>
            <Card size="small"
                cover={
                    <img
                        alt={monster.item_id}
                        src={monster.avatar || "/portraits/skeleton_warrior_01.png"}
                    />
                }
                className={`monster-card ${selected ? 'selected' : ''}`} onClick={onClick} >
                <Meta
                    // avatar={<Avatar src="monster.avatar" />}
                    description={<Link to={`/Items/${monster.item_id}`} target="_blank">{monster.item_id}</Link>}
                />
                <div className="monster-preview-container">
                    <li>{`Difficulty: ${monster.difficulty}`}</li>
                    <li>{`Importance: ${monster.importance}`}</li>
                    <li>{`Familiarity: ${monster.familiarity}`}</li>
                    {/*<Markdown className="monster-card-content" ></Markdown>*/}
                    {/*<Markdown className="monster-card-content" >{`Difficulty: ${monster.difficulty}`}</Markdown>*/}
                </div>

            </Card>
        // </Tooltip>
    );
};

export default MonsterCard;
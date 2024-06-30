// ItemCard.tsx
import React from 'react';
import {Card, Tooltip} from 'antd';
import Markdown from "react-markdown";
import "./ItemCard.css";
import Meta from "antd/es/card/Meta";
import {Link} from "react-router-dom";
import {Item} from "./dto";

interface ItemCardProps {
    item: Item;
    onClick?: () => void;
    selected?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, selected }) => {
    return (
        <Tooltip title={()=><Markdown>{item.content}</Markdown>}>
            <Card className={`item-card ${selected ? 'selected' : ''}`} onClick={onClick} >
                <Meta
                    // avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                    description={<Link to={`/items/${item.id}`} target="_blank">{item.id}</Link>}
                />
                <div className="item-preview-container">
                    <Markdown className="item-card-content" >{item.content}</Markdown>
                </div>

            </Card>
        </Tooltip>
    );
};

export default ItemCard;
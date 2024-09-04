import React from 'react';
import { useParams } from 'react-router-dom';
import { Avatar } from 'antd';
import { PageLayout } from '../Layout/PageLayout';
import {DungeonMonster} from "../../api/_dto";
import EmbedItemPack from "../Basic/EmbedItemPack";
import {addDungeonItems, getItems, getCampaignMonsters, removeDungeonItems} from "../../api";
import MonsterCard from "./MonsterCard";
import '../Common/CommonStyles.css';

const DungeonMonsters: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const fetchItems = async (page: number, limit: number = 10) => {

        const response = await getCampaignMonsters(id!, page, limit);
        // for (let i = 0; i < response.data.data.length; i ++ ){
        //     if(!response.data.data[i].id) {
        //         response.data.data[i].id = response.data.data[i].item_id
        //     }
        // }
        return {
            entities: response.data.data,
            total: response.data.total,
            offset: response.data.offset,
            limit: response.data.limit,
            error: response.data.error,
        };
    };

    const fetchItemsToAdd = async (page: number, limit: number, search?: string) => {

        const response = await getItems({page, limit, search});
        return {
            entities: response.data.data,
            total: response.data.total,
            offset: response.data.offset,
            limit: response.data.limit,
        };
    };

    const addItems = async (itemIds: string[]) => {
        await addDungeonItems(id!, itemIds);
    };

    const deleteItems = async (itemIds: string[]) => {
        await removeDungeonItems(id!, itemIds);
    };

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text: string) => <Avatar src={text || "/portraits/skeleton_warrior_01.png"} />
        },
        {
            title: 'Item ID',
            dataIndex: 'item_id',
            key: 'item_id',
        },
        {
            title: 'Source Type',
            dataIndex: 'source_type',
            key: 'source_type',
        },
        {
            title: 'Practice Count',
            dataIndex: 'practice_count',
            key: 'practice_count',
        },
        {
            title: 'Visibility',
            dataIndex: 'visibility',
            key: 'visibility',
        },
        {
            title: 'Familiarity',
            dataIndex: 'familiarity',
            key: 'familiarity',
        },
        {
            title: 'Difficulty',
            dataIndex: 'difficulty',
            key: 'difficulty',
        },
        {
            title: 'Importance',
            dataIndex: 'importance',
            key: 'importance',
        },
        {
            title: 'Practice At',
            dataIndex: 'practice_at',
            key: 'practice_at',
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
        },
    ];

    return (
        <PageLayout title="Campaign Monsters" 
            // backUrl={`/campaigns`} 
            icon="/layout/campaign_dungeon_icon.png">

            <EmbedItemPack<DungeonMonster>
                fetchItems={fetchItems}

                fetchItemsToAdd={fetchItemsToAdd}
                enableSearchWhenAdd={true}
                addItems={addItems}

                deleteItems={deleteItems}
                itemsColumns={columns}
                renderItem={(monster, selected, onSelect) => <MonsterCard
                    monster={monster}
                    onClick={onSelect}
                    selected={selected}
                />}
                rowKey="item_id"
            />
        </PageLayout>
    );
};

export default DungeonMonsters;
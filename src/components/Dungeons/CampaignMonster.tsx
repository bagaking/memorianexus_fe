import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, message, Avatar } from 'antd';
import { getCampaignMonsters } from '../../api/campaigns';
import { PageLayout } from '../Layout/PageLayout';
import '../Common/CommonStyles.css';
import {DungeonMonster} from "../Common/dto";


const DungeonMonsters: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [monsters, setMonsters] = useState<DungeonMonster[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMonsters = async () => {
            try {
                const response = await getCampaignMonsters(id!);
                setMonsters(response.data.data);
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch monsters');
            } finally {
                setLoading(false);
            }
        };

        fetchMonsters();
    }, [id]);

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text: string) => <Avatar src={text} />
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
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
        },
    ];

    return (
        <PageLayout title="Campaign Monsters" backUrl={`/campaigns/${id}`} icon="/campaign_dungeon_icon.png">
            <Table
                columns={columns}
                dataSource={monsters}
                rowKey="item_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </PageLayout>
    );
};

export default DungeonMonsters;
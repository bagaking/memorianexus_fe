import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Card, message, Spin} from 'antd';
import { getDungeonDetail } from '../../api/dungeons';

interface Dungeon {
    id: string;
    title: string;
    description: string;
}

const DungeonDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [dungeon, setDungeon] = useState<Dungeon | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDungeon = async () => {
            try {
                const response = await getDungeonDetail(Number(id));
                setDungeon(response.data.data);
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch dungeon details');
            } finally {
                setLoading(false);
            }
        };

        fetchDungeon();
    }, [id]);

    if (loading) {
        return <Spin />;
    }

    if (!dungeon) {
        return <div>Dungeon not found</div>;
    }

    return (
        <Card title={dungeon.title}>
            <p>{dungeon.description}</p>
        </Card>
    );
};

export default DungeonDetail;
import React, { useEffect, useState } from 'react';
import {List, message} from 'antd';
import { getDungeons } from '../../api/dungeons';

interface Dungeon {
    id: string;
    title: string;
    description: string;
}

const DungeonList: React.FC = () => {
    const [dungeons, setDungeons] = useState<Dungeon[]>([]);

    useEffect(() => {
        const fetchDungeons = async () => {
            try {
                const response = await getDungeons();
                setDungeons(response.data.data);
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch dungeons');
            }
        };

        fetchDungeons();
    }, []);

    return (
        <div>
            <h2>Dungeons</h2>
            <List
                itemLayout="horizontal"
                dataSource={dungeons}
                renderItem={dungeon => (
                    <List.Item>
                        <List.Item.Meta
                            title={<a href={`/dungeons/${dungeon.id}`}>{dungeon.title}</a>}
                            description={dungeon.description}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default DungeonList;
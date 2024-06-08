import React, { useEffect, useState } from 'react';
import { List, message, Button, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { getDungeons, deleteDungeon } from '../../api/dungeons';

interface Dungeon {
    id: string;
    title: string;
    description: string;
}

const CampaignList: React.FC = () => {
    const [dungeons, setDungeons] = useState<Dungeon[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [dungeonToDelete, setDungeonToDelete] = useState<Dungeon | null>(null);

    const fetchDungeons = async () => {
        try {
            const response = await getDungeons();
            setDungeons(response.data.data);
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch dungeons');
        }
    };

    useEffect(() => {
        fetchDungeons();
    }, []);

    const showDeleteModal = (dungeon: Dungeon) => {
        setDungeonToDelete(dungeon);
        setDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        if (dungeonToDelete) {
            try {
                await deleteDungeon(dungeonToDelete.id);
                message.success('Dungeon deleted successfully');
                fetchDungeons();
            } catch (error) {
                console.error(error);
                message.error('Failed to delete dungeon');
            } finally {
                setDeleteModalVisible(false);
                setDungeonToDelete(null);
            }
        }
    };

    return (
        <div>
            <h2>Campaigns</h2>
            <Link to="/campaigns/new"><Button type="primary" style={{ marginBottom: '16px', width: '100%' }}>
                Create New Campaign Dungeon
            </Button></Link>
            <List
                itemLayout="horizontal"
                dataSource={dungeons}
                renderItem={dungeon => (
                    <List.Item
                        actions={[
                            <Link to={`/campaigns/${dungeon.id}`} key="edit">Edit</Link>,
                            <Button type="link" danger onClick={() => showDeleteModal(dungeon)} key="delete">Delete</Button>,
                        ]}
                    >
                    <List.Item.Meta
                        title={<Link to={`/campaigns/${dungeon.id}`}>{dungeon.title}</Link>}
                        description={dungeon.description}
                    />
                    </List.Item>
                )}
            />
            <Modal
                title="Confirm Deletion"
                visible={deleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setDeleteModalVisible(false)}
            >
                <p>Are you sure you want to delete this dungeon?</p>
            </Modal>

        </div>
    );
};

export default CampaignList;
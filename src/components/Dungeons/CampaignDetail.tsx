import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {Form, Input, message, Button, Table, Avatar} from 'antd';
import { Dungeon, getDungeonDetail, updateDungeon, deleteDungeon, createCampaign, getDungeonItemsId, addDungeonItems, removeDungeonItems } from '../../api/dungeons';
import { PageLayout } from '../Layout/PageLayout';
import { TitleField, MarkdownField } from '../Common/FormFields';
import { ActionButtons } from '../Common/ActionButtons';
import { DeleteModal } from '../Common/DeleteModal';
import { EditableTagField } from '../Common/EditableTagGroup';
import AppendEntitiesModal from '../Common/AppendEntitiesModal';
import '../Common/CommonStyles.css';
import './CampaignDetail.css';
import {getItems} from "../../api/items";
import {DungeonMonster} from "../Common/dto";

const CampaignDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [dungeon, setDungeon] = useState<Dungeon | null>(null);
    const [items, setItems] = useState<DungeonMonster[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [addEntitiesModalVisible, setAddEntitiesModalVisible] = useState(false);

    useEffect(() => {
        const fetchDungeon = async () => {
            try {
                if (id && id !== "new") {
                    const response = await getDungeonDetail(id);
                    const data = response.data.data;
                    setDungeon(data);
                    form.setFieldsValue(data);

                    // 获取 campaign items
                    const itemIDsResponse = await getDungeonItemsId(id);
                    setItems(itemIDsResponse.data.data);
                } else {
                    setDungeon({
                        id: '',
                        title: '',
                        description: '',
                        rule: ''
                    });
                }
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch campaign details');
            }
        };

        fetchDungeon();
    }, [id, form]);

    const handleSubmit = async (values: Dungeon) => {
        try {
            if (id && id !== "new") {
                await updateDungeon(id, values);
                message.success('Campaign updated successfully');
            } else {
                await createCampaign(values);
                message.success('Campaign created successfully');
            }
            navigate('/campaigns');
        } catch (error) {
            console.error(error);
            message.error(`Failed to ${id && id !== "new" ? 'update' : 'create'} campaign`);
        }
    };

    const showDeleteModal = () => {
        setDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            if (id) {
                await deleteDungeon(id);
                message.success('Campaign deleted successfully');
                navigate('/campaigns');
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to delete campaign');
        } finally {
            setDeleteModalVisible(false);
        }
    };

    const handleItemDelete = async (itemIds: string[]) => {
        try {
            await removeDungeonItems(id!, itemIds);
            message.success('Items deleted successfully');
            setItems(items.filter(item => !itemIds.includes(item.item_id)));
        } catch (error) {
            console.error(error);
            message.error('Failed to delete items');
        }
    };

    const handleAddEntitiesSubmit = async (entityIds: string[]) => {
        try {
            await addDungeonItems(id!, entityIds);
            message.success('Items added successfully');
            const itemsResponse = await getDungeonItemsId(id!);
            setItems(itemsResponse.data.data);
            setAddEntitiesModalVisible(false);
        } catch (error) {
            console.error(error);
            message.error('Failed to add items');
        }
    };

    const fetchEntities = async (page: number) => {
        // 假设我们有一个 API 可以分页获取 items
        const response = await getItems({ page, limit: 10 });
        return {
            entities: response.data?.data,
            total: response.data.total,
        };
    };

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
            title: 'Practice At',
            dataIndex: 'practice_at',
            key: 'practice_at',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: DungeonMonster) => (
                <>
                    <Button type="link" size="small" danger onClick={() => handleItemDelete([record.item_id])}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    if (!dungeon) {
        return <div>Loading...</div>;
    }

    return (
        <PageLayout title={(id && id !== 'new') ? `Edit Campaign (id: ${id})` : 'Create Campaign'} backUrl="/campaigns" icon="/campaign_dungeon_icon.png">

            <Button type="primary" onClick={() => navigate(`/campaigns/${id}/monsters`)}>View Monsters</Button>

            <Form form={form} onFinish={handleSubmit} className="campaign-detail-content">
                <TitleField />
                <MarkdownField name="description" placeholder="Description" rules={[{ required: true, message: 'Please enter the description!' }]} />
                <EditableTagField name="tags" />
                <Form.Item name="book_ids">
                    <Input placeholder="Books (comma separated)" />
                </Form.Item>
                <ActionButtons isEditMode={!!id && id !== 'new'} onDelete={showDeleteModal} />
            </Form>

            <DeleteModal visible={deleteModalVisible} onConfirm={handleDelete} onCancel={() => setDeleteModalVisible(false)} />

            <div className="campaign-items-container">
                <h2>Campaign Items</h2>
                <Table className="min-height-table" columns={columns} dataSource={items} rowKey="item_id"/>
                <Button type="primary" onClick={() => setAddEntitiesModalVisible(true)}>Add Items</Button>
            </div>

            <AppendEntitiesModal
                visible={addEntitiesModalVisible}
                onCancel={() => setAddEntitiesModalVisible(false)}
                onSubmit={handleAddEntitiesSubmit}
                fetchEntities={fetchEntities}
            />
        </PageLayout>
    );
};

export default CampaignDetail;
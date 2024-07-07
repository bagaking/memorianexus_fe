import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, message, Button, Table, Avatar, Card, Progress, Select } from 'antd';
import { Dungeon, getDungeonDetail, updateDungeon, deleteDungeon, createCampaign, getDungeonItemsId, addDungeonItems, removeDungeonItems } from '../../api/dungeons';
import { PageLayout } from '../Layout/PageLayout';
import { TitleField, MarkdownField } from '../Common/FormFields';
import { ActionButtons } from '../Common/ActionButtons';
import { DeleteModal } from '../Common/DeleteModal';
import { EditableTagField } from '../Common/EditableTagGroup';
import { getItems } from "../../api/items";
import { DungeonMonster } from "../Basic/dto";
import { getBookItems, getTagItems } from "../../api/books";
import AppendEntitiesModal from '../Common/AppendEntitiesModal';

import '../Common/CommonStyles.css';
import './CampaignDetail.css';

const { Option } = Select;

const CampaignDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [dungeon, setDungeon] = useState<Dungeon | null>(null);
    const [items, setItems] = useState<DungeonMonster[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [addEntitiesModalVisible, setAddEntitiesModalVisible] = useState(false);
    const [importType, setImportType] = useState<'book' | 'tag' | null>(null);
    const [importValue, setImportValue] = useState<string | null>(null);

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

    const fetchEntities = async (page: number, limit:number = 10, search:string = "") => {
        // 根据 importType 和 importValue 来获取 items
        let response;
        if (!!importValue) {
            if (importType === 'book') {
                response = await getBookItems({ page, limit, search, bookId: importValue });
            } else if (importType === 'tag') {
                response = await getTagItems({ page, limit, search, tag: importValue });
            }
        } else {
            response = await getItems({ page, limit, search });
        }
        if (!response || !response.data) {
            return {
                entities: [],
                total: 0,
                offset: 0,
                limit: limit,
            }
        }
        const data = response.data;
        return {
            entities: data.data,
            total: data.total,
            offset: data.offset,
            limit: data.limit,
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

            <div className="campaign-progress">
                <h3>Campaign Progress</h3>
                <Button type="primary" onClick={() => navigate(`/campaigns/${id}/monsters`)}>View Monsters</Button>
                <Progress percent={50} status="active"/>
            </div>

            <Card className="campaign-detail-card">
                <Form form={form} onFinish={handleSubmit} className="campaign-detail-content">
                    <TitleField/>
                    <MarkdownField name="description" placeholder="Description"
                                   rules={[{required: true, message: 'Please enter the description!'}]}/>

                    <ActionButtons isEditMode={!!id && id !== 'new'} onDelete={showDeleteModal}/>
                    {/*下边这俩还有必要吗?*/}
                    <EditableTagField name="tags"/>
                    <Form.Item name="book_ids">
                        <Input placeholder="Books (comma separated)"/>
                    </Form.Item>

                </Form>

                <DeleteModal visible={deleteModalVisible} onConfirm={handleDelete} onCancel={() => setDeleteModalVisible(false)}/>

                {(id && id !== 'new') ?

                <div className="campaign-items-container">
                    <h2>Campaign Items</h2>
                    <Table className="min-height-table" style={{marginBottom:"16px"}} columns={columns} dataSource={items} rowKey="item_id"/>
                    <Button type="primary" onClick={() => setAddEntitiesModalVisible(true)}>Add Items</Button>
                    <span style={{margin:"10px"}}>OR</span>
                    <Button
                        type="primary"
                        onClick={() => setAddEntitiesModalVisible(true)}
                        disabled={!importValue}
                        style={{ marginLeft: 8 }}
                    >
                        Import from {importType}
                    </Button>
                    <Select placeholder="Import Type" style={{ width: 120, marginLeft: 8 }} onChange={value => setImportType(value)}>
                        <Option value="book">Book</Option>
                        <Option value="tag">Tag</Option>
                    </Select>
                    {importType && (
                        <Input
                            placeholder={`Enter ${importType} ID`}
                            style={{ width: 200, marginLeft: 8 }}
                            onChange={e => setImportValue(e.target.value)}
                        />
                    )}

                </div> : <span style={{marginTop:"16px", paddingTop:"16px", color: "gray"}}>Item's can only be add to exist campaign</span> }

                <AppendEntitiesModal
                    visible={addEntitiesModalVisible}
                    onCancel={() => setAddEntitiesModalVisible(false)}
                    onSubmit={handleAddEntitiesSubmit}
                    fetchEntities={fetchEntities}
                    abortedItems={
                        items.map(monster => ({ id: monster.item_id, content: monster.description}))
                    }
                    enableSearch={false}
                />
            </Card>

        </PageLayout>
    );
};

export default CampaignDetail;
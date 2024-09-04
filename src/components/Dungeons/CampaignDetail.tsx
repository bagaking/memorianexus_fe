import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, message, Button, Avatar, Card, Progress, Select, Row, Col } from 'antd';
import { Dungeon, getDungeonDetail, updateDungeon, deleteDungeon, createCampaign, getDungeonItemsId, addDungeonItems, removeDungeonItems, DEFAULT_DUNGEON } from '../../api';
import { PageLayout } from '../Layout/PageLayout';
import { TitleField, MarkdownField } from '../Common/FormFields';
import { ActionButtons } from '../Common/ActionButtons';
import { DeleteModal } from '../Common/DeleteModal';
import { EditableTagField } from '../Common/EditableTagGroup';
import { getItems } from "../../api/items";
import { DungeonMonster, Item } from "../../api/_dto";
import { getBookItems, getTagItems } from "../../api/books";
import ItemCard from '../Basic/ItemCard';
import EmbedItemPack from '../Basic/EmbedItemPack';

import '../Common/CommonStyles.css';
import './CampaignDetail.less';
import { DifficultyImportance } from '../Basic/ItemComponents';
import { useIsMobile } from '../../hooks/useWindowSize';

const { Option } = Select;

const CampaignDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [dungeon, setDungeon] = useState<Dungeon | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [importType, setImportType] = useState<'book' | 'tag' | null>(null);
    const [importValue, setImportValue] = useState<string>('');

    const isMobile = useIsMobile()

    const fetchItems = useCallback(async (page: number, limit: number) => {
        if (!id || id === "new") return { entities: [], total: 0, offset: 0, limit };
        const response = await getDungeonItemsId(id, { page, limit });
        return {
            entities: response.data.data,
            total: response.data.total,
            offset: response.data.offset,
            limit: response.data.limit
        };
    }, [id]);

    const fetchEntities = useCallback(async (page: number, limit: number = 10, search: string = "") => {
        let response: any;
        if (importType && importValue) {
            if (importType === 'book') {
                response = await getBookItems({ page, limit, search, bookId: importValue });
            } else if (importType === 'tag') {
                response = await getTagItems({ page, limit, search, tag: importValue });
            }
        } else {
            response = await getItems({ page, limit, search });
        }
        return {
            entities: response.data.data,
            total: response.data.total,
            offset: response.data.offset,
            limit: response.data.limit,
        };
    }, [importType, importValue]);

    const handleAddItems = useCallback(async (itemIds: string[]) => {
        if (!id || id === "new") return;
        await addDungeonItems(id, itemIds);
    }, [id]);

    const handleDeleteItems = useCallback(async (itemIds: string[]) => {
        if (!id || id === "new") return;
        await removeDungeonItems(id, itemIds);
    }, [id]);

    const renderItem = useCallback((item: DungeonMonster, selected: boolean, onSelect: () => void) => (
        <ItemCard 
            item={item as unknown as Item} 
            onClick={onSelect} 
            selected={selected} 
            showPreview={true} 
            showActions={false} 
            indentHeadings={false} 
        />
    ), []);

    const itemsColumns = [
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text: string) => <Avatar src={text} />
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Item ID',
            dataIndex: 'item_id',
            key: 'item_id',
        },
        {
            title: 'Difficulty & Importance',
            key: 'difficultyImportance',
            render: (_: any, record: DungeonMonster) => (
                <DifficultyImportance difficulty={record.difficulty} importance={record.importance} />
            ),
        },
        {
            title: 'Practice At',
            dataIndex: 'practice_at',
            key: 'practice_at',
        },
    ];

    const customControlPanel = (
        <div className="import-container">
            <span>Import from:</span>
            <Select 
                placeholder="Import Type" 
                style={{ width: 120 }} 
                onChange={value => setImportType(value)}
                value={importType}
            >
                <Option value="book">Book</Option>
                <Option value="tag">Tag</Option>
            </Select>
            {importType && (
                <Input
                    placeholder={`Enter ${importType} ID`}
                    style={{ width: 200 }}
                    value={importValue}
                    onChange={e => setImportValue(e.target.value)}
                />
            )}
        </div>
    );

    useEffect(() => {
        const fetchDungeon = async () => {
            try {
                if (id && id !== "new") {
                    const response = await getDungeonDetail(id);
                    const data = response.data.data;
                    setDungeon(data);
                    form.setFieldsValue(data);
                } else {
                    let data = DEFAULT_DUNGEON;
                    setDungeon(data);
                    form.setFieldsValue(data);
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

    if (!dungeon) {
        return <div>Loading...</div>;
    }

    return (
        <PageLayout title={(id && id !== 'new') ? `Edit Campaign (id: ${id})` : 'Create Campaign'} backUrl="/campaigns" icon="/layout/campaign_dungeon_icon.png">
            <div className="campaign-progress">
                <h2>Campaign Progress</h2>
                <Progress percent={0} status="active"/>
                {(id && id !== 'new') &&
                <Button className="view-monsters-button" type="link" onClick={() => navigate(`/campaigns/${id}/monsters`)}>
                    <h2>View Monsters</h2>
                </Button>
                }
            </div>

            <Card className="campaign-detail-card">
                <Form form={form} onFinish={handleSubmit} className="campaign-detail-content">
                    <TitleField/>
                    <MarkdownField name="description" placeholder="Description"
                                   rules={[{required: true, message: 'Please enter the description!'}]}/>

                    <Row gutter={16}>
                        <Col span={12}>
                            <EditableTagField name="tags"/>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="book_ids">
                                <Input placeholder="Books (comma separated)"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <ActionButtons isEditMode={!!id && id !== 'new'} onDelete={showDeleteModal}/>
                </Form>

                <DeleteModal visible={deleteModalVisible} onConfirm={handleDelete} onCancel={() => setDeleteModalVisible(false)}/>

                {(id && id !== 'new') ? (
                    <div className="campaign-items-container">
                        <h2>Campaign Items</h2>
                        <EmbedItemPack<DungeonMonster>
                            fetchItems={fetchItems}
                            fetchItemsToAdd={fetchEntities}
                            enableSearchWhenAdd={true}
                            addItems={handleAddItems}
                            deleteItems={handleDeleteItems}
                            itemsColumns={isMobile ? undefined : itemsColumns}
                            renderItem={renderItem}
                            rowKey="item_id"
                            grid={{ gutter: 16, column: 4 }}
                            customControlPanel={customControlPanel}
                        />
                    </div>
                ) : (
                    <span className="items-not-available">- items can only be added to existing campaigns -</span>
                )}
            </Card>
        </PageLayout>
    );
};

export default CampaignDetail;
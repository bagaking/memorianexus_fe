import React, { useEffect, useState } from 'react';
import {Table, message, Button, Switch, List, Space, Card, Tooltip} from 'antd';
import PaginationComponent from '../Common/PaginationComponent';
import FirstLine from "../Common/Firstline";
import AppendEntitiesModal from '../Common/AppendEntitiesModal';
import { Item } from "../Common/dto";
import Markdown from "react-markdown";
import ItemCard from "./ItemCard";

interface ItemListProps {
    fetchItems: (page: number, limit: number) => Promise<{ entities: Item[], total: number, offset?: number, limit?: number, error?: string }>;
    fetchItemsToAdd: (page: number, limit: number) => Promise<{ entities: any[], total: number, offset?: number, limit?: number }>;
    addItems?: (entityIds: string[]) => Promise<void>;
    deleteItems?: (entityIds: string[]) => Promise<void>;
}

const EmbedItemList: React.FC<ItemListProps> = ({ fetchItems, fetchItemsToAdd, addItems, deleteItems }) => {
    const [items, setItems] = useState<Item[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    const [currentItemsPage, setCurrentItemsPage] = useState(1);
    const [currentItemLimit, setCurrentItemLimit] = useState(10);
    const [addEntitiesModalVisible, setAddEntitiesModalVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

    const doFetch = async () => {
        setLoading(true);
        try {
            const response = await fetchItems(currentItemsPage, currentItemLimit);
            if (!!response.error) {
                message.error('invalid items data, ' + response.error);
            }
            setItems(response.entities);
            const data = response.entities;
            if (Array.isArray(data)) {
                if (!!response.total) {
                    setTotalItems(response.total);
                }
            } else {
                message.error('Invalid items data format');
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch items, err= ' + error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        doFetch();
    }, [currentItemsPage, currentItemLimit]);

    const handleItemsPageChange = (page: number) => {
        setCurrentItemsPage(page);
    };

    const handleLimitChange = (newLimit: number) => {
        setCurrentItemLimit(newLimit);
        setCurrentItemsPage(1); // 重置到第一页
    };

    const showAddEntitiesModal = () => {
        setAddEntitiesModalVisible(true);
    };

    const itemsColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            render: (text: string, record: Item) => <FirstLine content={text} link={"/items/" + record.id} />,
        },
        {
            title: 'Creator ID',
            dataIndex: 'creator_id',
            key: 'creator_id',
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
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const handleDeleteEntities = async () => {
        if (!deleteItems) return;
        const selectedIds = selectedRowKeys.map(key => key.toString());
        try {
            await deleteItems(selectedIds);
            message.success('items delete successfully');
            doFetch();
        } catch (error) {
            message.error('Failed to delete items');
        }
    };

    const handleAddEntitiesSubmit = async (selectedIds: string[]) => {
        if (!addItems) return;
        try {
            await addItems(selectedIds);
            message.success('Items added successfully');
            setAddEntitiesModalVisible(false);
            doFetch();
        } catch (error) {
            message.error('Failed to add items');
        }
    };

    const fetchCandidateEntities = async (page: number, limit: number) => {
        const response = await fetchItemsToAdd(page, limit);
        return {
            entities: response.entities,
            total: response.total,
            offset: response.offset,
            limit: response.limit,
        };
    };

    const handleCardSelect = (id: string) => {
        const newSelectedRowKeys = selectedRowKeys.includes(id)
            ? selectedRowKeys.filter(key => key !== id)
            : [...selectedRowKeys, id];
        setSelectedRowKeys(newSelectedRowKeys);
    };

    return (
        <div style={{
            padding: "12px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #b6cce6 0%, #b0cce3 100%)"
        }}>
            <Space style={{ marginBottom: '16px' }}>
                {addItems && (
                    <Button type="primary" onClick={showAddEntitiesModal}>
                        Add Items
                    </Button>
                )}
                {deleteItems && (
                    <Button type="primary" danger onClick={handleDeleteEntities} disabled={!selectedRowKeys.length}>
                        Delete Selected {selectedRowKeys.length} Items
                    </Button>
                )}
                <Switch
                    checkedChildren="Grid"
                    unCheckedChildren="Table"
                    checked={viewMode === 'grid'}
                    onChange={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                />
            </Space>

            <PaginationComponent
                currentPage={currentItemsPage}
                totalItems={totalItems}
                pageDataLength={items.length}
                limit={currentItemLimit}
                onPageChange={handleItemsPageChange}
                onLimitChange={handleLimitChange}
            />
            {viewMode === 'table' ? (
                <Table
                    columns={itemsColumns}
                    dataSource={items}
                    rowKey="id"
                    pagination={false}
                    loading={loading}
                    rowSelection={rowSelection}
                />
            ) : (
                <List
                    grid={{ gutter: 12, column: 5 }}
                    dataSource={items}
                    renderItem={item => (
                        <List.Item>
                            <Tooltip title={()=><Markdown>{item.content}</Markdown>}>
                                <ItemCard
                                    item={item}
                                    onClick={() => handleCardSelect(item.id)}
                                    selected={selectedRowKeys.includes(item.id)}
                                />
                            </Tooltip>
                        </List.Item>
                    )}
                />
            )}
            <AppendEntitiesModal
                title={"选择要添加的 items"}
                visible={addEntitiesModalVisible}
                onCancel={() => setAddEntitiesModalVisible(false)}
                onSubmit={handleAddEntitiesSubmit}
                fetchEntities={fetchCandidateEntities}
            />
        </div>
    );
};

export default EmbedItemList;
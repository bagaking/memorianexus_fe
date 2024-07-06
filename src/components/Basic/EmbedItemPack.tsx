import React, { useEffect, useState } from 'react';
import { Table, message, Button, Switch, List, Space } from 'antd';
import PaginationComponent from '../Common/PaginationComponent';
import AppendEntitiesModal from '../Common/AppendEntitiesModal';
import { ColumnsType } from "antd/es/table";
import {ListGridType} from "antd/es/list";

interface EmbedItemPackProps<T> {
    fetchItems: (page: number, limit: number) => Promise<{ entities: T[], total: number, offset?: number, limit?: number, error?: string }>;

    // for mod items
    addItems?: (entityIds: string[]) => Promise<void>;
    fetchItemsToAdd: (page: number, limit: number, search?: string) => Promise<{ entities: T[], total: number, offset?: number, limit?: number }>;
    deleteItems?: (entityIds: string[]) => Promise<void>;

    // for card select & table index
    rowKey: string,

    // for table
    itemsColumns?: ColumnsType<T>;

    // for card list
    renderItem?: (item: T, selected: boolean, onSelect: () => void) => React.ReactNode;
    grid?: ListGridType,
}

const EmbedItemPack = <T extends {}>({
                                                     fetchItems,
                                                     fetchItemsToAdd,
                                                     addItems,
                                                     deleteItems,
                                                     itemsColumns,
                                                     renderItem,
                                                     rowKey,
                                                     grid,
                                                 }: EmbedItemPackProps<T>) => {
    const [items, setItems] = useState<T[]>([]);
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

    const fetchCandidateEntities = async (page: number, limit: number, search?: string) => {
        const response = await fetchItemsToAdd(page, limit, search);
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
            {(itemsColumns && viewMode === 'table') ? (
                <Table
                    columns={itemsColumns}
                    dataSource={items}
                    rowKey={rowKey}
                    pagination={false}
                    loading={loading}
                    rowSelection={rowSelection}
                />
            ) : (
                <List
                    grid={grid || { gutter: 12, column: 5 }}
                    dataSource={items}
                    renderItem={item => (
                        <List.Item>
                            {renderItem && renderItem(
                                item,
                                selectedRowKeys.includes((item as any)[rowKey]),
                                () => handleCardSelect((item as any)[rowKey]),
                                )
                            }
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

export default EmbedItemPack;
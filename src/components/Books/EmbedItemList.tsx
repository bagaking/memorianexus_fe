import React, { useEffect, useState } from 'react';
import { Table, message, Button } from 'antd';
import { getBookItems, addBookItems, removeBookItems } from '../../api/books';
import PaginationComponent from '../Common/PaginationComponent';
import FirstLine from "../Common/Firstline";
import AppendEntitiesModal from '../Common/AppendEntitiesModal';
import {getItems} from "../../api/items";

interface Item {
    id: string;
    creator_id: string;
    type: string;
    content: string;
    created_at: string;
    updated_at: string;
    difficulty: number;
    importance: number;
}

interface ItemListProps {
    bookId: string;
}

const EmbedItemList: React.FC<ItemListProps> = ({ bookId }) => {
    const [items, setItems] = useState<Item[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentItemsPage, setCurrentItemsPage] = useState(1);
    const [itemsLimit, setItemsLimit] = useState(10);
    const [addEntitiesModalVisible, setAddEntitiesModalVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const fetchItems = async (bookId: string) => {
        setLoading(true);
        try {
            const response = await getBookItems({ bookId, page: currentItemsPage, limit: itemsLimit });
            const data = response.data.data;
            if (Array.isArray(data)) {
                setItems(data);
                if (response.data.total) {
                    setTotalItems(response.data.total);
                } else if (data.length === response.data.limit){
                    setTotalItems(currentItemsPage * itemsLimit + 1);
                } else if (data.length > 0) {
                    setTotalItems((currentItemsPage -1) * itemsLimit + data.length);
                } else { // 最后一页
                    setTotalItems((currentItemsPage -1) * itemsLimit + 1);
                }
            } else {
                message.error('Invalid items data format');
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch items of book ' + bookId + ', err= ' + error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems(bookId);
    }, [bookId, currentItemsPage, itemsLimit]);

    const handleItemsPageChange = (page: number) => {
        setCurrentItemsPage(page);
    };

    const handleLimitChange = (newLimit: number) => {
        setItemsLimit(newLimit);
        setCurrentItemsPage(1); // 重置到第一页
    };

    const showAddEntitiesModal = () => {
        setAddEntitiesModalVisible(true);
    };

    const handleAddEntitiesSubmit = async (entityIds: string[]) => {
        try {
            await addBookItems({ bookId, itemIds: entityIds });
            message.success('Items added successfully');
            fetchItems(bookId);
            setAddEntitiesModalVisible(false);
        } catch (error) {
            console.error(error);
            message.error('Failed to add items to book');
        }
    };

    const handleDelete = async () => {
        try {
            await removeBookItems({ bookId, itemIds: selectedRowKeys as string[] });
            message.success('Items deleted successfully');
            fetchItems(bookId);
        } catch (error) {
            console.error(error);
            message.error('Failed to delete items from book');
        }
    };

    const fetchCandidateEntities = async (page: number) => {
        const response = await getItems({ page, limit: 10 });
        return {
            entities: response.data.data,
            total: response.data.total,
        };
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

    return (
        <div style={{
            padding: "12px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #b6cce6 0%, #b0cce3 100%)"
        }}>
            <Button type="primary" onClick={showAddEntitiesModal} style={{marginBottom: '16px'}}>
                Add Items
            </Button>
            <Button type="primary" danger onClick={handleDelete} disabled={!selectedRowKeys.length}
                    style={{marginBottom: '16px', marginLeft: '8px'}}>
                Delete Selected
            </Button>
            <Table
                columns={itemsColumns}
                dataSource={items}
                rowKey="id"
                pagination={false}
                loading={loading}
                rowSelection={rowSelection}
            />
            <PaginationComponent
                currentPage={currentItemsPage}
                totalItems={totalItems}
                limit={itemsLimit}
                onPageChange={handleItemsPageChange}
                onLimitChange={handleLimitChange}
            />
            <AppendEntitiesModal
                visible={addEntitiesModalVisible}
                onCancel={() => setAddEntitiesModalVisible(false)}
                onSubmit={handleAddEntitiesSubmit}
                fetchEntities={fetchCandidateEntities}
            />
        </div>
    );
};

export default EmbedItemList;
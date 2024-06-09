// src/components/Books/EmbedItemList.tsx
import React, { useEffect, useState } from 'react';
import { Table, message, Button, Modal, Form, Input } from 'antd';
import { getBookItems, addBookItems, removeBookItems } from '../../api/books';
import PaginationComponent from '../Common/PaginationComponent';
import ReactMarkdown from "react-markdown";

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
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [form] = Form.useForm();

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

    const showAddModal = () => {
        setAddModalVisible(true);
    };

    const handleAdd = async (values: { itemIds: string }) => {
        const itemIds = values.itemIds.split(',').map(id => id.trim());
        try {
            await addBookItems({ bookId, itemIds });
            message.success('Items added successfully');
            fetchItems(bookId);
        } catch (error) {
            console.error(error);
            message.error('Failed to add items to book');
        } finally {
            setAddModalVisible(false);
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
            render: (text: string) => <ReactMarkdown className="markdown-content">{text}</ReactMarkdown>,
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
        <div>
            <Button type="primary" onClick={showAddModal} style={{ marginBottom: '16px' }}>
                Add Items
            </Button>
            <Button type="primary" danger onClick={handleDelete} disabled={!selectedRowKeys.length} style={{ marginBottom: '16px', marginLeft: '8px' }}>
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
            <Modal
                title="Add Items"
                visible={addModalVisible}
                onCancel={() => setAddModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleAdd}>
                    <Form.Item name="itemIds" rules={[{ required: true, message: 'Please enter the item IDs!' }]}>
                        <Input placeholder="Item IDs (comma separated)" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default EmbedItemList;
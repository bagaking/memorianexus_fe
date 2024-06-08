import React, { useEffect, useState } from 'react';
import {Table, message, Button, Card, Modal, Tooltip, Badge} from 'antd';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getItems, deleteItem } from '../../api/items';

interface Item {
    id: string;
    content: string;
    type: string;
}

const ItemList: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

    const fetchItems = async () => {
        try {
            const response = await getItems();
            const data = response.data.data;
            if (Array.isArray(data)) {
                setItems(data);
            } else {
                console.log("items resp", response);
                message.error('Invalid items data format');
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch items');
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleExpand = (record: Item) => {
        setExpandedRowKeys(prevKeys =>
            prevKeys.includes(record.id) ? prevKeys.filter(key => key !== record.id) : [record.id]
        );
    };

    const getFirstNonEmptyLine = (content: string) => {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        return lines.length > 0 ? lines[0] : '';
    };

    const showDeleteModal = (item: Item) => {
        setItemToDelete(item);
        setDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        if (itemToDelete) {
            try {
                await deleteItem(itemToDelete.id);
                message.success('Item deleted successfully');
                fetchItems();
            } catch (error) {
                console.error(error);
                message.error('Failed to delete item');
            } finally {
                setDeleteModalVisible(false);
                setItemToDelete(null);
            }
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 200,
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            render: (text: string) => <ReactMarkdown className="markdown-content">{getFirstNonEmptyLine(text).replace("#", "")}</ReactMarkdown>,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Item) => (
                <>
                    <Button type="link" size="small">
                        <Link to={`/items/${record.id}`}>Detail</Link>
                    </Button>
                    <Button type="link"  size="small" danger onClick={() => showDeleteModal(record)} style={{ marginLeft: '8px' }}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];


    const expandedRowRender = (record: Item) => (
        <Card key={record.id} style={{margin: '-17px', borderRadius: '0px 0px 8px 8px '}}>
            <small>&{record.type}</small>
            <br/>
            <ReactMarkdown className="markdown-content">{record.content}</ReactMarkdown>

        </Card>
    );

    return (
        <div>
            <h2>Items</h2>
            <Link to="/items/new">
                <Button type="primary" style={{ marginBottom: '16px', width:"100%" }}>Create New Item</Button>
            </Link>
            <Table
                columns={columns}
                dataSource={items}
                rowKey="id"
                expandedRowKeys={expandedRowKeys}
                onRow={(record) => ({
                    onClick: () => handleExpand(record),
                })}
                expandable={{ expandedRowRender }}
            />
            <Modal
                title="Confirm Deletion"
                visible={deleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setDeleteModalVisible(false)}
            >
                <p>Are you sure you want to delete this item?</p>
            </Modal>
        </div>
    );
};

export default ItemList;
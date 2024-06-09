// src/components/Items/ItemList.tsx
import React, { useEffect, useState } from 'react';
import { Table, message, Button, Card } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getItems, deleteItem } from '../../api/items';
import { PageLayout } from '../Common/PageLayout';
import { DeleteModal } from '../Common/DeleteModal';
import PaginationComponent from '../Common/PaginationComponent';
import '../Common/CommonStyles.css';

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
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const [currentPage, setCurrentPage] = useState(Number(queryParams.get('page')) || 1);
    const [limit, setLimit] = useState(Number(queryParams.get('limit')) || 10);

    const fetchItems = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const response = await getItems({ page, limit });
            const data = response.data.data;
            if (Array.isArray(data)) {
                setItems(data);
                if (response.data.total) {
                    setTotalItems(response.data.total);
                } else if (data.length >= response.data.limit) {
                    setTotalItems(currentPage * limit + 1);
                } else {
                    setTotalItems((currentPage - 1) * limit + data.length);
                }
            } else {
                console.log("items resp", response);
                message.error('Invalid items data format');
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems(currentPage, limit);
    }, [currentPage, limit]);

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
                fetchItems(currentPage, limit);
            } catch (error) {
                console.error(error);
                message.error('Failed to delete item');
            } finally {
                setDeleteModalVisible(false);
                setItemToDelete(null);
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        navigate(`/items?page=${page}&limit=${limit}`);
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setCurrentPage(1); // 重置到第一页
        navigate(`/items?page=1&limit=${newLimit}`);
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
                    <Button type="link" size="small" danger onClick={() => showDeleteModal(record)} style={{ marginLeft: '8px' }}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    const expandedRowRender = (record: Item) => (
        <Card key={record.id} style={{ margin: '-17px', borderRadius: '0px 0px 8px 8px ' }}>
            <small>&{record.type}</small>
            <br/>
            <ReactMarkdown className="markdown-content">{record.content}</ReactMarkdown>
        </Card>
    );

    return (
        <PageLayout title="Items" icon="/item_icon.png">
            <Link to="/items/new">
                <Button type="primary" style={{ marginBottom: '16px', width: "100%" }} className="create-new-one-button">Create New Item</Button>
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
                pagination={false}
                loading={loading}
            />
            <PaginationComponent
                currentPage={currentPage}
                totalItems={totalItems}
                limit={limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />
            <DeleteModal visible={deleteModalVisible} onConfirm={handleDelete} onCancel={() => setDeleteModalVisible(false)} />
        </PageLayout>
    );
};

export default ItemList;
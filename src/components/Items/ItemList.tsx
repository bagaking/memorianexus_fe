import React, { useEffect, useState } from 'react';
import { Table, message, Button, Card, Row, Col, Typography, Tag, Divider } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';
import { getItems, deleteItem } from '../../api/items';
import { PageLayout } from '../Layout/PageLayout';
import { DeleteModal } from '../Common/DeleteModal';
import PaginationComponent from '../Common/PaginationComponent';
import ItemUpload from './ItemUpload'; // 引入 ItemUpload 组件
import { useIsMobile } from '../../hooks/useWindowSize';
import '../Common/CommonStyles.css';
import './ItemList.css'; // 引入新的样式文件
import { PlusOutlined } from '@ant-design/icons';
import ItemCard from './ItemCard';

const { Text } = Typography;

interface Item {
    id: string;
    content: string;
    type: string;
}

const ItemList: React.FC = () => {
    const isMobile = useIsMobile();
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
        setCurrentPage(1); // 重到第一页
        navigate(`/items?page=1&limit=${newLimit}`);
    };


    const customRenderers: Components = {
        h1: createHeadingRenderer('h1'),
        h2: createHeadingRenderer('h2'),
        h3: createHeadingRenderer('h3'),
        h4: createHeadingRenderer('h4'),
        h5: createHeadingRenderer('h5'),
        h6: createHeadingRenderer('h6'),
    };

    function createHeadingRenderer(level: string) {
        return ({ children }: React.PropsWithChildren<{}>) => (
            <Text>
                <Tag color="default" style={{ borderRadius: '2px', padding: '0 2px', marginRight: '2px', fontSize: '10px' }}>
                    <Text type="secondary">{level}</Text>
                </Tag>
                <Text strong> {children}</Text>
            </Text>
        );
    }

    const ItemCardList: React.FC = () => (
        <Row gutter={[8, 8]}>
            {items.map(item => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={item.id}>
                    <ItemCard 
                        item={item}
                        customRenderers={customRenderers}
                        showDeleteModal={showDeleteModal}
                        getFirstNonEmptyLine={getFirstNonEmptyLine}
                    />
                </Col>
            ))}
        </Row>
    );

    const columns: any[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 200,
            responsive: ['md'], // 在中等及以上屏幕显示
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            responsive: ['sm'], // 在小屏及以上屏幕显示
            render: (text: string) => <ReactMarkdown components={customRenderers}>{getFirstNonEmptyLine(text)}</ReactMarkdown>,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            responsive: ['md'], // 在中等及以上屏幕显示
        },
        {
            title: 'Action',
            key: 'action',
            responsive: ['sm'], // 在小屏及以上屏幕显示
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
            <ReactMarkdown components={customRenderers}>{record.content}</ReactMarkdown>
        </Card>
    );

    const ActionButtons: React.FC = () => (
        <Row gutter={[16, 16]} className="action-buttons">
            <Col xs={12} sm={12}>
                <Link to="/items/new" style={{ display: 'block', height: '100%' }}>
                    <Button type="primary" icon={<PlusOutlined />} block className="create-button" style={{ height: '100%' }}>
                        创建新项目
                    </Button>
                </Link>
            </Col>
            <Col xs={12} sm={12}>
                <ItemUpload
                    className="upload-button"
                    onUploadSuccess={() => fetchItems(currentPage, limit)}
                    style={{ height: '100%' }}
                />
            </Col>
        </Row>
    );

    return (
        <PageLayout title="Items" icon="/item_icon.png">
            <div style={{ padding: isMobile ? '8px' : '24px' }}>
                <Card className="item-list-card">
                    <ActionButtons />
                    <Divider />
                    {isMobile ? (
                        <ItemCardList />
                    ) : (
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
                            scroll={{ x: '100%' }} // 允许水平滚动
                        />
                    )}
                    <Divider />
                    <PaginationComponent
                        currentPage={currentPage}
                        totalItems={totalItems}
                        limit={limit}
                        pageDataLength={items.length}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                    />
                </Card>
            </div>
            <DeleteModal 
                visible={deleteModalVisible} 
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalVisible(false)}
            />
        </PageLayout>
    );
};

export default ItemList;
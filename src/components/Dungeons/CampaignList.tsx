import React, { useEffect, useState } from 'react';
import { message, Button, Card, Space, Row, Col, Typography, Table } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getDungeons, deleteDungeon } from '../../api/dungeons';
import { PageLayout } from '../Layout/PageLayout';
import { DeleteModal } from '../Common/DeleteModal';
import PaginationComponent from '../Common/PaginationComponent';
import '../Common/CommonStyles.css';
import { useIsMobile } from '../../hooks/useWindowSize';

const { Title, Paragraph } = Typography;

interface Dungeon {
    id: string;
    title: string;
    description: string;
}

const CampaignList: React.FC = () => {
    const [dungeons, setDungeons] = useState<Dungeon[]>([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [dungeonToDelete, setDungeonToDelete] = useState<Dungeon | null>(null);
    const [totalDungeons, setTotalDungeons] = useState(0);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const [currentPage, setCurrentPage] = useState(Number(queryParams.get('page')) || 1);
    const [limit, setLimit] = useState(Number(queryParams.get('limit')) || 10);
    const isMobile = useIsMobile();

    const fetchDungeons = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const response = await getDungeons({ page, limit });
            const data = response.data.data;
            if (Array.isArray(data)) {
                setDungeons(data);
                if (response.data.total) {
                    setTotalDungeons(response.data.total);
                }
            } else {
                console.log("dungeons resp", response);
                message.error('Invalid dungeons data format');
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch dungeons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDungeons(currentPage, limit);
    }, [currentPage, limit]);

    const handleExpand = (record: Dungeon) => {
        setExpandedRowKeys(prevKeys =>
            prevKeys.includes(record.id) ? prevKeys.filter(key => key !== record.id) : [record.id]
        );
    };

    const showDeleteModal = (dungeon: Dungeon) => {
        setDungeonToDelete(dungeon);
        setDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        if (dungeonToDelete) {
            try {
                await deleteDungeon(dungeonToDelete.id);
                message.success('Dungeon deleted successfully');
                fetchDungeons(currentPage, limit);
            } catch (error) {
                console.error(error);
                message.error('Failed to delete dungeon');
            } finally {
                setDeleteModalVisible(false);
                setDungeonToDelete(null);
            }
        }
    };

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize && pageSize !== limit) {
            setLimit(pageSize);
        }
        navigate(`/campaigns?page=${page}&limit=${pageSize || limit}`);
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setCurrentPage(1); // 重置到第一页
        navigate(`/campaigns?page=1&limit=${newLimit}`);
    };


    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: '操作',
            key: 'actions',
            render: (_: any, record: Dungeon) => (
                <Space>
                    <Link to={`/campaigns/${record.id}/challenge`}>挑战</Link>
                    <Link to={`/campaigns/${record.id}`}>信息</Link>
                    <Link to={`/campaigns/${record.id}/monsters`}>怪物</Link>
                    <Button type="link" danger onClick={() => showDeleteModal(record)}>删除</Button>
                </Space>
            ),
        },
    ];

    const DungeonCard: React.FC<{ dungeon: Dungeon }> = ({ dungeon }) => (
        <Card
            title={dungeon.title}
            extra={<Link to={`/campaigns/${dungeon.id}/challenge`}>挑战</Link>}
            actions={[
                <Link to={`/campaigns/${dungeon.id}`}>信息</Link>,
                <Link to={`/campaigns/${dungeon.id}/monsters`}>怪物</Link>,
                <Button type="text" danger onClick={() => showDeleteModal(dungeon)}>删除</Button>
            ]}
        >
            <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '更多' }}>
                {dungeon.description}
            </Paragraph>
        </Card>
    );

    const DungeonList: React.FC = () => (
        <Table
            columns={columns}
            dataSource={dungeons}
            rowKey="id"
            pagination={false}
            loading={loading}
        />
    );

    const DungeonCardList: React.FC = () => (
        <Row gutter={[16, 16]}>
            {dungeons.map(dungeon => (
                <Col xs={24} sm={12} key={dungeon.id}>
                    <DungeonCard dungeon={dungeon} />
                </Col>
            ))}
        </Row>
    );

    return (
        <PageLayout title="战役" icon="/campaign_dungeon_icon.png">
            <Row gutter={[16, 16]}>
                <Col xs={24}>
                    <Link to="/campaigns/new">
                        <Button type="primary" style={{width: "100%"}} className="create-new-one-button">
                            创建新战役
                        </Button>
                    </Link>
                </Col>
                <Col xs={24}>
                    {isMobile ? <DungeonCardList /> : <DungeonList />}
                </Col>
                <Col xs={24}>
                    <PaginationComponent
                        currentPage={currentPage}
                        totalItems={totalDungeons}
                        limit={limit}
                        pageDataLength={dungeons.length}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                    />
                </Col>
            </Row>
            <DeleteModal 
                visible={deleteModalVisible} 
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalVisible(false)}
            />
        </PageLayout>
    );
};

export default CampaignList;
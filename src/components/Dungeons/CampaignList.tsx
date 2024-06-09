// src/components/Dungeons/CampaignList.tsx
import React, { useEffect, useState } from 'react';
import { Table, message, Button, Card } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getDungeons, deleteDungeon } from '../../api/dungeons';
import { PageLayout } from '../Common/PageLayout';
import { DeleteModal } from '../Common/DeleteModal';
import PaginationComponent from '../Common/PaginationComponent';
import '../Common/CommonStyles.css';

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

    const fetchDungeons = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const response = await getDungeons({ page, limit });
            const data = response.data.data;
            if (Array.isArray(data)) {
                setDungeons(data);
                if (response.data.total) {
                    setTotalDungeons(response.data.total);
                } else if (data.length >= response.data.limit) {
                    setTotalDungeons(currentPage * limit + 1);
                } else {
                    setTotalDungeons((currentPage - 1) * limit + data.length);
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        navigate(`/campaigns?page=${page}&limit=${limit}`);
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setCurrentPage(1); // 重置到第一页
        navigate(`/campaigns?page=1&limit=${newLimit}`);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 200,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Dungeon) => (
                <>
                    <Button type="link" size="small">
                        <Link to={`/campaigns/${record.id}`}>Detail</Link>
                    </Button>
                    <Button type="link" size="small" danger onClick={() => showDeleteModal(record)} style={{ marginLeft: '8px' }}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    const expandedRowRender = (record: Dungeon) => (
        <Card key={record.id} style={{ margin: '-17px', borderRadius: '0px 0px 8px 8px ' }}>
            <small>&{record.title}</small>
            <br/>
            {record.description}
        </Card>
    );

    return (
        <PageLayout title="Campaigns" icon="/campaign_icon.png">
            <Link to="/campaigns/new">
                <Button type="primary" style={{ marginBottom: '16px', width: "100%" }} className="create-new-one-button">Create New Campaign Dungeon</Button>
            </Link>
            <Table
                columns={columns}
                dataSource={dungeons}
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
                totalItems={totalDungeons}
                limit={limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />
            <DeleteModal visible={deleteModalVisible} onConfirm={handleDelete} onCancel={() => setDeleteModalVisible(false)} />
        </PageLayout>
    );
};

export default CampaignList;
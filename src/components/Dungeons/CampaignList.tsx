import React, { useEffect, useState, useCallback } from 'react';
import { message, Card, Typography, Button, Tooltip } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlusOutlined, DeleteOutlined, InfoCircleOutlined, RocketOutlined, BugOutlined } from '@ant-design/icons';
import { getDungeons, deleteDungeon } from '../../api/dungeons';
import { PageLayout } from '../Layout/PageLayout';
import { DeleteModal } from '../Common/DeleteModal';
import PaginationComponent from '../Common/PaginationComponent';
import { useIsMobile } from '../../hooks/useWindowSize';
import GradientButton from '../Common/GradientButton';
import './CampaignList.less';
import CDNImage from '../Common/CDNImage';

const { Title, Paragraph, Text } = Typography;

interface Dungeon {
    id: string;
    title: string;
    
    description: string;
    difficulty: string;
    recommendedLevel: number;
    mapImageUrl: string;
}

const CampaignList: React.FC = () => {
    const [dungeons, setDungeons] = useState<Dungeon[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [dungeonToDelete, setDungeonToDelete] = useState<Dungeon | null>(null);
    const [totalDungeons, setTotalDungeons] = useState(0);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useIsMobile(); 

    const queryParams = new URLSearchParams(location.search);
    const [currentPage, setCurrentPage] = useState(Number(queryParams.get('page')) || 1);
    const [limit, setLimit] = useState(Number(queryParams.get('limit')) || 10);

    const fetchDungeons = useCallback(async (page: number, limit: number) => {
        setLoading(true);
        try {
            const response = await getDungeons({ page, limit });
            const { data, total } = response.data;
            if (Array.isArray(data)) {
                setDungeons(data);
                setTotalDungeons(total || 0);
            } else {
                message.error('无效的副本数据格式');
            }
        } catch (error) {
            console.error(error);
            message.error('获取副本列表失败');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDungeons(currentPage, limit);
    }, [currentPage, limit, fetchDungeons]);

    const showDeleteModal = useCallback((dungeon: Dungeon) => {
        setDungeonToDelete(dungeon);
        setDeleteModalVisible(true);
    }, []);

    const handleDelete = useCallback(async () => {
        if (dungeonToDelete) {
            try {
                await deleteDungeon(dungeonToDelete.id);
                message.success('副本删除成功');
                fetchDungeons(currentPage, limit);
            } catch (error) {
                console.error(error);
                message.error('删除副本失败');
            } finally {
                setDeleteModalVisible(false);
                setDungeonToDelete(null);
            }
        }
    }, [dungeonToDelete, currentPage, limit, fetchDungeons]);

    const handlePageChange = useCallback((page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize && pageSize !== limit) {
            setLimit(pageSize);
        }
        navigate(`/campaigns?page=${page}&limit=${pageSize || limit}`);
    }, [limit, navigate]);

    const handleLimitChange = useCallback((newLimit: number) => {
        setLimit(newLimit);
        setCurrentPage(1);
        navigate(`/campaigns?page=1&limit=${newLimit}`);
    }, [navigate]);

    const ActionButton: React.FC<{
        tooltip: string;
        icon: React.ReactNode;
        onClick: () => void;
        type?: "primary" | "default" | "link" | "text" | "dashed";
        danger?: boolean;
        children: React.ReactNode;
    }> = ({ tooltip, icon, onClick, type = "default", danger = false, children }) => (
        <Tooltip title={tooltip}>
            <Button
                type={type}
                icon={icon}
                onClick={onClick}
                className="action-button"
                danger={danger}
            >
                {children}
            </Button>
        </Tooltip>
    );

    const DungeonCard: React.FC<{ dungeon: Dungeon }> = ({ dungeon }) => (
        <Card className="campaign-card" hoverable>
            <div className="campaign-card-content">
                <CDNImage 
                    className="campaign-map"
                    src={dungeon.mapImageUrl || "portraits/sea_warrior_03.png"}
                />
                <div className="campaign-info">
                    <Title level={3} className="campaign-title">{dungeon.title}</Title>
                    <Paragraph className="campaign-description" ellipsis={{ rows: 2, expandable: true, symbol: '更多' }}>
                        {dungeon.description}
                    </Paragraph>
                    <div className="campaign-details">
                        <Text>难度: {dungeon.difficulty}</Text>
                        <Text>推荐等级: {dungeon.recommendedLevel}</Text>
                    </div>
                    <div className="action-buttons">
                        <ActionButton
                            tooltip="开始挑战"
                            icon={<RocketOutlined />}
                            onClick={() => navigate(`/campaigns/${dungeon.id}/challenge`)}
                            type="primary"
                        >
                            挑战
                        </ActionButton>
                        <ActionButton
                            tooltip="查看详细信息"
                            icon={<InfoCircleOutlined />}
                            onClick={() => navigate(`/campaigns/${dungeon.id}`)}
                        >
                            信息
                        </ActionButton>
                        <ActionButton
                            tooltip="管理怪物"
                            icon={<BugOutlined />}
                            onClick={() => navigate(`/campaigns/${dungeon.id}/monsters`)}
                        >
                            怪物
                        </ActionButton>
                        <ActionButton
                            tooltip="删除副本"
                            icon={<DeleteOutlined />}
                            onClick={() => showDeleteModal(dungeon)}
                            danger
                        >
                            删除
                        </ActionButton>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <PageLayout 
            title="史诗战役" 
            icon="/layout/campaign_dungeon_icon.png" 
            fullWidthContent={true}
        >
            <div className="campaign-list-container">
                <div className="campaign-controller">
                    <div className="controller-content">
                        <GradientButton 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/campaigns/new')}
                            startColor="#88d3ce"
                            endColor="#6e45e2" 
                            hoverStartColor="#5a36c7"
                            hoverEndColor="#7ac7c0"
                            animation="shine"
                            animationDuration="0.8s"
                        >
                            创建新战役
                        </GradientButton>
                        <PaginationComponent
                            currentPage={currentPage}
                            totalItems={totalDungeons}
                            limit={limit}
                            pageDataLength={dungeons.length}
                            onPageChange={handlePageChange}
                            onLimitChange={handleLimitChange}
                        />
                    </div>
                </div>
                <div className="campaign-list">
                    {dungeons.map(dungeon => (
                        <DungeonCard key={dungeon.id} dungeon={dungeon} />
                    ))}
                </div>
            </div>
            <DeleteModal 
                visible={deleteModalVisible} 
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalVisible(false)}
            />
        </PageLayout>
    );
};

export default CampaignList;
import React, { useState } from 'react';
import { Card, Button } from 'antd';
import { Link } from "react-router-dom";
import { DungeonMonster } from "../../api/_dto";
import { MarkdownField } from '../Common/FormFields'; // 导入 MarkdownField
import FirstLineMD from '../Common/FirstLineMD';
import { EditOutlined, LinkOutlined } from '@ant-design/icons'; // 导入 LinkOutlined
import { DifficultyImportance } from '../Basic/ItemComponents';
import CopyableID from '../Common/CopyableID'; // 导入 CopyableID
import MonsterPortrait from './MonsterPortrait';
import TaggedMarkdown from '../Common/TaggedMarkdown';
import { useIsMobile } from '../../hooks/useWindowSize';
import styled from 'styled-components'; // 导入 styled-components

const StyledCard = styled(Card)`
    height: auto;
    position: relative;
    padding: 0;
    background: linear-gradient(135deg, #5c2b8a, #7a3e9d); // 渐变背景
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s;
    
    border: 1px solid #3498db;

    &:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        border: 1px solid #C0C0C0;
        @media (max-width: 768px) {
            transform: translateY(-2px);
        }
    }
`;

const StyledButton = styled(Button)`
    background-color: #3498db; // 按钮颜色
    border: none;
    &:hover {
        background-color: #2980b9; // 悬停颜色
    }
`;

const InfoContainer = styled.div`
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.9); // 半透明背景
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const StyledMarkdownField = styled(MarkdownField)`
    height: 168px;
    min-height: 150px;
    margin: 0;
    padding: 2px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    background-color: #3c105355; // 背景颜色
`;

const StyledTaggedMarkdown = styled.div`
    margin-top: 2px;
    padding: 4px;
    max-height: 168px;
    overflow-y: auto;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    background-color: #3c105355; // 背景颜色
`;

interface MonsterCardProps {
    monster: DungeonMonster;
    onClick?: () => void;
    selected?: boolean;
    onEdit?: (content: string) => void; // 修改编辑回调以传递内容
}

const MonsterDisplayCard: React.FC<MonsterCardProps> = ({ monster, onClick, selected, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(monster.description || '');
    const isMobile = useIsMobile();

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        if (content !== monster.description) { // 检查内容是否有变化
            if (onEdit) {
                onEdit(content); // 调用 onEdit 回调
            }
        }
        setIsEditing(false);
    };

    return (
        <StyledCard
            className={`monster-card ${selected ? 'selected' : ''}`}
            onClick={onClick}
        >
            <MonsterPortrait
                id={monster.item_id}
                alt={monster.name}
                style={{ height: '200px', width: '100%' }} // 设置图片高度  
            />
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <Link to={`/Items/${monster.item_id}`} onClick={(e) => e.stopPropagation()}> {/* 阻止事件冒泡 */}
                    <LinkOutlined style={{ fontSize: '20px', color: '#fff', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '50%', padding: '5px' }} />
                </Link>
            </div>
            <InfoContainer>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <CopyableID id={monster.item_id} tooltipTitle="点击复制 ID" style={{ width: `calc(100% - 80px)` }} />
                    <StyledButton 
                        onClick={(e) => { e.stopPropagation(); isEditing ? handleSave() : handleEdit(); }} // 点击编辑或保存
                        type="primary" 
                        icon={<EditOutlined />} // 使用相同图标
                        size="small"
                    >
                        {isEditing ? '保存' : '编辑'} {/* 根据状态切换按钮文本 */}
                    </StyledButton>
                </div>
                <DifficultyImportance 
                    difficulty={monster.difficulty} 
                    importance={monster.importance} 
                    familiarity={monster.familiarity}
                />
                {isEditing ? (
                    <div style={{ marginTop: '10px' }} onClick={(e) => e.stopPropagation()} >
                        <StyledMarkdownField 
                            name="description" 
                            value={content} 
                            onChange={setContent} // 更新内容
                            rules={[{ required: true, message: '请填写描述!' }]} // 添加验证规则
                            view={{
                                menu: false,
                                md: true,
                                html: false,
                            }}
                        />
                    </div>
                ) : (
                    <StyledTaggedMarkdown>
                        <TaggedMarkdown mode="tag" showDivider={true} >{content}</TaggedMarkdown>    
                    </StyledTaggedMarkdown>
                )}
            </InfoContainer>
        </StyledCard>
    );
};

export default MonsterDisplayCard;
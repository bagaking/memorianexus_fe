import React, { useState } from 'react';
import { Card, Button, Modal, Typography, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';
import TaggedMarkdown from '../Common/TaggedMarkdown';
import HoverDetails from '../Common/HoverDetails';
import { Item } from "../../api/_dto";
import styled from 'styled-components';
import { useIsMobile } from '../../hooks/useWindowSize';

const { Text } = Typography;

interface ItemCardProps {
	item: Item;
	showDeleteModal?: (item: Item) => void;
	getFirstNonEmptyLine?: (content: string) => string;
	onClick?: () => void;
	selected?: boolean;
	showPreview?: boolean;
	showActions?: boolean;
	indentHeadings?: boolean;
}

const StyledCard = styled(Card)<{ $selected: boolean; $isMobile: boolean }>`
  margin: 4px;
  transition: box-shadow 0.3s ease;
  
  ${props => props.$selected && `
    box-shadow: 0 0 10px rgba(24, 144, 255, 0.5);
  `}

  ${props => props.$isMobile && `
    .ant-card-body {
      padding: 12px;
    }
  `}
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
`;

const PreviewContainer = styled.div<{ $isMobile: boolean }>`
  height: ${props => props.$isMobile ? '40px' : '60px'};
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '...';
    position: absolute;
    bottom: 0;
    right: 0;
    padding-left: 40px;
    background: linear-gradient(to right, transparent, white 50%);
  }
`;

const SmallTag = styled(Tag)`
  font-size: 10px;
  padding: 0 4px;
  line-height: 16px;
  height: 18px;
`;

const DetailButton = styled(Button)`
  padding: 0;
  height: auto;
  line-height: 1;
  z-index: 2;
  margin-right: 4px;
`;

const ItemCard: React.FC<ItemCardProps> = ({
	item,
	showDeleteModal,
	getFirstNonEmptyLine = (content: string | undefined) => {
		if (!content) return '';
		return content.split('\n').find(line => line.trim() !== '') || '';
	},
	onClick,
	selected = false,
	showPreview = true,
	showActions = true,
	indentHeadings = true
}) => {
	const isMobile = useIsMobile();
	const [isModalVisible, setIsModalVisible] = useState(false);

	const handleDetailsClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsModalVisible(true);
	};

	const cardContent = (
		<StyledCard
			size="small"
			$selected={selected}
			$isMobile={isMobile}
			onClick={onClick}
			title={
				<CardTitle>
					{isMobile && <DetailButton type="link" onClick={handleDetailsClick}><InfoCircleOutlined /></DetailButton>}
					<TaggedMarkdown mode={indentHeadings ? 'heading' : 'tag'}>{getFirstNonEmptyLine(item.content)}</TaggedMarkdown>
				</CardTitle>
			}
			actions={showActions ? [
				<SmallTag color="blue">{item.type}</SmallTag>,
                <Button type="link" size="small" >
                    <Link to={`/items/${item.id}`}>Detail</Link>
                </Button>,
				showDeleteModal && <Button type="link" size="small" danger onClick={(e) => {
					e.stopPropagation();
					showDeleteModal(item);
				}}>Delete</Button>,
			].filter(Boolean) : undefined}
		>
			{showPreview && item.content && (
				<PreviewContainer $isMobile={isMobile}>
					<TaggedMarkdown mode={indentHeadings ? 'heading' : 'tag'}>
						{item.content.split('\n').slice(1).join('\n')}
					</TaggedMarkdown>
				</PreviewContainer>
			)}
		</StyledCard>
	);

	const detailsContent = (
		<TaggedMarkdown mode={indentHeadings ? 'heading' : 'tag'} showDivider={true}>
			{item.content || ''}
		</TaggedMarkdown>
	);

	return (
		<>
			{isMobile ? (
				<>
					{cardContent}
					<Modal
						visible={isModalVisible}
						onCancel={() => setIsModalVisible(false)}
						footer={null}
					>
						{detailsContent}
					</Modal>
				</>
			) : (
				<HoverDetails
					content={detailsContent}
					trigger={cardContent}
					placement="top"
					showCopyButton={true}
					copyText={item.content}
				/>
			)}
		</>
	);
};

export default ItemCard;
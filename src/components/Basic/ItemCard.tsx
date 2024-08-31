import React from 'react';
import { Card, Button, Typography, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import TaggedMarkdown from '../Common/TaggedMarkdown';
import { Item } from "../Basic/dto";

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

const ItemCard: React.FC<ItemCardProps> = ({
	item,
	showDeleteModal,
	getFirstNonEmptyLine = (content: string) => content.split('\n')[0],
	onClick,
	selected,
	showPreview = true,
	showActions = true,
	indentHeadings = true
}) => {
	const cardContent = (
		<Card
			size="small"
			title={<TaggedMarkdown mode={indentHeadings ? 'heading' : 'tag'}>{getFirstNonEmptyLine(item.content)}</TaggedMarkdown>}
			extra={<small>{item.type}</small>}
			actions={showActions ? [
				<Link to={`/items/${item.id}`}>详情</Link>,
				showDeleteModal && <Button type="link" danger onClick={() => showDeleteModal(item)}>删除</Button>
			].filter(Boolean) : undefined}
			style={{ marginBottom: '8px' }}
			className={`item-card ${selected ? 'selected' : ''}`}
			onClick={onClick}
		>
			{showPreview && (
				<div className="item-preview-container">
					<TaggedMarkdown mode={indentHeadings ? 'heading' : 'tag'}>
						{item.content.split('\n').slice(1,3).join('\n')}
					</TaggedMarkdown>
					{item.content.split('\n').length > 4 && <Text type="secondary">...</Text>}
				</div>
			)}
		</Card>
	);

	return showPreview ? (
		<Tooltip title={<TaggedMarkdown mode={indentHeadings ? 'heading' : 'tag'}>{item.content}</TaggedMarkdown>}>
			{cardContent}
		</Tooltip>
	) : cardContent;
};

export default ItemCard;
import React from 'react';
import { Card, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const { Text } = Typography;

interface ItemCardProps {
  item: {
    id: string;
    content: string;
    type: string;
  };
  customRenderers: any;
  showDeleteModal: (item: any) => void;
  getFirstNonEmptyLine: (content: string) => string;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, customRenderers, showDeleteModal, getFirstNonEmptyLine }) => {
  return (
    <Card size="small"
            title={<ReactMarkdown components={customRenderers}>{getFirstNonEmptyLine(item.content)}</ReactMarkdown>}
            extra={<small>{item.type}</small>}
            actions={[
                <Link to={`/items/${item.id}`}>详情</Link>,
                <Button type="link" danger onClick={() => showDeleteModal(item)}>删除</Button>
            ]}
            style={{ marginBottom: '8px' }}
        >
            <ReactMarkdown components={customRenderers}>
                {item.content.split('\n').slice(1,3).join('\n')}
            </ReactMarkdown>
            {item.content.split('\n').length > 4 && <Text type="secondary">...</Text>}
        </Card>
  );
};

export default ItemCard;
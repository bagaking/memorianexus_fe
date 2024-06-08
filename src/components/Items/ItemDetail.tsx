import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {Card, Spin, Button, message} from 'antd';
import { getItemDetail } from '../../api/items';

interface Item {
    id: string;
    content: string;
    type: string;
}

const ItemDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                if (!id) {
                    message.error('invalid ID');
                    return
                }
                const response = await getItemDetail(id);
                const data = response.data.data
                setItem(data);
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch item details');
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    if (loading) {
        return <Spin />;
    }

    if (!item) {
        return <div>Item not found</div>;
    }

    return (
        <Card title={`Item: ${item.id}`}>
            <p>{item.content}</p>
            <p>Type: {item.type}</p>
            <Link to={`/items/${item.id}/edit`}>
                <Button type="primary">Edit</Button>
            </Link>
        </Card>
    );
};

export default ItemDetail;
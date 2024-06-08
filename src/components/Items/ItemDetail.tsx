import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {Card, Spin, Button, message} from 'antd';
import { getItemDetail } from '../../api/items';
import {ArrowLeftOutlined} from "@ant-design/icons";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";

interface Item {
    id: string;
    content: string;
    type: string;
}

const ItemDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
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
        <div>
            <Button type="link" onClick={() => navigate('/items')} style={{ marginBottom: '16px' }}>
                <ArrowLeftOutlined /> Back
            </Button>

            <Card title={`Item: ${item.id}`}>
                <ReactMarkdown className="markdown-content">{item.content}</ReactMarkdown>
                <br/>
                <p>Type: {item.type}</p>
                <Link to={`/items/${item.id}/edit`}>
                    <Button type="primary">Edit</Button>
                </Link>
            </Card>
        </div>
    );
};

export default ItemDetail;
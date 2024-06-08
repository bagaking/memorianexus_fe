import React, { useEffect, useState } from 'react';
import { Table, message, Button, Card } from 'antd';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getItems } from '../../api/items';

interface Item {
    id: string;
    content: string;
    type: string;
}

const ItemList: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>([]);

    const fetchItems = async () => {
        try {
            const response = await getItems();
            const data = response.data.data;
            if (Array.isArray(data)) {
                setItems(data);
            } else {
                console.log("items resp", response);
                message.error('Invalid items data format');
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch items');
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleExpand = (record: Item) => {
        setExpandedRowKeys(prevKeys =>
            prevKeys.includes(record.id) ? prevKeys.filter(key => key !== record.id) : [record.id]
        );
    };

    const getFirstNonEmptyLine = (content: string) => {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        return lines.length > 0 ? lines[0] : '';
    };

    const columns = [
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            render: (text: string) => <ReactMarkdown className="markdown-content">{getFirstNonEmptyLine(text).replace("#", "")}</ReactMarkdown>,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Item) => (
                <Button type="primary">
                    <Link to={`/items/${record.id}/edit`}>Edit</Link>
                </Button>
            ),
        },
    ];

    const expandedRowRender = (record: Item) => (
        <Card
            key={record.id}
            style={{ margin: '-17px', borderRadius: '0px 0px 8px 8px ' }}
            // title=
        >
            <ReactMarkdown className="markdown-content">{record.content}</ReactMarkdown>
            <br/>
            {record.type}
        </Card>
    );

    return (
        <div>
            <h2>Items</h2>
            <Button type="primary" style={{ marginBottom: '16px' }}>
                <Link to="/items/new/edit">Create Item</Link>
            </Button>
            <Table
                columns={columns}
                dataSource={items}
                rowKey="id"
                expandedRowKeys={expandedRowKeys}
                onRow={(record) => ({
                    onClick: () => handleExpand(record),
                })}
                expandable={{ expandedRowRender }}
            />
        </div>
    );
};

export default ItemList;
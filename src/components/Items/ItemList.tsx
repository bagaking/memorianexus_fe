import React, { useEffect, useState } from 'react';
import {List, message} from 'antd';
import { getItems } from '../../api/items';

interface Item {
    id: string;
    content: string;
    type: string;
}

const ItemList: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await getItems();
                const data = response.data.data
                if (Array.isArray(data)) {
                    setItems(data);
                } else {
                    // throw new Error('Invalid data format');
                    console.log("items resp", response)
                    message.error('Invalid items data format');
                }
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch items');
            }
        };

        fetchItems();
    }, []);

    return (
        <div>
            <h2>Items</h2>
            <List
                itemLayout="horizontal"
                dataSource={items}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            title={<a href={`/items/${item.id}`}>{item.content}</a>}
                            description={`Type: ${item.type}`}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default ItemList;
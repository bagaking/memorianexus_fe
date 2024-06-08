import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import { getItemDetail, updateItem } from '../../api/items';

interface Item {
    id: string;
    content: string;
    type: string;
}

const EditItem: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [item, setItem] = useState<Item | null>(null);
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                if (!id) {
                    message.error('Invalid ID');
                    return
                }
                const response = await getItemDetail(id);
                const data = response.data.data
                setItem(data);
                setMarkdown(data.content);
                form.setFieldsValue(data);
            } catch (error) {
                console.error(error);
                message.error('Failed to edit item details');
            }
        };

        fetchItem();
    }, [id, form]);

    const handleEditorChange = ({ text }: { text: string }) => {
        setMarkdown(text);
    };

    const handleSubmit = async (values: Item) => {
        try {
            if (!id) {
                message.error('Invalid ID');
                return
            }
            await updateItem(id, { ...values, content: markdown });
            message.success('Item updated successfully');
        } catch (error) {
            console.error(error);
            message.error('Failed to update item');
        }
    };

    if (!item) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Edit Item</h2>
            <Form form={form} onFinish={handleSubmit}>
                <Form.Item name="type" rules={[{ required: true, message: 'Please input the item type!' }]}>
                    <Input placeholder="Type" />
                </Form.Item>
                <Form.Item>
                    <MdEditor
                        value={markdown}
                        style={{ height: '500px', width: "100%" }}
                        renderHTML={(text) => new MarkdownIt().render(text)}
                        onChange={handleEditorChange}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditItem;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Select, message, Modal } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import { getItemDetail, updateItem, createItem, deleteItem } from '../../api/items';

interface Item {
    id?: string;
    content: string;
    type: string;
    book_ids?: number[];
    tags?: string[];
}

const { Option } = Select;

const EditItem: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [item, setItem] = useState<Item | null>(null);
    const [markdown, setMarkdown] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                if (id && id !== "new") {
                    const response = await getItemDetail(id);
                    const data = response.data.data;
                    setItem(data);
                    setMarkdown(data.content);
                    form.setFieldsValue(data);
                } else {
                    setItem({ content: '', type: '' });
                }
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch item details');
            }
        };

        fetchItem();
    }, [id, form]);

    const handleEditorChange = ({ text }: { text: string }) => {
        setMarkdown(text);
    };

    const handleSubmit = async (values: Item) => {
        try {
            if (id && id !== "new") {
                await updateItem(id, { ...values, content: markdown });
                message.success('Item updated successfully');
            } else {
                await createItem({ ...values, content: markdown });
                message.success('Item created successfully');
            }
            navigate('/items');
        } catch (error) {
            console.error(error);
            message.error(`Failed to ${id && id !== "new" ? 'update' : 'create'} item`);
        }
    };

    const showDeleteModal = () => {
        setDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            if (id) {
                await deleteItem(id);
                message.success('Item deleted successfully');
                navigate('/items');
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to delete item');
        } finally {
            setDeleteModalVisible(false);
        }
    };

    if (!item) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Button type="link" onClick={() => navigate('/items')} style={{ marginBottom: '16px' }}>
                <ArrowLeftOutlined /> Back
            </Button>
            <h2>{(id && id !== 'new') ? 'Edit Item' : 'Create Item'}</h2>
            <Form form={form} onFinish={handleSubmit}>
                <Form.Item name="type" rules={[{ required: true, message: 'Please select the item type!' }]}>
                    <Select placeholder="Select a type">
                        <Option value="flashcard">Flashcard</Option>
                        <Option value="multiple_choice">Multiple Choice</Option>
                        <Option value="fill_in_the_blank">Fill in the Blank</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="book_ids">
                    <Input placeholder="Book IDs (comma separated)" />
                </Form.Item>
                <Form.Item name="tags">
                    <Input placeholder="Tags (comma separated)" />
                </Form.Item>
                <Form.Item>
                    <MdEditor
                        value={markdown}
                        style={{ height: '480px', width: "100%" }}
                        renderHTML={(text) => new MarkdownIt().render(text)}
                        onChange={handleEditorChange}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Save</Button>
                    {id && id !== 'new' && (
                        <Button type="primary" danger onClick={showDeleteModal} style={{ marginLeft: '8px' }}>
                            Delete
                        </Button>
                    )}
                </Form.Item>
            </Form>
            <Modal
                title="Confirm Deletion"
                visible={deleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setDeleteModalVisible(false)}
            >
                <p>Are you sure you want to delete this item?</p>
            </Modal>
        </div>
    );
};

export default EditItem;
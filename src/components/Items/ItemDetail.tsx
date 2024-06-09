// src/components/Items/ItemDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, message } from 'antd';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import { getItemDetail, updateItem, createItem, deleteItem } from '../../api/items';
import { PageLayout } from '../Common/PageLayout';
import { TypeField, BookIdsField, TagsField } from '../Common/FormFields';
import { ActionButtons } from '../Common/ActionButtons';
import { DeleteModal } from '../Common/DeleteModal';
import '../Common/CommonStyles.css';

interface Item {
    id?: string;
    content: string;
    type: string;
    book_ids?: number[];
    tags?: string[];
}

const ItemDetail: React.FC = () => {
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
        <PageLayout title={(id && id !== 'new') ? `Edit Item (id: ${id})` : 'Create Item'} backUrl="/items" icon="/item_icon.png">
            <Form form={form} onFinish={handleSubmit}>
                <TypeField />
                <BookIdsField />
                <TagsField />
                <Form.Item>
                    <MdEditor
                        value={markdown}
                        style={{ height: '480px', width: "100%" }}
                        renderHTML={(text) => new MarkdownIt().render(text)}
                        onChange={handleEditorChange}
                    />
                </Form.Item>
                <ActionButtons isEditMode={!!id && id !== 'new'} onDelete={showDeleteModal} />
            </Form>
            <DeleteModal visible={deleteModalVisible} onConfirm={handleDelete} onCancel={() => setDeleteModalVisible(false)} />
        </PageLayout>
    );
};

export default ItemDetail;
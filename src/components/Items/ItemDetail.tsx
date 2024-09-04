// src/components/Items/ItemDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Spin, Tag, Space, Tooltip } from 'antd';
import { getItemById, updateItem, deleteItem, createItem } from '../../api';
import { DeleteModal } from '../Common/DeleteModal';
import CopyableID from '../Common/CopyableID';
import { DEFAULT_ITEM, Item } from "../../api";
import '../Common/CommonStyles.css';
import './ItemDetail.less';
import RecordButton from '../Common/RecordButton';
import { PageLayout } from '../Layout/PageLayout';
import { BookIdsField, MarkdownField, TypeField } from '../Common/FormFields';
import { EditableTagField } from '../Common/EditableTagGroup';
import { ActionButtons } from '../Common/ActionButtons';

const ItemDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [item, setItem] = useState<Item | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [transcription, setTranscription] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                if (id && id !== "new") {
                    const response = await getItemById(id);
                    const data = response.data.data;
                    setItem(data);
                    form.setFieldsValue(data);
                } else {
                    setItem(DEFAULT_ITEM);
                    form.resetFields();
                }
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch item details');
            }
        };

        fetchItem();
    }, [id, form]);

    const handleSubmit = async (values: Item) => {
        try {
            if (id && id !== "new") {
                await updateItem(id, values);
                message.success('Item updated successfully');
            } else {
                await createItem(values);
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

    const handleRecord = (isRecording: boolean) => {
        console.log('Recording status:', isRecording);
    };

    const handleAudioStop = (audioBlob: Blob) => {
        console.log('Audio recording stopped:', audioBlob);
        // 这里可以添加将音频发送到后端进行处理的逻辑
    };

    const handleTranscript = (transcript: string) => {
        setTranscription(prevTranscript => prevTranscript + ' ' + transcript);
        form.setFieldsValue({ content: form.getFieldValue('content') + ' ' + transcript });
    };

    const handleError = (error: string) => {
        message.error(`录音错误: ${error}`);
    };

    if (!item) {
        return <div>Loading...</div>;
    }

    return (
        <PageLayout title='Item Detail' 
            // backUrl="/items" 
            icon="/layout/item_icon.png">
            <div className="item-detail-container">
                {(id && id !== 'new') && (
                    <div className="title-container">
                        <h1>{(id && id !== 'new') ? 'Edit Item' : 'Create Item'}</h1>
                        <div className="id-container">
                            <CopyableID id={id} tooltipTitle="Copy Item ID" showBackground={false} />
                        </div>
                    </div>
                )}
                <Form form={form} onFinish={handleSubmit} initialValues={item} className="item-detail-content">
                    <Tooltip title="Enter the content for your item">
                        <div className="pulse-animation">
                            <MarkdownField
                                name="content"
                                placeholder="Enter your item content here..."
                                rules={[{ required: true, message: 'Please enter the content!' }]}
                            />
                        </div>
                    </Tooltip>
                    <div className="item-meta-container">
                        <Tooltip title="Add tags to categorize your item">
                            <div className="tag-container">
                                <EditableTagField name="tags" />
                            </div>
                        </Tooltip>
                        <Tooltip title="Select the type of your item">
                            <div className="type-container">
                                <TypeField />
                            </div>
                        </Tooltip>
                        <Tooltip title="Enter the book IDs this item belongs to">
                            <div className="book-ids-container">
                                <BookIdsField />
                            </div>
                        </Tooltip>
                    </div>
                    <div className="action-buttons-container">
                        <ActionButtons isEditMode={!!id && id !== 'new'} onDelete={showDeleteModal} />
                    </div>
                </Form>
                <RecordButton
                    onRecord={handleRecord}
                    onAudioStop={handleAudioStop}
                    onTranscript={handleTranscript}
                    onError={handleError}
                    position="right"
                    dragBounds={{ top: 0, right: window.innerWidth, bottom: window.innerHeight, left: 0 }}
                />
            </div>
            <DeleteModal
                visible={deleteModalVisible}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalVisible(false)}
            />
        </PageLayout>
    );
};

export default ItemDetail;
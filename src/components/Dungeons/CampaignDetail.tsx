import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, } from 'react-router-dom';
import { Form, Input, Button, message, Modal } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {getDungeonDetail, updateDungeon, deleteDungeon, createCampaign} from '../../api/dungeons';

interface Dungeon {
    id?: string;
    title: string;
    description: string;
    rule: string;
    books?: number[];
    items?: number[];
    tag_names?: string[]
}

const CampaignDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [dungeon, setDungeon] = useState<Dungeon | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    useEffect(() => {
        const fetchDungeon = async () => {
            try {
                if (id && id !== "new") {
                    const response = await getDungeonDetail(id);
                    const data = response.data.data;
                    setDungeon(data);
                    form.setFieldsValue(data);
                } else {
                    setDungeon({
                        title: '',
                        description: '',
                        rule: ''
                    });
                }
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch campaign details');
            }
        };

        fetchDungeon();
    }, [id, form]);

    const handleSubmit = async (values: Dungeon) => {
        try {
            if (id && id !== "new") {
                await updateDungeon(id, values);
                message.success('campaign updated successfully');
            } else {
                await createCampaign(values);
                message.success('campaign created successfully');
            }
            navigate('/campaigns');
        } catch (error) {
            console.error(error);
            message.error(`Failed to ${id && id !== "new" ? 'update' : 'create'} campaigns`);
        }
    };

    const showDeleteModal = () => {
        setDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            if (id) {
                await deleteDungeon(id);
                message.success('Campaign deleted successfully');
                navigate('/campaigns');
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to delete dungeon');
        } finally {
            setDeleteModalVisible(false);
        }
    };

    if (!dungeon) {
        return <div>CAMPAIGN Loading...</div>;
    }

    return (
        <div>
            <Button type="link" onClick={() => navigate('/campaigns')} style={{ marginBottom: '16px' }}>
                <ArrowLeftOutlined /> Back
            </Button>
            <h2>{(id && id !== 'new') ? (`Edit Campaign (id: ${id})` ) : 'Create Campaign'}</h2>
            <Form form={form} onFinish={handleSubmit}>
                <Form.Item name="title" rules={[{ required: true, message: 'Please enter the name!' }]}>
                    <Input placeholder="Title" />
                </Form.Item>
                <Form.Item name="description" rules={[{ required: true, message: 'Please enter the description!' }]}>
                    <Input.TextArea placeholder="Description" rows={4} />
                </Form.Item>
                <Form.Item name="tags">
                    <Input placeholder="Tags (comma separated)" />
                </Form.Item>
                <Form.Item name="book_ids">
                    <Input placeholder="Books (comma separated)" />
                </Form.Item>
                <Form.Item name="item_ids">
                    <Input placeholder="Items (comma separated)" />
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
                <p>Are you sure you want to delete this dungeon?</p>
            </Modal>
        </div>
    );
};

export default CampaignDetail;
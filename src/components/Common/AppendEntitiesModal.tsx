import React, { useState, useEffect } from 'react';
import {Modal, Form, Input, Button, List, Table, Pagination, Tooltip, Card} from 'antd';
import Markdown from "react-markdown";

interface AppendEntitiesModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (entityIds: string[]) => void;
    fetchEntities?: (page: number) => Promise<{ entities: any[], total: number, offset?: number, limit?: number }>;
}

const AppendEntitiesModal: React.FC<AppendEntitiesModalProps> = ({ visible, onCancel, onSubmit, fetchEntities }) => {
    const [form] = Form.useForm();
    const [entities, setEntities] = useState<string[]>([]);
    const [newEntity, setNewEntity] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalEntities, setTotalEntities] = useState<number>(0);

    useEffect(() => {
        if (visible && fetchEntities) {
            fetchEntities(currentPage).then(response => {
                console.log("fetchEntities(currentPage)", response);
                setSearchResults(response.entities);
                setTotalEntities(response.total);
            });
        }
    }, [visible, currentPage, fetchEntities]);

    const handleAddEntity = () => {
        if (newEntity.trim()) {
            setEntities([...entities, newEntity.trim()]);
            setNewEntity('');
        }
    };

    const handleRemoveEntity = (entity: string) => {
        setEntities(entities.filter(e => e !== entity));
    };

    const handleFinish = () => {
        onSubmit(entities);
        setEntities([]);
        form.resetFields();
    };

    const handleAddFromSearch = (entityId: string) => {
        if (!entities.includes(entityId)) {
            setEntities([...entities, entityId]);
        }
    };

    return (
        <Modal title="Append Entities" visible={visible} onCancel={onCancel} footer={null}>
            <Form form={form} onFinish={handleFinish}>
                <Form.Item>
                    <Input
                        value={newEntity}
                        onChange={e => setNewEntity(e.target.value)}
                        placeholder="Enter entity ID"
                        onPressEnter={handleAddEntity}
                    />

                    <Button type="dashed" onClick={handleAddEntity} style={{ marginTop: 8 }}>
                        Add Entity
                    </Button>
                </Form.Item>
                <List
                    size="small"
                    dataSource={entities}
                    renderItem={entity => (
                        <List.Item actions={[<Button type="link" danger onClick={() => handleRemoveEntity(entity)}>Remove</Button>]}>
                            <Tooltip color="blue" title={<Markdown>{searchResults.find(x=>x.id === entity)?.content}</Markdown>}>{entity}</Tooltip>
                        </List.Item>
                    )}
                />
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>

            {fetchEntities && (
                <>
                    <h3>Search Results</h3>
                    <Table size="small" dataSource={searchResults} columns={[
                            { title: 'ID', dataIndex: 'id', key: 'id' },
                            { title: 'Name', dataIndex: 'content', key: 'name' },
                            {
                                title: 'Action',
                                key: 'action',
                                render: (text, record) => <Button type="link" onClick={() => handleAddFromSearch(record.id)} disabled={entities.includes(record.id)}>Add</Button>,
                            },
                        ]}
                        pagination={false}
                        rowKey="id"
                    />
                    <Pagination current={currentPage} total={totalEntities} onChange={page => setCurrentPage(page)} style={{ marginTop: 16, textAlign: 'right' }}/>
                </>
            )}
        </Modal>
    );
};

export default AppendEntitiesModal;
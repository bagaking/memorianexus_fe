import React, { useState, useEffect } from 'react';
import { Modal, Form, Table, Button, List, Input } from 'antd';
import { Key, RowSelectMethod, TableRowSelection } from "antd/es/table/interface";
import FirstLine from "./Firstline";
import PaginationComponent from "./PaginationComponent";

interface AppendEntitiesModalProps {
    title?: React.ReactNode
    footer?: React.ReactNode
    visible: boolean;
    onCancel: () => void;
    onSubmit: (entityIds: string[]) => void;
    fetchEntities?: (page: number, limit?: number) => Promise<{ entities: any[], total: number, offset?: number, limit?: number }>;
    defaultSelected?: string[];
    maxCount?: number; // 新增 maxCount 属性
}

export interface EntityModalDataModel{
    id: string
    content: string
}

const AppendEntitiesModal: React.FC<AppendEntitiesModalProps> = ({
                                                                     title, footer, visible,
                                                                     onCancel, onSubmit, fetchEntities,
                                                                     defaultSelected = [], maxCount
}) => {
    const [form] = Form.useForm();
    const [entities, setEntities] = useState<string[]>(defaultSelected);
    const [newEntity, setNewEntity] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalEntities, setTotalEntities] = useState<number | undefined>(0);
    const [reqLimit, setReqLimit] = useState<number>(10);

    useEffect(() => {
        if (visible && fetchEntities) {
            fetchEntities(currentPage, reqLimit).then(response => {
                setSearchResults(response.entities);
                setReqLimit(response.limit || 10);
                setTotalEntities(response.total);
            });
        }

    }, [visible, currentPage, fetchEntities]);

    useEffect(() => {
        if (visible) {
            // setEntities(defaultSelected); // 这句导致 Maximum update depth exceeded
            form.setFieldsValue({ entities: defaultSelected });
        }
    }, [visible, defaultSelected]);

    const handleAddEntity = () => {
        if (newEntity.trim() && !entities.includes(newEntity.trim()) && (!maxCount || entities.length < maxCount)) {
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
        if (!entities.includes(entityId) && (!maxCount || entities.length < maxCount)) {
            setEntities([...entities, entityId]);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'content',
            key: 'name',
            render: (text: string) => <FirstLine content={text}/>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: any) =>
                <Button type="link" onClick={() => handleAddFromSearch(record.id)} disabled={
                    !!(entities.includes(record.id) || (maxCount && entities.length >= maxCount))
                }>Add</Button>,
        },
    ];

    const rowSelection: TableRowSelection<any> = {
        selectedRowKeys: entities,
        onChange: (selectedRowKeys: Key[], selectedRows: any[], info: { type: RowSelectMethod }) => {
            setEntities(selectedRowKeys as string[]);
        },
    };

    function handlePageChange(page_: number){
        setCurrentPage(page_)
    }

    function handleLimitChange(limit_: number){
        setReqLimit(limit_)
        setCurrentPage(1); // 重置到第一页
    }
    return (
        <Modal title={title || "Append Entities"} visible={visible} onCancel={onCancel} footer={footer}>
            <Form form={form} onFinish={handleFinish}>
                <Form.Item>
                    <Input
                        value={newEntity}
                        onChange={e => setNewEntity(e.target.value)}
                        placeholder="Enter entity ID"
                        onPressEnter={handleAddEntity}
                        disabled={
                            !!(maxCount && entities.length >= maxCount)
                        } // 禁用输入框
                    />

                    <Button type="dashed" onClick={handleAddEntity} style={{ marginTop: 8 }} disabled={
                        !!(maxCount && entities.length >= maxCount)
                    }>
                        Add Entity
                    </Button>
                </Form.Item>
                <List
                    size="small"
                    dataSource={entities}
                    renderItem={entity => (
                        <List.Item actions={[<Button type="link" danger onClick={() => handleRemoveEntity(entity)}>Remove</Button>]}>
                            <FirstLine content={searchResults.find(x => x.id === entity)?.content} showName={entity}/>
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
                    <PaginationComponent
                        currentPage={currentPage}
                        limit={reqLimit}
                        totalItems={totalEntities}
                        pageDataLength={searchResults.length}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                        style={{ marginBottom: 6, textAlign: 'right' }}
                        size="small"
                    />
                    <Table
                        size="small"
                        dataSource={searchResults}
                        columns={columns}
                        pagination={false}
                        rowKey="id"
                        rowSelection={rowSelection}
                    />
                </>
            )}
        </Modal>
    );
};

export default AppendEntitiesModal;
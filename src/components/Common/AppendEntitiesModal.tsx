import React, { useState, useEffect } from 'react';
import { Modal, Form, Table, Button, List, Input, Space, Card } from 'antd';
import { Key, RowSelectMethod, TableRowSelection } from "antd/es/table/interface";
import FirstLine from "./Firstline";
import PaginationComponent from "./PaginationComponent";

interface AppendEntitiesModalProps {
    title?: React.ReactNode;
    footer?: React.ReactNode;
    visible: boolean;
    onCancel: () => void;
    onSubmit: (entityIds: string[]) => void;
    fetchEntities?: (page: number, limit: number, search?: string) => Promise<{ entities: any[], total: number, offset?: number, limit?: number }>;
    defaultSelected?: EntityModalDataModel[];
    maxCount?: number;
    enableSearch?: boolean;
}

export interface EntityModalDataModel {
    id: string;
    content: string;
}

const AppendEntitiesModal: React.FC<AppendEntitiesModalProps> = ({
                                                                     title, footer, visible,
                                                                     onCancel, onSubmit, fetchEntities,
                                                                     defaultSelected = [], maxCount, enableSearch
                                                                 }) => {
    const [form] = Form.useForm();
    const [entities, setEntities] = useState<EntityModalDataModel[]>(defaultSelected);
    const [newEntity, setNewEntity] = useState<string>('');
    const [searchResults, setSearchResults] = useState<EntityModalDataModel[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalEntities, setTotalEntities] = useState<number | undefined>(0);
    const [reqLimit, setReqLimit] = useState<number>(10);
    const [searchKeyword, setSearchKeyword] = useState<string>('');

    useEffect(() => {
        if (visible && fetchEntities) {
            fetchEntities(currentPage, reqLimit, searchKeyword).then(response => {
                setSearchResults(response.entities);
                setReqLimit(response.limit || 10);
                setTotalEntities(response.total);
            });
        }
    }, [visible, currentPage, fetchEntities, reqLimit, searchKeyword]);

    useEffect(() => {
        if (visible) {
            form.setFieldsValue({ entities: defaultSelected.map(item => item.id) });
        }
    }, [visible, defaultSelected]);

    const handleAddEntity = () => {
        if (newEntity.trim() && !entities.some(e => e.id === newEntity.trim()) && (!maxCount || entities.length < maxCount)) {
            setEntities([...entities, { id: newEntity.trim(), content: '' }]);
            setNewEntity('');
        }
    };

    const handleRemoveEntity = (entityId: string) => {
        setEntities(entities.filter(e => e.id !== entityId));
    };

    const handleFinish = () => {
        onSubmit(entities.map(e => e.id));
        setEntities([]);
        form.resetFields();
    };

    const handleAddFromSearch = (entity: EntityModalDataModel) => {
        if (!entities.some(e => e.id === entity.id) && (!maxCount || entities.length < maxCount)) {
            setEntities([...entities, entity]);
        }
    };

    const resetStatus = () => {
        setEntities(defaultSelected);
        setNewEntity('');
        setSearchResults([]);
        setCurrentPage(1);
        setTotalEntities(0);
        setReqLimit(10);
        setSearchKeyword('');
        form.resetFields();
        onCancel();
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
            render: (text: string) => <FirstLine content={text} />,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: EntityModalDataModel) =>
                <Button type="link" onClick={() => handleAddFromSearch(record)} disabled={
                    !!(entities.some(e => e.id === record.id) || (maxCount && entities.length >= maxCount))
                }>Add</Button>,
        },
    ];

    const rowSelection: TableRowSelection<any> = {
        selectedRowKeys: entities.map(e => e.id),
        onChange: (selectedRowKeys: Key[], selectedRows: any[], info: { type: RowSelectMethod }) => {
            const currentPageIds = searchResults.map(item => item.id);
            const newEntities = entities.filter(entity => !currentPageIds.includes(entity.id)); // Keep entities not on the current page

            selectedRows.forEach(row => {
                if (!newEntities.some(e => e.id === row.id)) {
                    newEntities.push(row);
                }
            });

            setEntities(newEntities);
        },
    };

    const handlePageChange = (page_: number) => {
        setCurrentPage(page_);
    };

    const handleLimitChange = (limit_: number) => {
        setReqLimit(limit_);
        setCurrentPage(1); // 重置到第一页
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value);
        setCurrentPage(1); // 重置到第一页
    };

    return (
        <Modal title={title || "Append Entities"} open={visible} onCancel={() => {
            resetStatus()
            onCancel && onCancel()
        }} footer={footer} width={960} >
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
                    grid={{ gutter: 2, column: 4 }}
                    dataSource={entities}
                    renderItem={entity => (
                        (() => {
                            const content = entity.content || searchResults.find(x => x.id === entity.id)?.content || "";
                            let title = content || "";
                            if (content.length > 16) {
                                title = content.substring(0, 13) + " ...";
                            }
                            return <List.Item>
                                <Card
                                    title={entity.id}
                                    size="small"
                                    extra={[<Button type="link" danger onClick={() => handleRemoveEntity(entity.id)}>Remove</Button>]}>
                                    <FirstLine content={content} showName={title} />
                                </Card>
                            </List.Item>
                        })()
                    )}
                />
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}> Submit </Button>
                </Form.Item>
            </Form>

            {fetchEntities && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>

                    <PaginationComponent
                        currentPage={currentPage}
                        limit={reqLimit}
                        totalItems={totalEntities}
                        pageDataLength={searchResults.length}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                        size="small"
                    />
                    {enableSearch && (
                        <Input.Search
                            placeholder="Search items"
                            onChange={handleSearch}
                            style={{ width: 200 }}
                        />
                    )}
                </div>
            )}
            {fetchEntities && (
                <Table
                    size="small"
                    dataSource={searchResults}
                    columns={columns}
                    pagination={false}
                    rowKey="id"
                    rowSelection={rowSelection}
                />
            )}
        </Modal>
    );
};

export default AppendEntitiesModal;
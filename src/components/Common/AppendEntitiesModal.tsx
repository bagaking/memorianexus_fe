import React, { useState, useEffect } from 'react';
import { Modal, Form, Table, Button, List, Input, Space, Card } from 'antd';
import { Key, RowSelectMethod, TableRowSelection } from "antd/es/table/interface";

import PaginationComponent from "./PaginationComponent";
import FirstLine from "./FirstLineMD";

interface AppendEntitiesModalProps {
    title?: React.ReactNode;
    footer?: React.ReactNode;
    visible: boolean;
    onCancel: () => void;
    onSubmit: (entityIds: string[]) => void;
    fetchEntities?: (page: number, limit: number, search?: string) => Promise<{ entities: any[], total: number, offset?: number, limit?: number }>;
    abortedItems?: EntityModalDataModel[];
    defaultSelection?: EntityModalDataModel[];
    maxCount?: number;
    enableSearch?: boolean;
    renderItem?: (item: any, selected: boolean, onSelect: () => void) => React.ReactNode;
}

export interface EntityModalDataModel {
    id: string;
    content: string;
}

const AppendEntitiesModal: React.FC<AppendEntitiesModalProps> = ({
                                                                     title, footer, visible,
                                                                     onCancel, onSubmit, fetchEntities,
                                                                     abortedItems = [], defaultSelection = [], maxCount, enableSearch,
                                                                     renderItem // 添加这个
                                                                 }) => {
    const [form] = Form.useForm();
    const [selectedEntities, setSelectedEntities] = useState<EntityModalDataModel[]>([...abortedItems]);
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
            form.setFieldsValue({ entities: [...defaultSelection] });
        }
    }, [visible, abortedItems]);

    const isIdAborted = (id: string) => abortedItems.some(e => e.id === id)

    const handleAddEntity = () => {
        if (newEntity.trim() && !selectedEntities.some(e => e.id === newEntity.trim()) && (!maxCount || selectedEntities.length < maxCount)) {
            setSelectedEntities([...selectedEntities, { id: newEntity.trim(), content: '' }]);
            setNewEntity('');
        }
    };

    const handleRemoveEntity = (entityId: string) => {
        setSelectedEntities(selectedEntities.filter(e => e.id !== entityId));
    };

    const handleFinish = () => {
        onSubmit(selectedEntities.map(e => e.id));
        setSelectedEntities([]);
        form.resetFields();
    };

    const handleAddFromSearch = (entity: EntityModalDataModel) => {
        if (!selectedEntities.some(e => e.id === entity.id) && (!maxCount || selectedEntities.length < maxCount)) {
            setSelectedEntities([...selectedEntities, entity]);
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
            render: (text: string, record: EntityModalDataModel) => 
                renderItem ? 
                    renderItem(record, selectedEntities.some(e => e.id === record.id), () => handleAddFromSearch(record)) : 
                    <FirstLine content={text} />,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: EntityModalDataModel) =>
                <Button type="link" onClick={() => handleAddFromSearch(record)} disabled={
                    !!(isIdAborted(record.id) || (maxCount && selectedEntities.length >= maxCount))
                }>Add</Button>,
        },
    ];

    const rowSelection: TableRowSelection<any> = {
        selectedRowKeys: selectedEntities.map(e => e.id),
        onChange: (selectedRowKeys: Key[], selectedRows: any[], info: { type: RowSelectMethod }) => {
            const currentPageIds = searchResults.map(item => item.id);
            // Keep selectedEntities not on the current page
            const appendEntities = selectedEntities.filter(entity => !currentPageIds.includes(entity.id));

            selectedRows.forEach(row => {
                if (!appendEntities.some(e => e.id === row.id)) {
                    appendEntities.push(row);
                }
            });

            setSelectedEntities(appendEntities.filter(e => !isIdAborted(e.id)));
        },
    };

    const handlePageChange = (page_: number) => {
        setCurrentPage(page_);
    };

    const handleLimitChange = (limit_: number) => {
        setReqLimit(limit_);
        setCurrentPage(1); // 重置到第一页
    };

    const handleSearch = (s: string) => {
        setSearchKeyword(s);
        setCurrentPage(1); // 重置到第一页
    };

    const handleCancelModal = () => {
        // console.log("handleCancelModal", abortedItems, defaultSelection)
        setSelectedEntities([...defaultSelection]);
        setNewEntity('');
        setSearchResults([]);
        setCurrentPage(1);
        setTotalEntities(0);
        setReqLimit(10);
        setSearchKeyword('');
        form.resetFields();
        onCancel && onCancel();
    };

    return (
        <Modal title={title || "Append Entities"} open={visible} onCancel={handleCancelModal} footer={footer} width={960} >
            <Form form={form} onFinish={handleFinish}>
                <Form.Item >
                        <Input
                            value={newEntity}
                            onChange={e => setNewEntity(e.target.value)}
                            placeholder="Enter entity ID"
                            onPressEnter={handleAddEntity}
                            disabled={
                                !!(maxCount && selectedEntities.length >= maxCount)
                            } // 禁用输入框
                        />
                        <Button type="dashed" onClick={handleAddEntity} style={{marginTop: 8}}
                                disabled={!!(maxCount && selectedEntities.length >= maxCount)}>
                            Add Entity
                        </Button>
                </Form.Item>
                <List
                    grid={{gutter: 2, column: 4}}
                    dataSource={
                        selectedEntities.filter(e => !isIdAborted(e.id))
                    }
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
                                    extra={[<Button type="link" danger onClick={() => handleRemoveEntity(entity.id)}>Rem</Button>]}>
                                    {renderItem ? 
                                        renderItem(entity, true, () => {}) : 
                                        <FirstLine content={content} showName={title} />
                                    }
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
                            // onChange={handleSearch}
                            onSearch={handleSearch}
                            style={{ width: 120 }}
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
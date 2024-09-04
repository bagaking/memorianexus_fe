import React, { useEffect, useState } from 'react';
import { message, Button, Switch, List, Space } from 'antd';
import PaginationComponent from '../Common/PaginationComponent';
import AppendEntitiesModal from '../Common/AppendEntitiesModal';
import { ColumnsType } from "antd/es/table";
import { ListGridType } from "antd/es/list";
import { useWindowSize } from '../../hooks/useWindowSize';
import styled, { keyframes, css } from 'styled-components';
import ItemTable from './ItemTable';

interface EmbedItemPackProps<T> {
    fetchItems: (page: number, limit: number) => Promise<{ entities: T[], total: number, offset?: number, limit?: number, error?: string }>;

    // for mod items
    deleteItems?: (entityIds: string[]) => Promise<void>;

    fetchItemsToAdd: (page: number, limit: number, search?: string) => Promise<{ entities: T[], total: number, offset?: number, limit?: number }>;
    enableSearchWhenAdd?: boolean
    addItems?: (entityIds: string[]) => Promise<void>;

    // for card select & table index
    rowKey: string,

    // for table
    itemsColumns?: ColumnsType<T>;

    // for card list
    renderItem?: (item: T, selected: boolean, onSelect: () => void) => React.ReactNode;
    grid?: ListGridType,

    // 新增：自定义控制面板
    customControlPanel?: React.ReactNode;
}

const Container = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #8ac4ff 0%, #1f67b0 100%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  color: #ecf0f1;

  &:hover {
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
  }
`;

const ControlPanel = styled(Space)`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #3498db, #2980b9);
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  color: #ffffff; // 确保按钮文字为白色

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const DeleteButton = styled(StyledButton)`
  background: linear-gradient(45deg, #e74c3c, #c0392b);
`;

const StyledSwitch = styled(Switch)`
  &.ant-switch-checked {
    background: linear-gradient(45deg, #2ecc71, #27ae60);
  }
  
  &.ant-switch {
    background-color: #bdc3c7;
  }

  .ant-switch-handle::before {
    background-color: #ecf0f1;
  }
`;

const borderAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const StyledListItem = styled(List.Item)<{ $selected: boolean }>`
  position: relative;
  transition: all 0.3s ease;
  border-radius: 10px;
  overflow: hidden;
  background: ${props => props.$selected ? 'rgba(46, 204, 113, 0.2)' : 'transparent'};
  color: #ecf0f1; // 确保列表项文字颜色适合深色背景

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: ${props => props.$selected ? 
      'linear-gradient(45deg, #2ecc71, #3498db, #2ecc71, #3498db)' : 
      'transparent'};
    background-size: 400% 400%;
    z-index: -1;
    animation: ${props => props.$selected ? css`${borderAnimation} 3s ease infinite` : 'none'};
  }

  ${props => props.$selected && `
    transform: scale(1.02);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    background-color: rgba(52, 152, 219, 0.2);
  }
`;

const StyledPagination = styled(PaginationComponent)`
  .ant-pagination-item,
  .ant-pagination-prev,
  .ant-pagination-next,
  .ant-pagination-jump-prev,
  .ant-pagination-jump-next {
    background-color: #34495e;
    border-color: #2c3e50;
    a {
      color: #ecf0f1;
    }
    &:hover {
      border-color: #3498db;
      a {
        color: #3498db;
      }
    }
  }

  .ant-pagination-item-active {
    background-color: #3498db;
    border-color: #3498db;
    a {
      color: #ffffff;
    }
  }

  .ant-select-selector {
    background-color: #34495e !important;
    color: #ecf0f1 !important;
    border-color: #2c3e50 !important;
  }

  .ant-select-arrow {
    color: #ecf0f1;
  }

  .ant-pagination-options {
    .ant-select-dropdown {
      background-color: #34495e;
      .ant-select-item {
        color: #ecf0f1;
        &:hover {
          background-color: #3498db;
        }
      }
      .ant-select-item-option-selected {
        background-color: #2980b9;
      }
    }
  }

  .ant-pagination-total-text {
    color: #ecf0f1;
  }
`;

const EmbedItemPack = <T extends Record<string, any>>({
    fetchItems,
    fetchItemsToAdd,
    enableSearchWhenAdd,
    addItems,
    deleteItems,
    itemsColumns,
    renderItem,
    rowKey,
    grid,
    customControlPanel,
}: EmbedItemPackProps<T>) => {
    const [items, setItems] = useState<T[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    const [currentItemsPage, setCurrentItemsPage] = useState(1);
    const [currentItemLimit, setCurrentItemLimit] = useState(10);
    const [addEntitiesModalVisible, setAddEntitiesModalVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

    const { width } = useWindowSize();
    const isMobile = width <= 767; // 假设移动设备的断点是 767px

    const responsiveGrid: ListGridType = isMobile
        ? { gutter: 16, column: 1 } // 移动设备上使用单列布局
        : grid || { gutter: 12, column: 5 }; // 桌面设备使用传入的 grid 或默认值

    const doFetch = async () => {
        setLoading(true);
        try {
            const response = await fetchItems(currentItemsPage, currentItemLimit);
            if (!!response.error) {
                message.error('invalid items data, ' + response.error);
            }
            setItems(response.entities);
            const data = response.entities;
            if (Array.isArray(data)) {
                if (!!response.total) {
                    setTotalItems(response.total);
                }
            } else {
                message.error('Invalid items data format');
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch items, err= ' + error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        doFetch();
    }, [currentItemsPage, currentItemLimit]);

    const handleItemsPageChange = (page: number) => {
        setCurrentItemsPage(page);
    };

    const handleLimitChange = (newLimit: number) => {
        setCurrentItemLimit(newLimit);
        setCurrentItemsPage(1); // 重置到第一页
    };

    const showAddEntitiesModal = () => {
        setAddEntitiesModalVisible(true);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const handleDeleteEntities = async () => {
        if (!deleteItems) return;
        const selectedIds = selectedRowKeys.map(key => key.toString());
        try {
            await deleteItems(selectedIds);
            message.success('items delete successfully');
            doFetch();
        } catch (error) {
            message.error('Failed to delete items');
        }
    };

    const handleAddEntitiesSubmit = async (selectedIds: string[]) => {
        if (!addItems) return;
        try {
            await addItems(selectedIds);
            message.success('Items added successfully');
            setAddEntitiesModalVisible(false);
            doFetch();
        } catch (error) {
            message.error('Failed to add items');
        }
    };

    const fetchCandidateEntities = async (page: number, limit: number, search?: string) => {
        const response = await fetchItemsToAdd(page, limit, search);
        return {
            entities: response.entities,
            total: response.total,
            offset: response.offset,
            limit: response.limit,
        };
    };

    const handleCardSelect = (id: string) => {
        const newSelectedRowKeys = selectedRowKeys.includes(id)
            ? selectedRowKeys.filter(key => key !== id)
            : [...selectedRowKeys, id];
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const renderContent = () => {
        if (isMobile || viewMode === 'grid') {
            return (
                <List
                    grid={responsiveGrid}
                    dataSource={items}
                    renderItem={item => {
                        const isSelected = selectedRowKeys.includes(item[rowKey]);
                        return (
                            <StyledListItem $selected={isSelected}>
                                {renderItem && renderItem(
                                    {
                                        ...item,
                                        content: item.content || item['description'] || '',  // 确保 content 属性存在，如果没有 content 则使用 description
                                        type: item.type || '',        // 确保 type 属性存在
                                        id: item[rowKey] || item['id'] || '',       // 确保 id 属性存在
                                    },
                                    isSelected,
                                    () => handleCardSelect(item[rowKey]),
                                )}
                            </StyledListItem>
                        );
                    }}
                />
            );
        } else {
            return (
                <ItemTable<T>
                    items={items}
                    columns={itemsColumns || []}
                    loading={loading}
                    rowSelection={rowSelection}
                    rowKey={rowKey}
                    onRow={(record) => ({
                        onClick: () => handleCardSelect(record[rowKey]),
                    })}
                />
            );
        }
    };

    return (
        <Container>
            <ControlPanel>
                <Space>
                    {customControlPanel}
                    {addItems && (
                        <StyledButton type="primary" onClick={showAddEntitiesModal}>
                            Add Items
                        </StyledButton>
                    )}
                    {deleteItems && (
                        <DeleteButton type="primary" danger onClick={handleDeleteEntities} disabled={!selectedRowKeys.length}>
                            Delete Selected ({selectedRowKeys.length})
                        </DeleteButton>
                    )}
                </Space>

                {!isMobile && (
                    <StyledSwitch
                        checkedChildren="Grid"
                        unCheckedChildren="Table"
                        checked={viewMode === 'grid'}
                        onChange={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                    />
                )}
            </ControlPanel>

            <StyledPagination
                currentPage={currentItemsPage}
                totalItems={totalItems}
                pageDataLength={items.length}
                limit={currentItemLimit}
                onPageChange={handleItemsPageChange}
                onLimitChange={handleLimitChange}
            />
            
            {renderContent()}

            <AppendEntitiesModal
                title={"选择要添加的 items"}
                visible={addEntitiesModalVisible}
                onCancel={() => setAddEntitiesModalVisible(false)}
                onSubmit={handleAddEntitiesSubmit}
                fetchEntities={fetchCandidateEntities}
                enableSearch={enableSearchWhenAdd || false}
            />
        </Container>
    );
};

export default EmbedItemPack;
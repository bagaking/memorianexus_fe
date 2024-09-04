import React from 'react';
import { Table } from 'antd';
import styled from 'styled-components';
import { ColumnsType } from 'antd/es/table';
import CopyableID from '../Common/CopyableID'; 

import { ItemID, TypeTag, DifficultyImportance, ItemContent } from './ItemComponents';

const CompactTable = styled(Table)`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 8px 12px;
    font-size: 14px;
    color: #ecf0f1;
    vertical-align: middle; // 确保所有单元格垂直居中
  }

  .ant-table-thead > tr > th {
    background-color: #2c3e50;
    color: #ecf0f1;
  }

  .ant-table-tbody > tr {
    transition: all 0.3s ease;
    &:hover {
      background-color: rgba(52, 152, 219, 0.2);
    }
  }

  .ant-table-tbody>tr>td {
    color: #333;
  }

  .ant-table-row-selected {
    background-color: rgba(46, 204, 113, 0.2);
  }

  .ant-table-cell-row-hover {
    background-color: rgba(52, 152, 219, 0.2) !important;
  }

  .ant-checkbox-wrapper {
    .ant-checkbox-inner {
      background-color: #34495e;
      border-color: #7f8c8d;
    }
    .ant-checkbox-checked .ant-checkbox-inner {
      background-color: #2ecc71;
      border-color: #2ecc71;
    }
  }

  // 新增：确保 Type 和 Difficulty & Importance 列的内容居中
  .type-column,
  .difficulty-importance-column {
    text-align: center;
  }

  // 新增：调整 Type 标签的样式
  .type-tag {
    margin: 0;
    padding: 2px 4px;
    font-size: 12px;
  }

  // 新增：调整 Difficulty & Importance 图标的样式
  .difficulty-importance-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
` as typeof Table;

export const TableRow = styled.tr`
  height: 32px;
  &:hover {
    background-color: #f5f5f5;
  }
`;

export const TableCell = styled.td`
  padding: 2px 8px;
  vertical-align: middle;
  font-size: 12px;
`;

interface ItemTableProps<T> {
  items: T[];
  rowKey: string;
  columns: ColumnsType<T>;
  loading: boolean;
  rowSelection?: any;
  expandable?: any;
  onRow?: (record: T) => any;
}

function ItemTable<T extends Record<string, any>>({ 
  items, 
  columns, 
  loading, 
  rowSelection, 
  expandable, 
  rowKey='id', 
  onRow 
}: ItemTableProps<T>) {
  const modifiedColumns = columns.map(column => {
    switch (column.key) {
      case 'id':
      case rowKey:
        return {
          ...column,
          render: (id: string) => <ItemID id={id} />,
        };
      case 'type':
        return {
          ...column,
          className: 'type-column',
          render: (type: string) => <TypeTag color="cyan">{type}</TypeTag>,
        };
      case 'difficultyImportance':
        return {
          ...column,
          className: 'difficulty-importance-column',
          render: (_: any, record: T) => (
            <div className="difficulty-importance-wrapper">
              <DifficultyImportance difficulty={record.difficulty} importance={record.importance} />
            </div>
          ),
        };
      case 'creator_id':
        return {
          ...column,
          render: (creatorId: string) => (
            <CopyableID 
              id={creatorId} 
              maxWidth={80}
              showBackground={false} 
              tooltipTitle="点击复制 Creator ID"
            />
          ),
        };
      case 'content':
        return {
          ...column,
          render: (text: string, record: T) => (<ItemContent id={record.id} content={text} />),
        };
      default:
        return column;
    }
  });

  return (
    <CompactTable<T>
      columns={modifiedColumns}
      dataSource={items}
      rowKey={rowKey}
      pagination={false}
      loading={loading}
      rowSelection={rowSelection}
      expandable={expandable}
      onRow={onRow}
      components={{
        body: {
          row: TableRow,
          cell: TableCell,
        },
      }}
      size="small"
      scroll={{ x: '100%' }}
    />
  );
}

export default ItemTable;
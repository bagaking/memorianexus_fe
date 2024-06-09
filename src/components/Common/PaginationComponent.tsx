// src/components/Common/PaginationComponent.tsx
import React from 'react';
import { Pagination } from 'antd';
import './CommonStyles.css';

interface PaginationComponentProps {
    currentPage: number;
    totalItems: number;
    limit: number;
    onPageChange: (page: number, pageSize?: number) => void;
    onLimitChange: (limit: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ currentPage, totalItems, limit, onPageChange, onLimitChange }) => {
    const handlePageSizeChange = (current: number, size: number) => {
        onLimitChange(size);
        onPageChange(current, size);
    };

    return (
        <div className="pagination-container">
            <Pagination
                current={currentPage}
                total={totalItems}
                pageSize={limit}
                onChange={onPageChange}
                onShowSizeChange={handlePageSizeChange}
                showSizeChanger
                className="book-pagination"
            />
        </div>
    );
};

export default PaginationComponent;
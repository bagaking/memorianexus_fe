// src/components/Common/PaginationComponent.tsx
import React from 'react';
import { Pagination } from 'antd';
import './CommonStyles.css';

interface PaginationComponentProps {

    totalItems?: number;

    // 分页
    currentPage: number;
    limit: number;

    // 这次访问到的单位数
    pageDataLength: number;

    onPageChange: (page: number, pageSize?: number) => void;
    onLimitChange: (limit: number) => void;

    size?: any; // 透传其他属性
    style?: any;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({  totalItems, currentPage, limit, pageDataLength, onPageChange, onLimitChange, size, style }) => {
    function handlePageSizeChange (current: number, size: number) {
        onLimitChange(size);
        onPageChange(current, size);
    };

   function countTotal(): number {
       let t = totalItems
       if (t !== undefined) {
           return t
       }

       if (pageDataLength === limit){ // 这页满了的话
           t = pageDataLength * limit + 1;
       } else if (pageDataLength > 0) { // 这页有内容但没满，说明已经是最后一页，直接算出 total
           t = (currentPage -1) * limit + pageDataLength
       } else { // 上一页是最后一页
           t = (currentPage -1) * limit + 1;
       }
       return t
   }

    return (
        <div className="pagination-container">
            <Pagination
                total={countTotal()}
                current={currentPage}
                pageSize={limit}
                onChange={onPageChange}
                onShowSizeChange={handlePageSizeChange}
                showSizeChanger
                size={size}
                style={style}
            />
        </div>
    );
};

export default PaginationComponent;
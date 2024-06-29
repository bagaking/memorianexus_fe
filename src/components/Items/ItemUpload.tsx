import React, { useState, useRef } from 'react';
import { Upload, message, Button, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadItems } from '../../api/items';
import AppendEntitiesModal, { EntityModalDataModel } from '../Common/AppendEntitiesModal';
import { getBooks } from '../../api/books';
import { Book } from "../Common/dto";

interface ItemUploadProps {
    onUploadSuccess: () => void;
    className?: string;
}

const ItemUpload: React.FC<ItemUploadProps> = ({ onUploadSuccess, className }) => {
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleUpload = async (file: File) => {
        setLoading(true);
        try {
            const response = await uploadItems(file, { book_id: selectedBookId || undefined });
            message.success(`Successfully uploaded ${response.data.data.length} items`);
            onUploadSuccess(); // 调用上传成功后的回调函数
        } catch (error) {
            console.error(error);
            message.error('Failed to upload items');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
    };

    const handleButtonClick = () => {
        setModalVisible(true);
    };

    const handleModalSubmit = (selectedIds: string[]) => {
        setSelectedBookId(selectedIds.length > 0 ? selectedIds[0] : null);
        setModalVisible(false);
        if (fileInputRef.current) {
            fileInputRef.current.click(); // 触发文件选择
        }
    };

    const handleModalCancel = () => {
        setSelectedBookId(null); // 清除已选择的书籍
        setModalVisible(false);
        if (fileInputRef.current) {
            fileInputRef.current.click(); // 触发文件选择
        }
    };

    const fetchBooks = async (page: number) => {
        const response = await getBooks({ page, limit: 10 });
        const data = response.data;
        const books = data.data as Book[];
        return {
            entities: books.map<EntityModalDataModel>(b => ({
                id: b.id,
                content: `## ${b.title}\n\n${b.description}\n`,
            })),
            page: data.page,
            limit: data.limit,
            total: data.total,
        };
    };

    return (
        <>
            <Button type="primary" icon={<UploadOutlined />} loading={loading} className={className} onClick={handleButtonClick}>
                Upload Items
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <AppendEntitiesModal
                visible={modalVisible}
                onCancel={handleModalCancel}
                onSubmit={handleModalSubmit}
                fetchEntities={fetchBooks}
                maxCount={1} // 限制最多选择1本书
            />
        </>
    );
};

export default ItemUpload;
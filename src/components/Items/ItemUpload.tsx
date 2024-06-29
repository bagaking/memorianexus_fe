import React, { useState } from 'react';
import {Upload, message, Button} from 'antd';
import { UploadOutlined } from '@ant-design/icons';


import { uploadItems } from '../../api/items';

interface ItemUploadProps {
    onUploadSuccess: () => void;
    className?: string
}

const ItemUpload: React.FC<ItemUploadProps> = ({ onUploadSuccess, className }) => {
    const [loading, setLoading] = useState(false);

    const handleUpload = async (file: File) => {
        setLoading(true);
        try {
            const response = await uploadItems(file);
            message.success(`Successfully uploaded ${response.data.data.length} items`);
            onUploadSuccess(); // 调用上传成功后的回调函数
        } catch (error) {
            console.error(error);
            message.error('Failed to upload items');
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file: File) => {
        handleUpload(file);
        return false; // Prevent automatic upload
    };

    return (
        <Upload beforeUpload={beforeUpload} showUploadList={false} style={{width:"100%", height:"100%", margin:0, padding:0}} >
            <Button type="primary" icon={<UploadOutlined />} loading={loading} className={className}>
                Upload Items
            </Button>
        </Upload>
    );
};

export default ItemUpload;
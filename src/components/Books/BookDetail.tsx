import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Card, message, Spin} from 'antd';
import { getBookDetail } from '../../api/books';

interface Book {
    id: string;
    title: string;
    description: string;
}

const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await getBookDetail(Number(id));
                setBook(response.data.data);
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch book details');
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    if (loading) {
        return <Spin />;
    }

    if (!book) {
        return <div>Book not found</div>;
    }

    return (
        <Card title={book.title}>
            <p>{book.description}</p>
        </Card>
    );
};

export default BookDetail;
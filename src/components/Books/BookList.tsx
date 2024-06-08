import React, { useEffect, useState } from 'react';
import {List, message} from 'antd';
import { getBooks } from '../../api/books';

interface Book {
    id: string;
    title: string;
    description: string;
}

const BookList: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await getBooks();
                setBooks(response.data.data);
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch books');
            }
        };

        fetchBooks();
    }, []);

    return (
        <div>
            <h2>Books</h2>
            <List
                itemLayout="horizontal"
                dataSource={books}
                renderItem={book => (
                    <List.Item>
                        <List.Item.Meta
                            title={<a href={`/books/${book.id}`}>{book.title}</a>}
                            description={book.description}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default BookList;
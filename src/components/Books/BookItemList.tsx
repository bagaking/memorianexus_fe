import React from 'react';
import EmbedItemList from './EmbedItemList';
import { getBookItems, addBookItems, removeBookItems } from '../../api/books';
import { getItems } from "../../api/items";

interface ItemListProps {
    bookId: string;
}

const BookItemList: React.FC<ItemListProps> = ({ bookId }) => {

    const fetchItems = async (page: number, limit: number = 10) => {
        const response = await getBookItems({ bookId, page, limit });
        return {
            entities: response.data.data,
            total: response.data.total,
            offset: response.data.offset,
            limit: response.data.limit,
            error: response.data.error,
        };
    };

    const fetchItemsToAdd = async (page: number, limit: number) => {
        const response = await getItems({ page, limit });
        return {
            entities: response.data.data,
            total: response.data.total,
            offset: response.data.offset,
            limit: response.data.limit,
        };
    };

    const addItems = async (itemIds: string[]) => {
        await addBookItems({ bookId, itemIds });
    };

    const deleteItems = async (itemIds: string[]) => {
        await removeBookItems({ bookId, itemIds });
    };

    return (
        <EmbedItemList
            fetchItems={fetchItems}
            fetchItemsToAdd={fetchItemsToAdd}
            addItems={addItems}
            deleteItems={deleteItems}
        />
    );
};

export default BookItemList;
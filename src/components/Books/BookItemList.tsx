import React from 'react';
import EmbedItemPack from '../Basic/EmbedItemPack';
import {getBookItems, addBookItems, removeBookItems, getItems} from '../../api';
import {Item} from "../Basic/dto";
import FirstLine from "../Common/Firstline";
import ItemCard from "../Basic/ItemCard";
import { useIsMobile } from '../../hooks/useWindowSize';
import Masonry from 'react-masonry-css';

import "./BookItemList.less";

interface ItemListProps {
    bookId: string;
}

const BookItemList: React.FC<ItemListProps> = ({bookId}) => {
    const isMobile = useIsMobile();

    const fetchItems = async (page: number, limit: number = 10) => {
        const response = await getBookItems({bookId, page, limit});
        return {
            entities: response.data.data,
            total: response.data.total,
            offset: response.data.offset,
            limit: response.data.limit,
            error: response.data.error,
        };
    };

    const fetchItemsToAdd = async (page: number, limit: number, search = "") => {
        const response = await getItems({page, limit, search});
        return {
            entities: response.data.data,
            total: response.data.total,
            offset: response.data.offset,
            limit: response.data.limit,
        };
    };

    const addItems = async (itemIds: string[]) => {
        await addBookItems({bookId, itemIds});
    };

    const deleteItems = async (itemIds: string[]) => {
        await removeBookItems({bookId, itemIds});
    };

    const itemsColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            render: (text: string, record: Item) => <FirstLine content={text} link={"/items/" + record.id}/>,
        },
        {
            title: 'Creator ID',
            dataIndex: 'creator_id',
            key: 'creator_id',
        },
        {
            title: 'Difficulty',
            dataIndex: 'difficulty',
            key: 'difficulty',
        },
        {
            title: 'Importance',
            dataIndex: 'importance',
            key: 'importance',
        },
    ];

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };

    return (
        <EmbedItemPack<Item>
            fetchItems={fetchItems}
            fetchItemsToAdd={fetchItemsToAdd}
            enableSearchWhenAdd={true}
            addItems={addItems}
            deleteItems={deleteItems}
            itemsColumns={isMobile ? undefined : itemsColumns}
            renderItem={(item, selected, onSelect) => (
                isMobile ? (
                    <div className="my-masonry-grid_column">
                        <ItemCard
                            item={item}
                            onClick={onSelect}
                            selected={selected}
                            showPreview={true}
                            showActions={false}
                        />
                    </div>
                ) : (
                    <ItemCard
                        item={item}
                        onClick={onSelect}
                        selected={selected}
                        showPreview={false}
                    />
                )
            )}
            rowKey="id"
        />
    );
};

export default BookItemList;
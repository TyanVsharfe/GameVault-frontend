import React, {ReactNode, useState} from 'react';
import {Container, Row} from 'react-bootstrap';
import "../../../assets/styles/style.css"
import "../../../assets/styles/game-card.css"
import {useTranslation} from "react-i18next";
import PaginationComponent from "../../ui/PaginationComponent";

export interface BaseListProps<T> {
    items: T[];
    itemsPerPage?: number;
    renderItem: (item: T, index: number) => ReactNode;
    filterItem?: (item: T) => boolean;
    containerClassName?: string;
    rowClassName?: string;
}

function BaseList ({ items,
                   itemsPerPage = 10,
                   renderItem,
                   filterItem,
                   containerClassName = "justify-content-start align-items-center game-list",
                   rowClassName = "" }): BaseListProps<T> {

    const [currentPage, setCurrentPage] = useState<number>(1);

    const filteredItems = filterItem ? items.filter(filterItem) : items;

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    React.useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    return (
        <>
            <Container className={containerClassName}>
                <Row className={rowClassName}>
                    {currentItems.map((item, index: number) => (
                        <React.Fragment key={item.id ?? index}>
                            {renderItem(item, index)}
                        </React.Fragment>
                    ))}
                </Row>
            </Container>

            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </>
    );
};

export default BaseList;


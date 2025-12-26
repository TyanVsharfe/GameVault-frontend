import React from 'react';
import { Container, Pagination } from 'react-bootstrap';
import {useTheme} from "next-themes";

export interface PaginationComponentProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
    maxVisiblePages?: number;
    showContainer?: boolean;
    containerClassName?: string;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
                                                                     currentPage,
                                                                     totalPages,
                                                                     onPageChange,
                                                                     maxVisiblePages = 5,
                                                                     showContainer = true,
                                                                     containerClassName = "d-flex justify-content-center mt-1"
                                                                 }) => {
    const { theme } = useTheme();

    const renderPaginationItems = () => {
        let items = [];

        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            />
        );

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            items.push(
                <Pagination.Item key={1} onClick={() => onPageChange(1)}>
                    1
                </Pagination.Item>
            );
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="ellipsis-start" />);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="ellipsis-end" />);
            }
            items.push(
                <Pagination.Item
                    key={totalPages}
                    onClick={() => onPageChange(totalPages)}
                >
                    {totalPages}
                </Pagination.Item>
            );
        }

        items.push(
            <Pagination.Next
                key="next"
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            />
        );

        return items;
    };

    if (totalPages <= 1) {
        return null;
    }

    const paginationElement = <Pagination data-bs-theme={`${theme === 'light' ? 'light' : 'dark'}`}>{renderPaginationItems()}</Pagination>;

    if (showContainer) {
        return (
            <Container className={containerClassName}>
                {paginationElement}
            </Container>
        );
    }

    return paginationElement;
};

export default PaginationComponent;
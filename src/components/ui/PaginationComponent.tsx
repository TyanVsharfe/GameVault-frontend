import React from 'react';
import { Box, IconButton, Button } from '@mui/joy';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

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
                                                                     containerClassName = ''
                                                                 }) => {
    const renderPaginationItems = () => {
        let items = [];

        items.push(
            <IconButton
                key="prev"
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outlined"
                color="neutral"
                size="sm"
            >
                <KeyboardArrowLeftIcon />
            </IconButton>
        );

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            items.push(
                <Button
                    key={1}
                    onClick={() => onPageChange(1)}
                    variant="outlined"
                    color="neutral"
                    size="sm"
                >
                    1
                </Button>
            );
            if (startPage > 2) {
                items.push(
                    <Box key="ellipsis-start" sx={{ px: 1, borderRadius: '1rem'}}>
                        ...
                    </Box>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Button
                    key={i}
                    onClick={() => onPageChange(i)}
                    variant={i === currentPage ? "solid" : "outlined"}
                    color={i === currentPage ? "primary" : "neutral"}
                    size="sm"
                >
                    {i}
                </Button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(
                    <Box key="ellipsis-end" sx={{ px: 1 }}>
                        ...
                    </Box>
                );
            }
            items.push(
                <Button
                    key={totalPages}
                    onClick={() => onPageChange(totalPages)}
                    variant="outlined"
                    color="neutral"
                    size="sm"
                >
                    {totalPages}
                </Button>
            );
        }

        items.push(
            <IconButton
                key="next"
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outlined"
                color="neutral"
                size="sm"
            >
                <KeyboardArrowRightIcon />
            </IconButton>
        );

        return items;
    };

    if (totalPages <= 1) {
        return null;
    }

    const paginationElement = (
        <Box
            sx={{
                display: 'flex',
                gap: 0.5,
                alignItems: 'center'
            }}
        >
            {renderPaginationItems()}
        </Box>
    );

    if (showContainer) {
        return (
            <Box
                className={containerClassName}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '1rem'
                }}
            >
                {paginationElement}
            </Box>
        );
    }

    return paginationElement;
};

export default PaginationComponent;
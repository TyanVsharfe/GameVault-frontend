import React, {useEffect, useReducer } from "react";
import {FilterState, SearchFilterState} from "../../types/types";
import {
    Button,
    buttonClasses,
    Checkbox,
    Input,
    Modal,
    ModalClose,
    ModalDialog,
    Switch,
    ToggleButtonGroup,
    Typography
} from "@mui/joy";
import {useTranslation} from "react-i18next";
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

interface SearchFilterModalProps {
    show: boolean;
    handleClose: () => void;
    initialFilters: SearchFilterState;
    onApply: (filters: SearchFilterState) => void;
}

function filterReducer(state: SearchFilterState, action: FilterAction): SearchFilterState {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'RESET':
            return initialState;
        case 'INIT':
            return action.payload;
        default:
            return state;
    }
}

type FilterAction =
    | {type: 'SET_FIELD'; field: keyof SearchFilterState; value: any }
    | {type: 'RESET'}
    | {type: 'INIT', payload: SearchFilterState};

const initialState: SearchFilterState = {
    minRating: null,
    maxRating: null,
    releasedAfter: null,
    releasedBefore: null,
    sort: {sortBy: "createdAt", direction: 'asc'}
};

export const SearchFilterModal: React.FC<SearchFilterModalProps> = ({
                                                            show,
                                                            handleClose,
                                                            initialFilters,
                                                            onApply
                                                        }) => {
    const { t } = useTranslation();
    const [filters, dispatch] = useReducer(filterReducer, initialFilters);

    useEffect(() => {
        if (show) {
            dispatch({ type: 'INIT', payload: initialFilters });
        }
    }, [show, initialFilters]);

    const handleApply = () => {
        onApply(filters);
        handleClose();
    };

    const handleReset = () => {
        dispatch({ type: 'RESET' });
    };

    return (
        <Modal open={show} onClose={handleClose}>
            <ModalDialog style={{display: 'flex', gap: '1rem', width: '55%', height: '55%'}}>
                <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
                    {t('set_filters')}
                </div>
                <ModalClose/>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%'
                }}>
                    <Input
                        placeholder={t('filter_title')}
                        value={'sample'}
                        onChange={(e) => dispatch({
                            type: 'SET_FIELD',
                            field: 'title',
                            value: e.target.value
                        })}
                    />

                    <Select
                        placeholder={t('status')}
                        value={'sample'}
                        onChange={(_, value) => dispatch({
                            type: 'SET_FIELD',
                            field: 'status',
                            value
                        })}
                    >
                        <Option value="COMPLETED">Completed</Option>
                        <Option value="PLAYING">Playing</Option>
                        <Option value="PLANNED">Planned</Option>
                        <Option value="ABANDONED">Abandoned</Option>
                        <Option value="NONE">Without Status</Option>
                    </Select>

                    <div style={{display: 'flex', gap: '1rem'}}>
                        <Input
                            type="number"
                            placeholder={t('min_rating')}
                            value={0}
                            onChange={(e) => dispatch({
                                type: 'SET_FIELD',
                                field: 'minRating',
                                value: e.target.value ? Number(e.target.value) : null
                            })}
                        />
                        <Input
                            type="number"
                            placeholder={t('max_rating')}
                            value={100}
                            onChange={(e) => dispatch({
                                type: 'SET_FIELD',
                                field: 'maxRating',
                                value: e.target.value ? Number(e.target.value) : null
                            })}
                        />

                        <div style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
                            <Checkbox
                                label={t('has_review')}
                                checked={false}
                                onChange={(e) => dispatch({
                                    type: 'SET_FIELD',
                                    field: 'hasReview',
                                    value: e.target.checked
                                })}
                            />

                            <Checkbox
                                label={t('fully_completed')}
                                checked={false}
                                onChange={(e) => dispatch({
                                    type: 'SET_FIELD',
                                    field: 'isFullyCompleted',
                                    value: e.target.checked
                                })}
                            />
                        </div>
                    </div>

                    <div style={{display: 'flex', gap: '3rem', paddingBottom: '2rem'}}>
                        <Typography component="label" endDecorator={
                            <Switch
                                checked={filters?.sort?.direction === "asc"}
                                onChange={(e) => {
                                    dispatch({
                                        type: 'SET_FIELD',
                                        field: 'sort',
                                        value: {
                                            ...filters.sort,
                                            direction: e.target.checked ? 'asc' : 'desc'
                                        }
                                    })
                                }}
                                endDecorator={t(filters?.sort?.direction) ?? t('desc')}
                                sx={{
                                    width: '4.6rem'
                                }}
                            />
                        }>
                            {t('set_order')}
                        </Typography>

                        <Select
                            placeholder={t('status')}
                            value={filters?.sort?.sortBy}
                            onChange={(_, value) => dispatch({
                                type: 'SET_FIELD',
                                field: 'sort',
                                value: {
                                    ...filters.sort,
                                    sortBy: value
                                }
                            })}
                            sx={{
                                width: '11rem'
                            }}
                        >
                            <Option value="createdAt">{t('created_at')}</Option>
                            <Option value="updatedAt">{t('updated_at')}</Option>
                            <Option value="userRating">{t('rating')}</Option>
                            <Option value="status">{t('status')}</Option>
                            <Option value="title">{t('filter_title')}</Option>
                        </Select>
                    </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button onClick={handleClose}>
                        {t('cancel')}
                    </Button>
                    <div style={{display: 'flex', gap: '1rem'}}>
                        <Button onClick={handleReset} color="danger">
                            {t('reset_filters')}
                        </Button>
                        <Button onClick={handleApply}>
                            {t('apply_filters')}
                        </Button>
                    </div>
                </div>
            </ModalDialog>
        </Modal>
    );
};
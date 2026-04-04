import React, {useEffect, useReducer } from "react";
import {
    Button,
    Checkbox,
    Input,
    Modal,
    ModalClose,
    ModalDialog, Stack,
    Switch,
    Typography
} from "@mui/joy";
import {useTranslation} from "react-i18next";
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { FilterState } from "../../types/filters";

interface FilterModalProps {
    show: boolean;
    handleClose: () => void;
    initialFilters: FilterState;
    onApply: (filters: FilterState) => void;
}

function filterReducer(state: FilterState, action: FilterAction): FilterState {
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
    | {type: 'SET_FIELD'; field: keyof FilterState; value: any }
    | {type: 'RESET'}
    | {type: 'INIT', payload: FilterState};

const initialState: FilterState = {
    status: null,
    minRating: null,
    maxRating: null,
    hasReview: null,
    isFullyCompleted: null,
    title: '',
    createdAfter: null,
    createdBefore: null,
    sort: {sortBy: "createdAt", direction: 'asc'}
};

export const FilterModal: React.FC<FilterModalProps> = ({show, handleClose, initialFilters, onApply}) => {
    const { t } = useTranslation();
    const [filters, dispatch] = useReducer(filterReducer, initialFilters);

    const statusItems = [
        { status: "", label: t('all_games') },
        { status: "Completed", label: t('status_completed') },
        { status: "Playing", label: t('status_playing') },
        { status: "Planned", label: t('status_planned') },
        { status: "Abandoned", label: t('status_abandoned') },
        { status: "None", label: t('status_none') }
    ];

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
            <ModalDialog style={{display: 'flex', gap: '1rem', height: '55%'}}>
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
                    <Stack direction="row" gap={1}>
                        <Input
                            placeholder={t('filter_title')}
                            value={filters.title}
                            onChange={(e) => dispatch({
                                type: 'SET_FIELD',
                                field: 'title',
                                value: e.target.value
                            })}
                        />

                        <Select
                            placeholder={t('status')}
                            value={filters.status}
                            onChange={(_, value) => dispatch({
                                type: 'SET_FIELD',
                                field: 'status',
                                value
                            })}
                            sx={{width: '12.5rem'}}
                        >
                            {statusItems.map((statusItem, index) => (
                                    <Option
                                        key={index}
                                        value={statusItem.status}
                                    >
                                        {statusItem.label}
                                    </Option>
                                )
                            )}
                        </Select>
                        <Select
                            placeholder={t('filters.game_type.label')}
                            value={filters.dlcOnly}
                            onChange={(_, value) =>
                                dispatch({
                                    type: 'SET_FIELD',
                                    field: 'dlcOnly',
                                    value
                                })
                            }
                            sx={{width: '12.5rem'}}
                        >
                            <Option value={null}>
                                {t('filters.game_type.any')}
                            </Option>

                            <Option value={true}>
                                {t('filters.game_type.only_dlc')}
                            </Option>

                            <Option value={false}>
                                {t('filters.game_type.without_dlc')}
                            </Option>
                        </Select>
                    </Stack>

                    <div style={{display: 'flex', gap: '1rem'}}>
                        <Stack direction="row" sx={{width: '45%'}} gap={1}>
                            <Input
                                type="number"
                                placeholder={t('min_rating')}
                                value={filters.minRating ?? ''}
                                onChange={(e) => dispatch({
                                    type: 'SET_FIELD',
                                    field: 'minRating',
                                    value: e.target.value ? Number(e.target.value) : null
                                })}
                            />
                            <Input
                                type="number"
                                placeholder={t('max_rating')}
                                value={filters.maxRating ?? ''}
                                onChange={(e) => dispatch({
                                    type: 'SET_FIELD',
                                    field: 'maxRating',
                                    value: e.target.value ? Number(e.target.value) : null
                                })}
                            />
                        </Stack>

                        <div style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
                            <Select
                                placeholder={t('filters.review.label')}
                                value={filters.hasReview}
                                onChange={(_, value) =>
                                    dispatch({
                                        type: 'SET_FIELD',
                                        field: 'hasReview',
                                        value
                                    })
                                }
                                sx={{width: '12.5rem'}}
                            >
                                <Option value={null}>
                                    {t('filters.review.any')}
                                </Option>

                                <Option value={true}>
                                    {t('filters.review.with')}
                                </Option>

                                <Option value={false}>
                                    {t('filters.review.without')}
                                </Option>
                            </Select>

                            <Checkbox
                                label={t('fully_completed')}
                                checked={filters.isFullyCompleted ?? false}
                                onChange={(e) => dispatch({
                                    type: 'SET_FIELD',
                                    field: 'isFullyCompleted',
                                    value: e.target.checked
                                })}
                                sx={{width: '2rem'}}
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

                        <div style={{display: 'flex', gap: '1rem'}}>
                            Добавлено после
                            <Input
                                type="date"
                                defaultValue={
                                    filters.createdAfter
                                        ? filters.createdAfter.toISOString().split('T')[0]
                                        : ''
                                }
                                slotProps={{
                                    input: {
                                        min: '1958-10-17',
                                        max: (() => {
                                            const today = new Date();
                                            const fiveYearsLater = new Date(
                                                today.getFullYear() + 5,
                                                today.getMonth(),
                                                today.getDate()
                                            );
                                            return fiveYearsLater.toISOString().split('T')[0];
                                        })(),
                                    },
                                }}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    dispatch({
                                        type: 'SET_FIELD',
                                        field: 'createdAfter',
                                        value: value ? new Date(value) : null,
                                    })
                                }
                            }
                            />
                            Добавлено до
                            <Input
                                type="date"
                                defaultValue={
                                    filters.createdBefore
                                        ? filters.createdBefore.toISOString().split('T')[0]
                                        : ''
                                }
                                slotProps={{
                                    input: {
                                        min: '1958-10-19',
                                        max: (() => {
                                            const today = new Date();
                                            const fiveYearsLater = new Date(
                                                today.getFullYear() + 5,
                                                today.getMonth(),
                                                today.getDate()
                                            );
                                            return fiveYearsLater.toISOString().split('T')[0];
                                        })(),
                                    },
                                }}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    dispatch({
                                        type: 'SET_FIELD',
                                        field: 'createdBefore',
                                        value: value ? new Date(value) : null,
                                    })
                                }}
                            />
                        </div>
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
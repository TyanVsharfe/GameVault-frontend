import React, {useEffect, useMemo, useState} from "react";
import {noteService, Note, NoteUpdate} from "../../api/services/noteService";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {
    Box,
    Button,
    Card,
    CardContent, Chip, Divider, Dropdown, IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    Modal,
    ModalClose,
    ModalDialog,
    Stack,
    Textarea,
    Typography
} from "@mui/joy";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DescriptionIcon from '@mui/icons-material/Description';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { formatRelative } from "../../utils/Utils";
import Select from "@mui/joy/Select";
import Option from '@mui/joy/Option';

export interface UserNotesProps {
    show: boolean;
    gameTitle: string;
    handleClose: () => void;
    onDelete: () => void;
    onEdit: () => void;
    onAdd: () => void;
    notes: Note[];
}

const CARD_COLORS = [
    { bg: '#FFF5F5', title: '#000000', tag: 'GENERAL' },
    { bg: '#F8F5FF', title: '#ff4109', tag: 'GAMEPLAY' },
    { bg: '#F8F5FF', title: '#5E35B1', tag: 'GUIDE' },
    { bg: '#F0FFF4', title: '#2D6A4F', tag: 'COMBAT' },
    { bg: '#FFF5F5', title: '#A62A2A', tag: 'LORE' },
];

const NOTE_TYPE = [
    { type: 'GENERAL' },
    { type: 'GAMEPLAY' },
    { type: 'GUIDE' },
    { type: 'COMBAT' },
    { type: 'LORE' },
]

function NotesModal({ notes, show, handleClose, gameTitle }: UserNotesProps) {
    const { t, i18n } = useTranslation();

    const [ searchTerm, setSearchTerm ] = useState("");
    const [ showAddModal, setShowAddModal ] = useState(false);
    const [ editMode, setEditMode] = useState(false);

    const [ openNote, setOpenNote ] = useState(false);

    const igdbId = useParams<{ id: string }>();

    const initialNote: NoteUpdate = {
        title: "",
        content: "",
        type: "general"
    };

    const [formData, setFormData] = useState<NoteUpdate>(initialNote);

    const updateField = (name: keyof Note, value: string | null) => {
        if (value !== null) {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    useEffect(() => {
        console.log(notes);
    }, [notes]);

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    const handleCloseAddModal = () => setShowAddModal(false);
    const handleShowAddModal = () => setShowAddModal(true);

    return (
        <>
            <Modal open={show}
                   onClose={() => {
                       handleClose();
                   }}
                   disableEnforceFocus
            >
                <ModalDialog
                    sx={{
                        width: '90vw',
                        maxWidth: '850px',
                        borderRadius: 'xl',
                        p: 3,
                        height: '80vh',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <ModalClose/>

                    <Box sx={{ mb: 2 }}>
                        <Typography level="h3" fontWeight="xl">{t('your_notes_for')} {gameTitle}</Typography>
                        <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
                            {t('modal_notes_description')}.
                        </Typography>
                    </Box>

                    {openNote ? (
                        <>
                            {
                                (
                                    () => {
                                        const style = CARD_COLORS
                                            .find(item => item.tag === formData?.type?.toUpperCase()) || CARD_COLORS[0];
                                        return (
                                            <Card
                                                key={formData.id}
                                                sx={{
                                                    // bgcolor: style.bg,
                                                    border: 'none',
                                                    boxShadow: 'none',
                                                    minHeight: '160px'
                                                }}
                                            >
                                                <CardContent sx={{minWidth: 0}}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '0.5rem'}}>
                                                        <Typography level="h2"
                                                                    sx={{ color: style.title }}
                                                        >
                                                            {formData.title}
                                                        </Typography>

                                                        <div style={{height: '2.5rem', display: 'flex', alignItems: 'center'}}>
                                                            <IconButton size="md"
                                                                        onClick={() => {
                                                                            setFormData(initialNote);
                                                                            setOpenNote(false);
                                                                        }}
                                                            >
                                                                <FullscreenExitIcon/>
                                                            </IconButton>
                                                            <Dropdown>
                                                                <MenuButton
                                                                    slots={{ root: IconButton }}
                                                                    slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'md' } }}
                                                                >
                                                                    <MoreVertIcon />
                                                                </MenuButton>
                                                                <Menu placement="bottom-end" size="sm" sx={{ minWidth: 120 }} disablePortal>
                                                                    <MenuItem onClick={() => {
                                                                        handleShowAddModal();
                                                                        setFormData(formData);
                                                                        setEditMode(true);
                                                                    }}>
                                                                        <EditIcon /> {t('edit')}
                                                                    </MenuItem>
                                                                    <Divider />
                                                                    <MenuItem variant="soft" color="danger" onClick={() => {
                                                                        noteService.deleteNote(formData?.id);
                                                                    }}>
                                                                        <DeleteForeverIcon /> {t('remove')}
                                                                    </MenuItem>
                                                                </Menu>
                                                            </Dropdown>
                                                        </div>
                                                    </Box>
                                                    <Typography
                                                        level="body-lg"
                                                        sx={{
                                                            color: 'text.secondary',
                                                            overflow: 'y',
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                        {formData.content}
                                                    </Typography>

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                                                        <Typography level="body-xs" sx={{ color: 'text.tertiary'}}>
                                                            {formatRelative(formData?.updatedAt, i18n.language)}
                                                        </Typography>
                                                        <Chip size="sm"
                                                              sx={{
                                                                  bgcolor: 'rgba(0,0,0,0.05)',
                                                                  fontWeight: 'bold',
                                                                  fontSize: '10px' ,
                                                                  color: style.title
                                                              }}
                                                        >
                                                            {style.tag}
                                                        </Chip>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        )
                                    }
                                )()
                            }
                        </>
                    ) : (
                        <>
                            {/*<Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>*/}
                            {/*    <Input*/}
                            {/*        placeholder="Search your notes..."*/}
                            {/*        startDecorator={<SearchIcon />}*/}
                            {/*        sx={{ flexGrow: 1, borderRadius: 'md' }}*/}
                            {/*        value={searchTerm}*/}
                            {/*        onChange={(e) => setSearchTerm(e.target.value)}*/}
                            {/*    />*/}
                            {/*    <Button*/}
                            {/*        variant="outlined"*/}
                            {/*        color="neutral"*/}
                            {/*        endDecorator={<KeyboardArrowDownIcon />}*/}
                            {/*        sx={{ borderRadius: 'md', fontWeight: 'md' }}*/}
                            {/*    >*/}
                            {/*        Recent*/}
                            {/*    </Button>*/}
                            {/*    <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 'md' }}>*/}
                            {/*        <IconButton variant="plain" color="neutral"><GridViewIcon /></IconButton>*/}
                            {/*        <Divider orientation="vertical" />*/}
                            {/*        <IconButton variant="plain" color="neutral"><ListIcon /></IconButton>*/}
                            {/*    </Box>*/}
                            {/*</Box>*/}

                            <Box sx={{
                                flexGrow: 1,
                                overflowY: 'auto',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                                gap: 2,
                                alignContent: 'start',
                                pr: 1
                            }}>
                                {notes.sort(note => note?.updatedAt).map((note, index) => {
                                    const style = CARD_COLORS
                                        .find(item => item.tag === note?.type?.toUpperCase()) || CARD_COLORS[0];
                                    return (
                                        <Card
                                            key={note.id}
                                            sx={{
                                                // bgcolor: style.bg,
                                                border: 'none',
                                                boxShadow: 'none',
                                                minHeight: '160px'
                                            }}
                                        >
                                            <CardContent sx={{minWidth: 0}}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Typography level="title-lg" sx={{ color: style.title }}>
                                                        {note.title}
                                                    </Typography>

                                                    <div style={{height: '1.6rem', display: 'flex', alignItems: 'center'}}>
                                                        <IconButton size="sm"
                                                                    onClick={() => {
                                                                        setFormData(note);
                                                                        setOpenNote(true);
                                                                    }}
                                                        >
                                                            <FullscreenIcon/>
                                                        </IconButton>
                                                        <Dropdown>
                                                            <MenuButton
                                                                slots={{ root: IconButton }}
                                                                slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                                                            >
                                                                <MoreVertIcon />
                                                            </MenuButton>
                                                            <Menu placement="bottom-end" size="sm" sx={{ minWidth: 120 }} disablePortal>
                                                                <MenuItem onClick={() => {
                                                                    handleShowAddModal();
                                                                    setFormData(note);
                                                                    setEditMode(true);
                                                                }}>
                                                                    <EditIcon /> {t('edit')}
                                                                </MenuItem>
                                                                <Divider />
                                                                <MenuItem variant="soft" color="danger" onClick={() => {
                                                                    noteService.deleteNote(note.id);
                                                                }}>
                                                                    <DeleteForeverIcon /> {t('remove')}
                                                                </MenuItem>
                                                            </Menu>
                                                        </Dropdown>
                                                    </div>
                                                </Box>
                                                <Typography
                                                    level="body-md"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        wordBreak: 'break-word',

                                                        minWidth: 0,
                                                    }}
                                                >
                                                    {note.content}
                                                </Typography>

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                                                    <Typography level="body-xs" sx={{ color: 'text.tertiary'}}>
                                                        {formatRelative(note?.updatedAt, i18n.language)}
                                                    </Typography>
                                                    <Chip size="sm"
                                                          sx={{
                                                              bgcolor: 'rgba(0,0,0,0.05)',
                                                              fontWeight: 'bold',
                                                              fontSize: '10px' ,
                                                              color: style.title
                                                          }}
                                                    >
                                                        {style.tag}
                                                    </Chip>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    );
                                })}

                                <Card
                                    variant="dashed"
                                    onClick={() => {
                                        setFormData(initialNote);
                                        handleShowAddModal()
                                    }}
                                    sx={{
                                        minHeight: '160px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'background.level1' }
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center' }}>
                                        <IconButton variant="plain" color="neutral">
                                            <Typography startDecorator={<AddIcon sx={{ fontSize: '2rem', opacity: 0.3 }} />}
                                                        sx={{display: 'flex', flexDirection: 'column'}}
                                                        level="body-sm" fontWeight="md">
                                                Create new note
                                            </Typography>
                                        </IconButton>
                                    </Box>
                                </Card>
                            </Box>

                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography level="body-xs">
                                    {t('you_have')} {notes.length}{t('notes_for_this_game')}.
                                </Typography>
                                {/*<Button startDecorator={<AddIcon />} sx={{ borderRadius: 'md', px: 3 }} onClick={handleShowAddModal}>*/}
                                {/*    New Note*/}
                                {/*</Button>*/}
                            </Box>

                            {/*<Typography level="body-xs" sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.6 }}>*/}
                            {/*    <span style={{ fontSize: '14px' }}>ⓘ</span> Notes are private and only visible to you.*/}
                            {/*</Typography>*/}
                        </>
                    )}
                </ModalDialog>
            </Modal>

            <Modal open={showAddModal} onClose={() => {handleCloseAddModal(); setEditMode(false)}} disableEnforceFocus>
                <ModalDialog
                    sx={{
                        minWidth: '400px',
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg'
                    }}
                >
                    <Typography
                        level="title-lg"
                        startDecorator={<DescriptionIcon color="primary" />}
                        sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                    >
                        {editMode ? t('edit_note') : t('add_note')}
                    </Typography>

                    <ModalClose variant="plain" sx={{ m: 1 }} />

                    <Stack spacing={2}>
                        <Input
                            placeholder={t('note_title')}
                            variant="outlined"
                            defaultValue={formData.title}
                            onChange={(e) =>
                                updateField("title", e.target.value)}
                            sx={{
                                // fontWeight: 'bold',
                                // '--Input-focusedThickness': '1px'
                            }}
                        />

                        <Select
                            value={formData.type?.toUpperCase() || 'GENERAL'}
                            onChange={(_, newValue) =>
                                updateField("type", newValue)}>
                            {NOTE_TYPE.map((type, index) => (
                                <Option key={index} value={type?.type}>
                                    {type?.type}
                                </Option>
                            ))}
                        </Select>

                        <Textarea
                            placeholder={t('note_content')}
                            minRows={6}
                            defaultValue={formData?.content}
                            onChange={(e) =>
                                updateField("content", e.target.value)}
                            required
                            endDecorator={
                                <Typography level="body-xs" sx={{ ml: 'auto', opacity: 0.6 }}>
                                    {formData?.content?.length} {t('characters')}
                                </Typography>
                            }
                            sx={{
                                borderRadius: 'sm',
                                '--Textarea-focusedThickness': '1px'
                            }}
                        />

                        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
                            <Button
                                variant="plain"
                                color="neutral"
                                onClick={handleCloseAddModal}
                            >
                                {t('cancel')}
                            </Button>
                            <Button
                                variant="solid"
                                color="primary"
                                onClick={() => {
                                    if (editMode) {
                                        noteService.editNote(formData.id, formData.title, formData.content, formData.type);
                                        setEditMode(false);
                                    } else {
                                        noteService.addNote(igdbId.id, formData.title, formData.content, formData.type);
                                    }
                                    handleCloseAddModal();
                                }}
                            >
                                {editMode ? t('save_changes') : t('create_note')}
                            </Button>
                        </Stack>
                    </Stack>
                </ModalDialog>
            </Modal>
        </>
    );
}

export default NotesModal;
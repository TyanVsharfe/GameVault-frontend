import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import React, {useEffect, useState} from "react";
import {Stack} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { ReactComponent as EditLogo } from "../assets/icons/pencil-square.svg";
import { ReactComponent as DeleteLogo } from "../assets/icons/delete.svg";
import {addNote, deleteNote, editNote, Note} from "../services/noteService";
import {useParams} from "react-router-dom";
import {getUserGame, UserGame} from "../services/userGamesService";
import {useTranslation} from "react-i18next";
import {Input, Textarea, Typography} from "@mui/joy";

export interface UserNotesProps {
    notes: Note[];
}

function Notes({ notes }: UserNotesProps) {
    const { t } = useTranslation();

    const [ show, setShow ] = useState(false);
    const [ editMode, setEditMode] = useState(false);

    const [ noteTitle, setNoteTitle ] = useState("");
    const [ noteContent, setNoteContent ] = useState("");

    const [ noteEditContent, setNoteEditContent ] = useState("");
    const [ noteEditTitle, setNoteEditTitle ] = useState("");

    const [ noteId, setNoteId ] = useState(null);
    const igdbId = useParams<{ id: string }>();
    const [userNotes, setUserNotes] = useState<Note[]>([]);

    const noteTitleAreaChange = (e) => setNoteTitle(e.target.value);
    const noteTextAreaChange = (e) => setNoteContent(e.target.value);

    useEffect(() => {
        // getUserGame(igdbId.id).then(data => {
        //     console.log(data);
        //     if (data && data.notes !== null)
        //         setUserNotes(data.notes)
        // })
        setUserNotes(notes);
    }, [userNotes]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const renderNotes = () => {
        if (Array.isArray(userNotes)) {
            return userNotes.map((note) => (
                <Col key={note.id} style={{paddingBottom: '20px'}} xxl={"auto"} xl={"auto"} lg={"auto"} sm={"auto"} xs={"auto"}>
                    <Card data-bs-theme="dark" style={{ width: '25rem'}}  className="text-center" border='light'>
                        <Card.Body>
                            <Card.Title style={{display: "flex", justifyContent: "space-evenly"}}>
                                <Button variant="outline-secondary" onClick={() => {
                                    setEditMode(true);
                                    setNoteId(note.id);
                                    setNoteEditContent(note.content)
                                    setNoteEditTitle(note.title)
                                    handleShow();
                                }} size={"sm"} style={
                                    {verticalAlign: "text-top",
                                    all: "unset",
                                    display: "inline-block",
                                    background: "none",
                                    border: "none",
                                    padding: "0",
                                    cursor: "pointer"}}>
                                    <EditLogo/>
                                </Button>
                                {t('note')} - {note.title}
                                <Button variant="outline-secondary" onClick={() => {
                                    deleteNote(note.id);
                                    // TODO Какой-то мега костыль, потом убрать
                                    setNoteContent("52");
                                }} size={"sm"} style={
                                    {verticalAlign: "text-top",
                                        all: "unset",
                                        display: "inline-block",
                                        background: "none",
                                        border: "none",
                                        padding: "0",
                                        cursor: "pointer"}}>
                                    <DeleteLogo/>
                                </Button>
                            </Card.Title>
                            <Card.Text>
                                {note.content}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className="text-muted">
                        </Card.Footer>
                    </Card>
                </Col>
            ));
        }
    };

    return (
        <>
            <Container style={{textAlign: "center"}}>
                <Stack className=".d-flex justify-content-center align-items-center flex-wrap" direction="horizontal" gap={4}>
                    {renderNotes()}
                </Stack>
                <Button variant="primary" style={{marginBottom: "20px"}} onClick={() => {
                    handleShow();
                    setEditMode(false);
                }}>{t('add_note')}</Button>
            </Container>

            <Modal show={show} centered={true} onHide={handleClose}
                   dialogClassName="modal-90w"
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <Input
                            placeholder={t('note_title')}
                            onChange={noteTitleAreaChange}
                            defaultValue={`${editMode ? noteEditTitle : noteTitle}`}
                        />
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form>
                        <Textarea
                            placeholder={t('note_content')}
                            onChange={noteTextAreaChange}
                            required
                            sx={{mb: 1}}
                            minRows={5}
                            defaultValue={`${editMode ? noteEditContent : noteContent}`}

                            endDecorator={
                                <Typography level="body-xs" sx={{ ml: 'auto' }}>
                                    {editMode ?
                                        `${noteEditContent.length} ${t('characters')}`
                                        :
                                        `${noteContent.length} ${t('characters')}`
                                    }
                                </Typography>
                            }
                        />
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>{t('cancel')}</Button>
                    {editMode ?
                        <Button variant="primary" onClick={() => {
                            handleClose();
                            editNote(noteId, noteTitle, noteContent);
                            // TODO Какой-то мега костыль, потом убрать
                            setNoteContent("5");
                            setEditMode(false)
                        }}>{t('save_changes')}</Button>
                        :
                        <Button variant="primary" onClick={() => {
                            handleClose();
                            addNote(igdbId.id, noteTitle, noteContent);
                            // TODO Какой-то мега костыль, потом убрать
                            setNoteContent("5");
                        }}>{t('save_changes')}</Button>}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Notes;
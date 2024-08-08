import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import React, {useEffect, useState} from "react";
import {GetGame} from "../api/Game/GetGame";
import {Stack} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {addNote} from "../api/Note/AddNote";
import { ReactComponent as EditLogo } from "../assets/icons/pencil-square.svg";
import { ReactComponent as DeleteLogo } from "../assets/icons/delete.svg";
import {deleteNote} from "../api/Note/DeleteNote";
import {editNote} from "../api/Note/EditNote";

function Notes() {
    const [ show, setShow ] = useState(false);
    const [ editMode, setEditMode] = useState(false);
    const [ noteContent, setNoteContent ] = useState("");
    const [ noteEditContent, setNoteEditContent ] = useState("");
    const [ noteId, setNoteId ] = useState(null);
    const [userNotes, setUserNotes] = useState(undefined);

    const noteTextAreaChange = (e) => setNoteContent(e.target.value);

    useEffect(() => {
        GetGame().then(data => {
            console.log(data);
            if (data && data.notes !== null)
                setUserNotes(data.notes)
        })
    }, [noteContent]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const renderNotes = () => {
        if (Array.isArray(userNotes)) {
            return userNotes.map((note) => (
                <Col key={note.id} style={{paddingBottom: '20px'}} xxl={"auto"} xl={"auto"} lg={"auto"} sm={"auto"} xs={"auto"}>
                    <Card data-bs-theme="dark" style={{ width: '15rem'}}  className="text-center" border='light'>
                        <Card.Body>
                            <Card.Title style={{display: "flex", justifyContent: "space-evenly"}}>
                                <Button variant="outline-secondary" onClick={() => {
                                    setEditMode(true);
                                    setNoteId(note.id);
                                    setNoteEditContent(note.content)
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
                                Note {note.id}
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
                                <Container>
                                    {note.content}
                                </Container>
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
                <h2>Notes</h2>
                <Stack className=".d-flex justify-content-center align-items-center flex-wrap" direction="horizontal" gap={4}>
                    {renderNotes()}
                </Stack>
                <Button variant="primary" style={{marginBottom: "20px"}} onClick={() => {
                    handleShow();
                    setEditMode(false);
                }}>Add note</Button>
            </Container>

            <Modal show={show} centered={true} onHide={handleClose}
                   dialogClassName="modal-90w"
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                    <Modal.Title>Note</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Label>Note content:</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Note text" onChange={noteTextAreaChange}
                                      defaultValue={`${editMode ? noteEditContent : ""}`}
                        />
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>Close</Button>
                    {editMode ?
                        <Button variant="primary" onClick={() => {
                            handleClose();
                            editNote(noteId, noteContent);
                            // TODO Какой-то мега костыль, потом убрать
                            setNoteContent("5");
                            setEditMode(false)
                        }}>Save changes</Button>
                        :
                        <Button variant="primary" onClick={() => {
                            handleClose();
                            addNote(noteContent);
                            // TODO Какой-то мега костыль, потом убрать
                            setNoteContent("5");
                        }}>Save changes</Button>}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Notes;
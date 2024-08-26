import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import {Alert} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {useState} from "react";

function ImportGamesList({importGames, onSwitchChange}) {

    const [gameStates, setGameStates] = useState(
        importGames.map(game => ({ ...game, isChecked: false }))
    );

    const handleSwitchChange = (gameId) => {
        const updatedStates = gameStates.map(game =>
            game.id === gameId ? { ...game, isChecked: !game.isChecked } : game
        );
        setGameStates(updatedStates);
        onSwitchChange(updatedStates.filter(game => game.isChecked).map(game => game.id));
    };

    const getCheckedGameIds = () => {
        return gameStates.filter(game => game.isChecked).map(game => game.id);
    };

    const renderUserGames = () => {
        let gamesResultsOut = importGames;
        console.log(gamesResultsOut);
        console.log("Array " + Array.isArray(gamesResultsOut));

        if (Array.isArray(gamesResultsOut)) {
            return (
                <Container className="justify-content-center align-items-center import-games-list">
                    {
                        gamesResultsOut.map((game) => (
                            <Col key={game.id} style={{paddingBottom: '20px'}}>
                                <Card data-bs-theme="dark" style={{width: '95%', height: '30%'}} className="text-center"
                                      border='secondary'>
                                    <Card.Img variant="top"
                                              src={game.cover?.url?.replace('t_thumb', 't_cover_big') || ''}/>
                                    <Card.Body style={{
                                        height: '90%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Card.Title style={{fontSize: '105%'}}>{game.name}</Card.Title>
                                        {/*<Card.Text style={{fontSize: '95%'}}>*/}
                                        {/*    <Container>*/}
                                        {/*        {game.platforms && (*/}
                                        {/*            game.platforms.map((platform) => `${platform.abbreviation?.replace(' ', '-') || ''} `)*/}
                                        {/*        )}*/}
                                        {/*    </Container>*/}
                                        {/*</Card.Text>*/}
                                        <Button style={{width: '80%', height: '30%', fontSize: '75%'}} variant="primary"
                                                href={`/game/${game.id}`}>Get info</Button>
                                        <br/>
                                        <Form.Check
                                            style={{fontSize: '90%'}}
                                            type="switch"
                                            label="Add game"
                                            checked={game.isChecked}
                                            onChange={() => handleSwitchChange(game.id)}
                                        />
                                    </Card.Body>
                                    {/*<Card.Footer className="text-muted">*/}
                                    {/*    {game.first_release_date*/}
                                    {/*        ? new Date(game.first_release_date * 1000).toLocaleDateString()*/}
                                    {/*        : game.release_dates && game.release_dates[0].y}*/}
                                    {/*</Card.Footer>*/}
                                </Card>
                            </Col>)
                        )
                    }
                    {/*<div>*/}
                    {/*    <h3>Checked Game IDs:</h3>*/}
                    {/*    <ul>*/}
                    {/*        {getCheckedGameIds().map(id => (*/}
                    {/*            <li key={id}>{id}</li>*/}
                    {/*        ))}*/}
                    {/*    </ul>*/}
                    {/*</div>*/}
                </Container>
            )
        } else {
            return (
                <Container style={{textAlign: "center", maxWidth: "500px"}}>
                    <Alert>Games not found</Alert>
                </Container>
            )
        }
    };

    return (
        renderUserGames()
    );
}

export default ImportGamesList;
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import {Alert} from "react-bootstrap";

function FranchiseGames({franchiseGames}) {
    const renderUserGames = () => {
        let gamesResultsOut = franchiseGames;
        console.log(gamesResultsOut);

        if (Array.isArray(gamesResultsOut)) {
            return (
                <Container className="justify-content-center align-items-center games-list">
                    {
                        gamesResultsOut.map((game) => (
                            <Col key={game.id} style={{paddingBottom: '20px'}}>
                                <Card data-bs-theme="dark" style={{ width: '250px'}}  className="text-center" border='light'>
                                    <Card.Img variant="top" src={game.cover?.url?.replace('t_thumb', 't_cover_big') || ''}/>
                                    <Card.Body style={{ height: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                        <Card.Title style={{fontSize: '125%'}}>{game.name}</Card.Title>
                                        <Card.Text style={{fontSize: '95%'}}>
                                            <Container>
                                                {game.platforms && (
                                                    game.platforms.map((platform) => `${platform.abbreviation?.replace(' ', '-') || ''} `)
                                                )}
                                            </Container>
                                        </Card.Text>
                                        <Button style={{ width: '70%', fontSize: '75%'}} variant="primary" href={`/game/${game.id}`}>Get info</Button>
                                    </Card.Body>
                                    <Card.Footer className="text-muted">
                                        {game.first_release_date
                                            ? new Date(game.first_release_date * 1000).toLocaleDateString()
                                            : game.release_dates && game.release_dates[0].y}
                                    </Card.Footer>
                                </Card>
                            </Col>)
                        )}
                </Container>
            )
        }
        else {
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

export default FranchiseGames;
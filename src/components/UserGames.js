import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import {Spinner} from "react-bootstrap";

function UserGames({userGames}) {

    const renderUserGames = () => {
        let gamesResultsOut = userGames;

        // const gameList = localStorage.getItem('game_list');
        //
        // if (gameList === null) {
        //     console.log('localStorage is empty');
        // } else {
        //     // localStorage не пуст, удаляем game_list
        //     localStorage.removeItem('game_list');
        //     console.log('game_list removed');
        // }

        console.log("Ниже вывод " + JSON.stringify(gamesResultsOut));
        console.log("Это массив? " + Array.isArray(gamesResultsOut));

        if (Array.isArray(gamesResultsOut)) {
            return gamesResultsOut.map((game) => (
                <Col key={game.id} style={{paddingBottom: '20px'}}>
                    <Card data-bs-theme="dark" style={{ width: '250px'}}  className="text-center" border='light'>
                        <Card.Img variant="top" src={game.cover.url?.replace('t_thumb', 't_cover_big') || ''}/>
                        <Card.Body style={{ height: '175px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <Card.Title>{game.name}</Card.Title>
                            <Card.Text>
                                <Container>
                                    {game.platforms && (
                                        game.platforms.map((platform) => `${platform.abbreviation?.replace(' ', '-') || ''} `)
                                    )}
                                </Container>
                            </Card.Text>
                            <Button style={{ width: '60%'}} variant="primary" href={`/game/${game.id}`}>Get info</Button>
                        </Card.Body>
                        <Card.Footer className="text-muted">
                            {game.first_release_date
                                ? new Date(game.first_release_date * 1000).toLocaleDateString()
                                : game.release_dates && game.release_dates[0].y}
                        </Card.Footer>
                    </Card>
                </Col>));
        } else {
            return (
                <Spinner animation="border" role="status">
                </Spinner>
            );
        }
    };

    return (
        renderUserGames()
    );
}

export default UserGames;
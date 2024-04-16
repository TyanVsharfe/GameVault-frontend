import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import {Spinner} from "react-bootstrap";

function SearchComponent({ isLoading, searchResults }) {

    const loading = () => {
        // Implement loading UI logic here
        // (e.g., display a spinner or loading message)
        return <div>Loading...</div>; // Example loading indicator
    };

    const renderSearchResults = () => {
        let searchResultsOut = searchResults
        localStorage.removeItem(("game_list"))
        console.log("Вывел " + searchResultsOut);
        console.log(Array.isArray());
        if (Array.isArray(searchResultsOut)) {
            return searchResultsOut.map((game) => (
                <Col>
                    <Card data-bs-theme="dark" style={{ width: '15rem'}}  className="text-center" border='light'>
                        <Card.Img variant="top" src={game.cover?.url?.replace('t_thumb', 't_cover_big') || ''}/>
                        <Card.Body>
                            <Card.Title>{game.name}</Card.Title>
                            <Card.Text>
                                <Container>
                                    {game.platforms && (
                                        game.platforms.map((platform) => `${platform.abbreviation?.replace(' ', '-') || ''} `)
                                    )}
                                </Container>
                            </Card.Text>
                            <Button variant="primary">Get more</Button>
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
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            );
        }
    };

    return (
        renderSearchResults()
    );
}

export default SearchComponent;
import Container from "react-bootstrap/Container";
import React from "react";

const NotFoundPage: React.FC = () => {
    return (
        <Container style={{textAlign: "center", display: "flex", alignItems: "center", height: "80vh"}}>
            <Container>
                <h2>404</h2>
                <h3>Page not found.</h3>
            </Container>
        </Container>
    );
};

export default NotFoundPage;
import Container from "react-bootstrap/Container";
import React, {useEffect} from "react";
import {authService} from "../../api/services/authService";
import {useNavigate, useSearchParams} from "react-router-dom";

const VerifyEmailPage: React.FC = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        console.log(token);
        if (token != null) {
            console.log(token);
            authService.registerVerify(token).then(() => navigate("/account/games"));
        }
    }, [token]);

    return (
        <Container style={{textAlign: "center", display: "flex", alignItems: "center", height: "80vh"}}>
            <Container>
                <h2>Verifying email...</h2>
                <h3>Redirect</h3>
            </Container>
        </Container>
    );
};

export default VerifyEmailPage;
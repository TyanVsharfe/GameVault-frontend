import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import {loginUser, User} from "../../services/authService";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {verifySession} from "../../store/authSlice";
import {Stack} from "react-bootstrap";
import {useTranslation} from "react-i18next";

const LoginPage: React.FC = () => {
    const { t } = useTranslation();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            await loginUser(formData);
            dispatch(verifySession() as any);
            navigate('/account/games');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        }
    };


    return (
        <Container style={{ justifyContent: 'center', width: '300px', display: 'flex', flexDirection: 'column', verticalAlign: 'top', height: '70vh' }}>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicLogin">
                    <Form.Label>
                        {t('login')}
                    </Form.Label>
                    <Form.Control type="text"
                                  name="username"
                                  placeholder="Login"
                                  value={login}
                                  onChange={(e) => setLogin(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>
                        {t('password')}
                    </Form.Label>
                    <Form.Control type="password"
                                  name="password"
                                  placeholder="Password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}/>
                    <Form.Text className="text-muted">
                        <br/>
                        <p style={{display: 'flex', justifyContent: 'space-between'}}>
                            {t('no_account')}? <a href="/registration">{t('need_register')}</a>
                        </p>
                        <p><a href="/forgot-password">{t('forgot_password')}?</a></p>
                    </Form.Text>
                </Form.Group>

                <Stack direction='horizontal' style={{'justifyContent': 'space-between'}}>
                    <Button variant="primary" type="submit">
                        {t('log_in')}
                    </Button>
                    <Form.Check type="checkbox" name="remember-me" label={t('remember_me')} />
                </Stack>
            </Form>
        </Container>
    );
};

export default LoginPage;


import React, {useState} from 'react';
import {authService} from "../../api/services/authService";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {verifySession} from "../../store/authSlice";
import {useTranslation} from "react-i18next";
import {Box, Button, Checkbox, Container, FormControl, Input, Link, Stack, Typography} from "@mui/joy";
import FormLabel from "@mui/joy/FormLabel";

const LoginPage: React.FC = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from ?? '/account/games';

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('')

    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            await authService.loginUser(formData);
            await dispatch(verifySession() as any).unwrap();

            navigate(from, { replace: true });
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        }
    };


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '70vh',
                width: '300px',
                mx: 'auto',
            }}
        >
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Stack spacing={2}>
                    <FormControl>
                        <FormLabel>{t('username')}</FormLabel>
                        <Input
                            type="text"
                            name="username"
                            placeholder={t('username')}
                            autoComplete={"username"}
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>{t('password')}</FormLabel>
                        <Input
                            type="password"
                            name="password"
                            placeholder={t('password')}
                            autoComplete={"current-password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Box sx={{ mt: 1.5 }}>
                            <Typography level="body-sm" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                {t('no_account')}?
                                <Link href="/registration" fontSize="xs">{t('need_register')}</Link>
                            </Typography>
                            <Typography level="body-xs" sx={{ mt: 0.5 }}>
                                <Link href="/reset-password" fontSize="xs">{t('forgot_password')}?</Link>
                            </Typography>
                        </Box>
                    </FormControl>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mt: 1 }}
                    >
                        <Button type="submit">
                            {t('login')}
                        </Button>
                        <Checkbox
                            label={t('remember_me')}
                            name="remember-me"
                            size="sm"
                        />
                    </Stack>
                </Stack>
            </form>
        </Box>
    );
};

export default LoginPage;


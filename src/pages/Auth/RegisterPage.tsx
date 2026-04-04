import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import { User } from "../../types/auth.types";
import {authService} from "../../api/services/authService";
import {Box, Button, Checkbox, Stack} from "@mui/joy";
import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";

const RegisterPage: React.FC = () => {
    const { t } = useTranslation();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user: User = {username: username, password: password, email: email};
        await authService.registerUser(user)
        navigate('/account/games')
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
            <form onSubmit={handleSubmit}>
                <Stack gap={2}>
                    <FormControl>
                        <FormLabel>
                            {t('username')}
                        </FormLabel>
                        <Input type="text"
                               placeholder={t('username')}
                               autoComplete={"off"}
                               value={username}
                               onChange={(e) => setUsername(e.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>{t('email')}</FormLabel>
                        <Input type="email"
                               placeholder="name@example.com"
                               autoComplete={"off"}
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>
                            {t('password')}
                        </FormLabel>
                        <Input
                            type="password"
                            placeholder={t('password')}
                            autoComplete={"off"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <Checkbox label={t('agree_with_terms')} />
                    </FormControl>
                    <Button type="submit">
                        {t('register')}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default RegisterPage;
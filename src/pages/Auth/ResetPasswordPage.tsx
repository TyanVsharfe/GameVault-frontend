import React, {useState} from 'react';
import {authService} from "../../api/services/authService";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Box, Button, FormControl, Input, Stack, Typography} from "@mui/joy";
import FormLabel from "@mui/joy/FormLabel";

const ResetPasswordPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await authService.resetPassword(email);
            alert(t('password_reset_in_progress') || 'Password reset in progress. Check your email.');
            navigate('/login');
        } catch (error) {
            console.error('Reset password failed:', error);
            alert('Reset password failed. Try again.');
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
            <Typography level="h4" component="h1" sx={{ mb: 2 }}>
                {t('reset_password') || 'Reset Password'}
            </Typography>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Stack spacing={2}>
                    <FormControl>
                        <FormLabel>{t('write_email')}</FormLabel>
                        <Input
                            type="email"
                            name="email"
                            placeholder={t('email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="solid"
                        color="primary"
                        sx={{ mt: 1, fontWeight: 'normal' }}
                    >
                        {t('send_reset_password_link') || 'Отправить ссылку для подтверждения'}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default ResetPasswordPage;


import React, {useState} from 'react';
import {authService} from "../../api/services/authService";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Box, Button, FormControl, Input, Stack, Typography} from "@mui/joy";
import FormLabel from "@mui/joy/FormLabel";

const ResetPasswordVerifyPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError(t('fill_all_fields') || 'Please fill all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError(t('passwords_do_not_match') || 'Passwords do not match');
            return;
        }

        try {
            await authService.resetPasswordVerify(token, password);
            alert(t('password_reset_success') || 'Password reset successfully!');
            navigate('/login');
        } catch (error) {
            console.error('Reset password failed:', error);
            setError(t('reset_failed') || 'Reset password failed. Try again.');
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
                        <FormLabel>{t('new_password')}</FormLabel>
                        <Input
                            type="password"
                            name="password"
                            placeholder={t('password')}
                            autoComplete={"new-password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>{t('confirm_password')}</FormLabel>
                        <Input
                            type="password"
                            name="confirm-password"
                            placeholder={t('password')}
                            autoComplete={"new-password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="solid"
                        color="primary"
                        sx={{ mt: 1, fontWeight: 'normal' }}
                    >
                        {t('update_password') || 'Update Password'}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default ResetPasswordVerifyPage;


import React from "react";
import {Snackbar, Typography} from "@mui/joy";
import ErrorIcon from "@mui/icons-material/Error";
import DoneIcon from "@mui/icons-material/Done";

export interface ToastProps {
    module: string;
    message: string;
    isSuccess: boolean;
    open: boolean;
}

export const Toast: React.FC<ToastProps> = ({module, message, isSuccess, open}) => {
    return (
        <Snackbar
            variant="soft"
            color={isSuccess ? "success" :"warning"}
            autoHideDuration={4000}
            open={open}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            startDecorator={isSuccess ? <DoneIcon/> : <ErrorIcon/>}
        >
            {message}
        </Snackbar>
    );
};
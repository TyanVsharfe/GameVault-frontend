import React, {StrictMode} from 'react';
import ReactDOM, {createRoot} from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./App";
import {Provider} from "react-redux";
import {store} from "./store/store";
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import theme from "./theme";
import initI18n from './i18n';

initI18n().then(() => {
    createRoot(document.getElementById('root')!).render(
        //<StrictMode>
        <Provider store={store}>
            <CssVarsProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </CssVarsProvider>
        </Provider>
    //</StrictMode>,
    );
})



import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { I18nextProvider } from 'react-i18next'

import App from './App.jsx'
import theme from './theme/theme.js'
import i18n from './i18n/i18n.js'
import './index.css'

// Initialize axe for accessibility testing in development
if (process.env.NODE_ENV !== 'production') {
    import('@axe-core/react').then((axe) => {
        axe.default(React, ReactDOM, 1000);
    });
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <I18nextProvider i18n={i18n}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </I18nextProvider>
    </React.StrictMode>,
)

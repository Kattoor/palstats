import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {PrimeReactProvider} from 'primereact/api';
import "primereact/resources/themes/md-dark-indigo/theme.css";
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PrimeReactProvider>
            <App/>
        </PrimeReactProvider>
    </React.StrictMode>,
)
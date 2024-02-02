import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './App.css'
import {PrimeReactProvider} from 'primereact/api';
import "primereact/resources/themes/md-dark-indigo/theme.css";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootPage from "./root-page/RootPage.tsx";
import {PlayerGuildProvider} from "./custom-contexts/player-guild-context/PlayerGuildContext.tsx";
import GuildPage from "./guild-page/GuildPage.tsx";
import PlayerPage from "./player-page/PlayerPage.tsx";

/* fieldset */
/* dataview grid */


const router = createBrowserRouter([
    {
        path: "/",
        element: <RootPage/>,
    },
    {
        path: "/guild/:id",
        element: <GuildPage/>
    },
    {
        path: "/player/:id",
        element: <PlayerPage/>
    }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PrimeReactProvider>
            <PlayerGuildProvider>
                <RouterProvider router={router}/>
            </PlayerGuildProvider>
        </PrimeReactProvider>
    </React.StrictMode>,
)

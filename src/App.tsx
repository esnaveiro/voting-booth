import React from 'react';
import { useRoutes } from "react-router-dom"
import { routes } from './constants/routes.const';

export const App: React.FC = () => {
    const routesObj = useRoutes(routes);

    return (
        <>
            {routesObj}
        </>
    );
}
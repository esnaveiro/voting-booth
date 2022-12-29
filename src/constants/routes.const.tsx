import { RouteObject } from 'react-router-dom';
import { PrivateLayout } from '../layouts/private.layout';
import { PublicLayout } from '../layouts/public.layout';
import { AdminPage } from '../pages/admin.page';
import { LoginPage } from '../pages/login.page';
import { QuestionsPage } from '../pages/questions.page';
import { PATHS } from './paths.const';

export const routes: RouteObject[] = [
    {
        children: [
            {
                element: <LoginPage />, path: PATHS.LOGIN,
            },
        ],
        element: <PublicLayout />,
        path: '/',
    },
    {
        children: [
            { element: <AdminPage />, path: PATHS.ADMIN, },
            { element: <QuestionsPage />, path: PATHS.POLL }
        ],
        element: <PrivateLayout />,
        path: '/',
    }
]
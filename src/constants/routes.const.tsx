import { RouteObject } from 'react-router-dom';
import { PublicLayout } from '../layouts/public.layout';
import { AdminPage } from '../pages/admin.page';
import { QuestionsPage } from '../pages/questions.page';
import { PATHS } from './paths.const';

export const routes: RouteObject[] = [
    {
        children: [
            { element: <QuestionsPage />, path: PATHS.POLL },
        ],
        element: <PublicLayout />,
        path: '/',
    },
    {
        children: [
            { element: <AdminPage />, path: PATHS.ADMIN },
        ],
        element: <PublicLayout />,
        path: '/',
    }
]
import { createHashRouter, RouteObject } from 'react-router-dom';
import { routes as appRoutes } from './routes';

const routes: RouteObject[] = [appRoutes];

export const router = createHashRouter(routes);

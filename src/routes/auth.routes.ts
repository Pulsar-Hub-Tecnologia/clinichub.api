import AuthController from '@controllers/AuthController';
import Router from 'express';

const routes = Router();

routes.post('/', AuthController.authenticate);
routes.post('/forgot-password', AuthController.forgotPassword);
routes.post('/recover-password', AuthController.resetPassword);

export default routes;

import Router from 'express';
import AccountController from '@controllers/AccountController';

const AccountRoutes = Router();
AccountRoutes.post('/', AccountController.create);
AccountRoutes.put('/', AccountController.update);
AccountRoutes.get('/', AccountController.find);
AccountRoutes.get('/validate/', AccountController.validate);
AccountRoutes.get('/accesses/', AccountController.accesses);
AccountRoutes.post('/accesses/sign-workspace', AccountController.signWorkspace);

export default AccountRoutes;

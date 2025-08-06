import Router from 'express';
import AccountController from '@controllers/AccountController';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { ensureProfile } from '@middlewares/ensureProfile';

const AccountRoutes = Router();
AccountRoutes.get('/validate/', AccountController.validate);
AccountRoutes.post('/',  AccountController.create);
AccountRoutes.put('/',  ensureAuthenticated, ensureProfile, AccountController.update);
AccountRoutes.get('/', ensureAuthenticated, ensureProfile, AccountController.find);
AccountRoutes.get('/accesses/', ensureAuthenticated, ensureProfile, AccountController.accesses);
AccountRoutes.post('/accesses/sign-workspace', ensureAuthenticated, ensureProfile, AccountController.signWorkspace);

export default AccountRoutes;

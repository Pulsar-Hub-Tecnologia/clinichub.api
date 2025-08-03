import Router from 'express';
import AccountController from '@controllers/AccountController';


const AccountRoutes = Router();
AccountRoutes.post('/', AccountController.create);
AccountRoutes.get('/', AccountController.findAccount);
AccountRoutes.put('/', AccountController.update);


export default AccountRoutes;
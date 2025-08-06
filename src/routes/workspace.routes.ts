import Router from 'express';
import WorkspaceController from '@controllers/WorkspaceController';

const WorkspaceRoutes = Router();;
WorkspaceRoutes.put('/', WorkspaceController.update);
WorkspaceRoutes.get('/', WorkspaceController.find);

export default WorkspaceRoutes;

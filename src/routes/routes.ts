import Router from 'express';
import AuthRoutes from './auth.routes';
import AccountRoutes from './account.routes';
import WorkspaceRoutes from './workspace.routes';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { ensureWorkspace } from '@middlewares/ensureWorkspace';
import { ensureAdmin } from '@middlewares/ensureAdmin';

const routes = Router();

const port = process.env.APP_PORT;
const base = { 'API ClinicHUB':  process.env.ENVIROMENT };

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API ClinicHUB',
      version: '1.0.0',
      description: 'Documentação da API',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/app/controllers/*.ts', './src/app/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

routes.get('/', (req, res) => {
  res.json(base);
});

routes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
routes.use('/auth/', AuthRoutes);
routes.use('/account', AccountRoutes);
routes.use('/workspace', ensureAuthenticated, ensureWorkspace, ensureAdmin, WorkspaceRoutes);

export default routes;

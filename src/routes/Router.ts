import { Controller } from '@app/routes/controllers/Controller';
import express from 'express';
import { List } from 'immutable';
import { container } from 'tsyringe';

export class Router {
  private readonly controllers: List<Controller>;

  constructor() {
    this.controllers = List<Controller>([
      container.resolve<Controller>('ProfileController'),
      container.resolve<Controller>('AuthController'),
    ]);
  }

  public mountRoutes(app: express.Application): void {
    const prefix = '/';
    const router = express.Router();

    router.get('/', (req: express.Request, res: express.Response) => {
      res.json({
        message: 'TEST APP',
      });
    });
    app.use(prefix, router);

    this.controllers.forEach((c: Controller) => {
      const router = express.Router();

      c.initialize(router);
      const path = prefix === '/' ? c.path() : prefix + c.path();

      app.use(path, router);
    });
  }
}

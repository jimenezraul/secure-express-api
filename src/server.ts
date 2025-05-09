import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { RoleRoute } from './routes/roles.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const routes = [
    new UserRoute(),
    new AuthRoute(),
    new RoleRoute()
    ];

const app = new App(routes);

app.listen();

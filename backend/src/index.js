import path from 'path';
import feathers from 'feathers';
import cors from 'cors';
import bodyParser from 'body-parser';
import compress from 'compression';
import configuration from 'feathers-configuration';
import rest from 'feathers-rest';
import socketio from 'feathers-socketio';
import hooks from 'feathers-hooks';
import services from './services';
import { NotFound } from 'feathers-errors';
import handler from 'feathers-errors/handler';
import methodOverride from 'method-override';
import resetHandler from './services/resetPassword/handler';

const app = feathers();

app.set('views', path.resolve(__dirname, '..', 'views'));
app.set('view engine', 'pug');

app.configure(configuration(path.join(__dirname, '..')));

app.use(compress())
  .options('*', cors())
  .use(methodOverride('_method'))
  .use(cors())
  .use(bodyParser.json({ limit: app.get('limits').bodyParser.json }))
  .use(bodyParser.urlencoded({ limit: app.get('limits').bodyParser.urlencoded, extended: true }))
  .configure(hooks())
  .configure(resetHandler)
  .configure(rest())
  .configure(socketio())
  .configure(services)
  .use((req, res, next) => next(new NotFound()))
  .use(handler({ html: false }))
  .listen(app.get('port'));

export default app;

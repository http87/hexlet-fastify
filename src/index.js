import path from 'path';
import { fileURLToPath } from 'url';
import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import fastifyStatic from '@fastify/static';
import formbody from '@fastify/formbody';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes'; // именование маршрутов
import middie from '@fastify/middie'; // Middleware
import morgan from 'morgan'; // логирования запросов
import fastifyCookie from '@fastify/cookie'; // Для работы с куками в Fastify
import { getDateNow } from './utils.js';

import addRoutes from './routes/index.js';

export default async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  const app = fastify({ exposeHeadRoutes: false });
  
  const logger = morgan('combined');

  // подключаем middleware
  await app.register(middie);
  app.use(logger);
  // подключаем библиотеку для именования маршрутов
  await app.register(fastifyReverseRoutes);

  await app.register(fastifyCookie);

  const route = (name, placeholdersValue) => app.reverse(name, placeholdersValue);
  
  const dateNow = getDateNow();
  // подключаем шаблонизатор pug
  await app.register(view, {
    engine: { pug },
    defaultContext: {
      route,
      dateNow,
    },
  });

  // подключаем парсер формы
  await app.register(formbody);
  
  // подключаем css с подменой пути
  app.register(fastifyStatic, {
    root: path.join(__dirname,'../node_modules/bootstrap/dist/css'),
    prefix: '/assets/',
  });

  app.get('/', { name: 'home' }, (req, res) => {
    const visited = req.cookies.visited;
    const templateData = {
      visited,
    };
    res.cookie('visited', true);

    res.view('src/views/index', templateData);
  });

  // app.use((req, res) => {
  //   res.end('Hello from meddleware!');
  // });

  addRoutes(app);

  return app;
};


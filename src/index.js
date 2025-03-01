import path from 'path';
import { fileURLToPath } from 'url';
import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import fastifyStatic from '@fastify/static';
import formbody from '@fastify/formbody';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
import { getDateNow } from './utils.js';

import addRoutes from './routes/index.js';

export default async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  const app = fastify({ exposeHeadRoutes: false });
  
  // подключаем библиотеку для именования маршрутов
  await app.register(fastifyReverseRoutes);
  
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

  app.get('/', { name: 'home' }, (req, res) => res.view('src/views/index'));

  addRoutes(app);

  return app;
};


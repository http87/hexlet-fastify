import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import getUsers from '../src/users.js';
import { getDateNow } from './my-func/get-date.js';

const app = fastify();
const port = 3000;

const users = getUsers();
const dateNow = getDateNow();

// Подключаем pug через плагин
await app.register(view, { engine: { pug } });

app.get('/users', (req, res) => {
  const data = {
    users,
    dateNow,
  };
  res.view('src/views/users/show', data);
});

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);

  if (!user) {
    res.code(404).send('User not found');
    return;
  }
  const data = {
    user,
    dateNow,
  };
  res.view('src/views/users/index', data);
});

app.listen({ port }, () => {
  console.log(`Example app listening in port ${port}!`);
});

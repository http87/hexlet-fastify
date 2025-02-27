import path from 'path';
import { fileURLToPath } from 'url';
import fastify from 'fastify';
import sanitize from 'sanitize-html';
import view from '@fastify/view';
import pug from 'pug';
import fastifyStatic from '@fastify/static';
import formbody from '@fastify/formbody';
import getUsers from '../src/users.js';
import { getDateNow } from './my-func/get-date.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();
const port = 3000;

// const users = getUsers();
const dateNow = getDateNow();

await app.register(view, { engine: { pug } });
await app.register(formbody);

const state = {
  users: [
    {
      name: 'Alex',
      email: 'arbuzov@yandex.ru',
      password: 'asdf'
    }
  ]
}

const users = state.users;

app.register(fastifyStatic, {
  root: path.join(__dirname,'../node_modules/bootstrap/dist/css'),
  prefix: '/assets/',
});

app.get('/', (req, res) => res.view('src/views/index'));

app.get('/users', (req, res) => {
  const { term } = req.query;
  let currentUser = users;
  if (term) {
    currentUser = currentUser.filter((user) => user.name
      .toLowerCase().includes(term.toLowerCase()));
  }
  const data = {
    users: currentUser,
    term,
    dateNow,
  };
  res.view('src/views/users/index', data);
});

app.get('/users/:id', (req, res) => {
  const escapedId = sanitize(req.params.id);
  const user = users.find((user) => user.name === escapedId);
  if (!user) {
    res.code(404).send('User not found');
    return;
  }
  const data = {
    user,
    dateNow,
  };
  res.view('src/views/users/show', data);
});

app.get('/users/new', (req, res) => {
  res.view('src/views/users/new');
});

app.post('/users', (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email.trim().toLowerCase(),
    password: req.body.password,
  };

  state.users.push(user);

  res.redirect('/users');
});

app.listen({ port }, () => {
  console.log(`Example app listening in port ${port}!`);
});

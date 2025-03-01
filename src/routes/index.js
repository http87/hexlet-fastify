import users from './users.js';
import posts from './posts.js';

const controllers = [
  users,
  posts,
];

export default (app) => controllers.forEach((f) => f(app));

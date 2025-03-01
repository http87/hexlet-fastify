import { generateId, getDateNow, getUsers } from '../utils.js';
import * as yup from 'yup';
import sanitize from 'sanitize-html';

export default (app) => {
  const users = getUsers();

  // маршруты
  app.get('/users', { name: 'users' }, (req, res) => {
    const { term } = req.query;
    let currentUser = users;
    if (term) {
      currentUser = currentUser.filter((user) => user.name
        .toLowerCase().includes(term.toLowerCase()));
    }
    const data = {
      users: currentUser,
      term,
    };
    res.view('src/views/users/index', data);
  });

  app.get('/users/:id', { name: 'user' }, (req, res) => {
    const escapedId = sanitize(req.params.id);
    const user = users.find((user) => user.id === escapedId);
    if (!user) {
      res.code(404).send('User not found');
      return;
    }
    const data = {
      user,
    };
    res.view('src/views/users/show', data);
  });

  app.get('/users/new', { name: 'newUser' }, (req, res) => {
    res.view('src/views/users/new');
  });

  app.post('/users', {
    attachValidation: true,
    schema: {
      body: yup.object({
        name: yup.string().min(2, 'Не менее 2х символов'),
        email: yup.string().email(),
        password: yup.string().min(5),
        passwordConfirmation: yup.string().min(5),
      }),
    },
    validatorCompiler: ({ schema }) => (data) => {
      if (data.password != data.passwordConfirmation) {
        return {
          error: Error('Password confirmation is not equal the password'),
        };
      }

      try {
        const result = schema.validateSync(data);
        return { value: result };
      } catch (e) {
        return { error: e };
      }
    }
  }, (req, res) => {
    const { name, email, password, passwordConfirmation } = req.body;


    const currentEmail = users.find(({ email }) =>
      req.body.email.toLowerCase() === email.toLowerCase());
    
    if (currentEmail) {
      const data = {
        name, email, password, passwordConfirmation,
        error: Error('Такой пользователь уже существует'),
      };
      res.view('src/views/users/new', data);
      return;
    }

    if (req.validationError) {
      const data = {
        name, email, password, passwordConfirmation,
        error: req.validationError,
      };

      res.view('src/views/users/new', data);
      return;
    }

    const user = {
      id: generateId(),
      name,
      email,
      password,
    };

    users.push(user);

    res.redirect(app.reverse('user', { id: user.id }));
  });
};

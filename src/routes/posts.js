import _ from 'lodash';
import { getPosts, generateId } from "../utils.js";
import * as yup from 'yup';
import sanitize from 'sanitize-html';

export default (app) => {
  const posts = getPosts();

  app.get('/posts/:id', { name: 'post' }, (req, res) => {
    const post = posts.find(({ id }) => id === req.params.id);
    if (!post) {
      res.status(404).send('Post not found');
      return;
    }
    res.view('src/views/posts/show', { post });
  });

  app.get('/posts', { name: 'posts' }, (req, res) => {
    const per = 5;
    const chunked = _.chunk(posts, per);

    let page = parseInt(req.query.page || 1, 10);
    page = page < 0 ? 1 : page;
    const previousPage = page === 1 ? 1 : page - 1;
    const nextPage = page > chunked.length ? chunked.length : page + 1;

    const data = {
      posts: page <= chunked.length ? chunked[page - 1] : [],
      page,
      previousPage,
      nextPage,
    };

    res.view('src/views/posts/index', data);
  });

  app.get('/posts/new', { name: 'newPost'}, (req, res) => {
    res.view('src/views/posts/new');
  });

  app.post('/posts', {
    attachValidation: true,
    schema: {
      body: yup.object({
        name: yup.string().min(2, 'Не менее 2х символов'),
        body: yup.string().min(2, 'Не менее 2х символов'),
      }),
    },
    validatorCompiler: ({ schema }) => (data) => {
      try {
        const result = schema.validateSync(data);
        return { value: result };
      } catch (e) {
        return { error: e };
      }
    }
  }, (req, res) => {
    const { title, body } = req.body;

    const currentPost = posts.find(({ title }) => 
      title.toLowerCase() === req.body.title.toLowerCase());

    if (currentPost) {
      const data = {
        title, body,
        error: Error('Статья с таким именем уже существует'),
      }

      res.view('src/views/posts/new', data);
      return;
    }
    // если ошибка, то сновая открывает страницу заполнения формы
    // заполняем форму
    if (req.validationError) {
      const data = {
        title, body,
        error: req.validationError,
      }

      res.view('src/views/posts/new', data);
      return;
    }

    const post = {
      id: generateId(),
      title,
      body,
    };

    posts.push(post);
    res.redirect(app.reverse('post', { id: post.id }));
  });
};
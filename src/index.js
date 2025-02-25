import fastify from 'fastify';

const app = fastify();
const port = 3000;

const state = {
  users: [
    {
      id: 1,
      post: 'pilot',
    },
    {
      id: 2,
      post: 'teacher',
    }
  ]
}

app.get('/user/:id/post/:postId', (req, res) => {
  const { id, postId } = req.params;
  const user = state.users.find((user) => {
    if (user.id === parseInt(id) && user.post === postId) {
      return user.id;
    }
  });
  if (!user) {
    res.code(404).send({ message: 'User not found' });
  } else {
    res.send(user);
  }
});

app.listen({ port }, () => {
  console.log(`Example app listening in port ${port}!`);
});

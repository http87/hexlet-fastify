import fastify from 'fastify';

const app = fastify();
const port = 3000;

app.get('/hello', (req, res) => {
  const { name } = req.query;
  if (!name) {
    res.send('Hello World');
  } else {
    res.send(`Hello, ${name}`);
  }
});


app.listen({ port }, () => {
  console.log(`Example app listening in port ${port}!`);
});

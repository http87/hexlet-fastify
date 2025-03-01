import build from '../src/index.js';

const app = await build();
const port = process.env.PORT || 8080;
app.listen({ port, host: '0.0.0.0' });

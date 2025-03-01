import { faker } from '@faker-js/faker';
import CryptoJS from 'crypto-js';

const crypto = (password) => CryptoJS.SHA256(password);

const createRandomUser = () => ({
  id: faker.string.uuid(),
  name: faker.internet.username(),
  email: faker.internet.email(),
  password: crypto(faker.internet.password()),
});

const getUsers = () => {
  faker.seed(123);
  return faker.helpers.multiple(createRandomUser, {
    count: 5,
  });
};

const generateId = () => faker.string.uuid();

const getDateNow = () => {
  const today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

const createRandomPost = () => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraphs(),
});

const getPosts = () => {
  faker.seed(123);
  return faker.helpers.multiple(createRandomPost, {
    count: 100,
  });
};

export {
  crypto,
  getUsers,
  generateId,
  getDateNow,
  getPosts,
};
import test from 'japa'
import { supertest, before } from '../test-helpers/helper'
import Config from '@ioc:Adonis/Core/Config'

const client = supertest()
const user = Config.get('app.defaultUser')

test.group('Auth test', (group) => {
  group.before(async () => {
    await before(client)
  })
  test('Login', async () => {
    await client.post('/api/auth/login').send(user).expect(200)
    await client
      .post('/api/auth/login')
      .send({ ...user, email: '123@mail.ru' })
      .expect(422)
    await client
      .post('/api/auth/login')
      .send({ ...user, password: 'random' })
      .expect(422)
  })

  test('Logout', async () => {
    await client.post('/api/auth/login').send(user).expect(200)
    await client.get('/api/auth/logout').expect(200)
  })
})

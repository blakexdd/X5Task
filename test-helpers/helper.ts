import Supertest from 'supertest'
import Config from '@ioc:Adonis/Core/Config'

export const supertest = () => {
  const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
  const apiClient = Supertest.agent(BASE_URL)
  for (const method of ['get', 'del', 'post', 'delete', 'put', 'patch']) {
    const methodOld = apiClient[method]
    apiClient[method] = (...args) => {
      const req = methodOld.apply(apiClient, args)
      const assert = req._assertStatus
      req._assertStatus = (status, res) => {
        const err: Error = assert.call(req, status, res)
        if (err) {
          const errMessage = err + ' ' + res.req.method + ' ' + res.req.path + ' ' + res.text
          const newErr = new Error(errMessage)
          newErr.stack = errMessage
          return newErr
        }
      }
      return req
    }
  }
  return apiClient
}

export async function before(client) {
  const userObject = Config.get('app.defaultUser')

  await client.post('/api/auth/login').send(userObject).expect(200)
}

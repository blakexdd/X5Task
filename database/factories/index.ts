import Factory from '@ioc:Adonis/Lucid/Factory'
import Order from 'App/Models/Order'
import User from 'App/Models/User'

export const OrderFactory = Factory.define(Order, ({ faker }) => {
  return {
    name: faker.name.jobTitle(),
  }
}).build()

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    problem: faker.datatype.boolean(),
  }
})
  .relation('order', () => OrderFactory)
  .build()

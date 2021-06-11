import Database from '@ioc:Adonis/Lucid/Database'
import Order from 'App/Models/Order'
import User from 'App/Models/User'
import { ElkLogger } from 'App/Services/HelperService'
import { ServiceNames, UpdatedUsersCount } from 'Contracts/types'

export async function updateUsersProblemStateSlowSpeed(): Promise<UpdatedUsersCount> {
  const orders = await Order.query().select('user_id')
  ElkLogger.log(ServiceNames.ORDERS, 'Getting orders', orders)
  const users: User[] = []
  let count = 0

  for (const order of orders) {
    const user = await User.findOrFail(order.user_id)
    users.push(user)
  }
  ElkLogger.log(ServiceNames.ORDERS, 'Users got', users)

  for (const user of users) {
    if (!user.problem) {
      count++
    }
    user.problem = true
    await user.save()
  }

  ElkLogger.log(ServiceNames.ORDERS, 'Users updated', count)
  return { count }
}

export async function updateUsersProblemStateMediumSpeed(): Promise<UpdatedUsersCount> {
  const orders = await Order.query().select('user_id')
  ElkLogger.log(ServiceNames.ORDERS, 'Getting orders', orders)
  const userIdsToGet: number[] = orders.map((order) => order.user_id)
  ElkLogger.log(ServiceNames.ORDERS, 'Users ids to get', userIdsToGet)
  const users: User[] = await User.query().whereIn('id', userIdsToGet)
  ElkLogger.log(ServiceNames.ORDERS, 'Users got', users)
  const userIdsWithProblems: number[] = users.filter((user) => !user.problem).map((user) => user.id)
  ElkLogger.log(ServiceNames.ORDERS, 'Users ids with problems', userIdsWithProblems)

  await User.query().whereIn('id', userIdsWithProblems).update({ problem: true })

  const count = userIdsWithProblems.length
  ElkLogger.log(ServiceNames.ORDERS, 'Users updated', count)
  return { count }
}

export async function updateUsersProblemStateHighSpeed(): Promise<UpdatedUsersCount> {
  const updateResult = await Database.rawQuery(
    'UPDATE users SET problem=true WHERE id IN (SELECT user_id FROM orders);'
  )
  ElkLogger.log(ServiceNames.ORDERS, 'Users updated', updateResult)

  return { count: updateResult[0]['affectedRows'] }
}

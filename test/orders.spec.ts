import test from 'japa'
import { supertest, before } from '../test-helpers/helper'
import { UserFactory } from 'Database/factories'
import { ElkLogger } from 'App/Services/HelperService'
import { ServiceNames } from 'Contracts/types'
import {
  updateUsersProblemStateHighSpeed,
  updateUsersProblemStateMediumSpeed,
  updateUsersProblemStateSlowSpeed,
} from 'App/Services/OrderService'
import Perf from 'execution-time'

const client = supertest()
const perf = Perf()

test.group('Orders test', (group) => {
  group.before(async () => {
    if (process.env.CREATE_USER_ORDERS) {
      const users = await UserFactory.with('order', 1000).createMany(5000)
      ElkLogger.log(ServiceNames.ORDERS, 'Created users with posts', users)
    }
    await before(client)
  })

  test('High speed func', async () => {
    perf.start()
    const count = await updateUsersProblemStateHighSpeed()
    const result = perf.stop()
    ElkLogger.log(ServiceNames.ORDERS, 'Updated users', count)
    ElkLogger.log(ServiceNames.ORDERS, `Exec time high speed ${result.time}`)
  }).timeout(50000)

  test('Medium speed func', async () => {
    perf.start()
    const count = await updateUsersProblemStateMediumSpeed()
    const result = perf.stop()
    ElkLogger.log(ServiceNames.ORDERS, 'Updated users', count)
    ElkLogger.log(ServiceNames.ORDERS, `Exec time medium speed ${result.time}`)
  }).timeout(50000)

  test('Slow speed func', async () => {
    perf.start()
    const count = await updateUsersProblemStateSlowSpeed()
    const result = perf.stop()
    ElkLogger.log(ServiceNames.ORDERS, 'Updated users', count)
    ElkLogger.log(ServiceNames.ORDERS, `Exec time slow speed ${result.time}`)
  }).timeout(50000)
})

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Config from '@ioc:Adonis/Core/Config'

export default class MainSeederSeeder extends BaseSeeder {
  public async run() {
    const userObject = Config.get('app.defaultUser')
    await User.firstOrCreate({ email: userObject.email }, userObject)
  }
}

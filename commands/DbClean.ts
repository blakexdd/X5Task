import { BaseCommand, Kernel } from '@adonisjs/core/build/standalone'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { DatabaseContract } from '@ioc:Adonis/Lucid/Database'

export default class DbClean extends BaseCommand {
  public static commandName = 'db:clean'
  public static description = ''
  private db: DatabaseContract
  public static settings = {
    loadApp: true,
  }

  constructor(app: ApplicationContract, kernel: Kernel) {
    super(app, kernel)
    this.db = app.container.use('Adonis/Lucid/Database')
  }

  public async run() {
    const [mysqlTables] = await this.db.connection('mysql').rawQuery('SHOW TABLES').exec()

    await this.db.rawQuery('SET FOREIGN_KEY_CHECKS = 0')

    for (const mysqlTable of mysqlTables) {
      await this.db.rawQuery('DROP TABLE ??', Object.values(mysqlTable))
    }

    await this.db.rawQuery('SET FOREIGN_KEY_CHECKS = 1')

    process.exit(0)
  }
}

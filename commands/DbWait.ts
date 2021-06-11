import { BaseCommand, Kernel } from '@adonisjs/core/build/standalone'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { DatabaseContract } from '@ioc:Adonis/Lucid/Database'

const sleep = (ms: number = 1000): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export default class DbWait extends BaseCommand {
  public static commandName = 'db:wait'
  public static description = ''
  private db: DatabaseContract
  public static settings = {
    loadApp: true,
  }
  private tries = 100

  constructor(app: ApplicationContract, kernel: Kernel) {
    super(app, kernel)
    this.db = app.container.use('Adonis/Lucid/Database')
  }
  public async run() {
    for (let i = 0; i < this.tries; i++) {
      try {
        await this.db.connection('mysql').rawQuery('SHOW TABLES').exec()
        break
      } catch (e) {
        console.log(e)
      }

      await sleep(5000)
    }

    process.exit(0)
  }
}

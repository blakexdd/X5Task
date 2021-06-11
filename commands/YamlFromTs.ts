import { BaseCommand } from '@adonisjs/core/build/standalone'
import { convert } from 'ts-to-openapi'
import { promises as fs } from 'fs'

export default class Yamlfromts extends BaseCommand {
  public static commandName = 'yamlFromTs'
  public static description = ''

  private async generateInterfaces() {
    const converted = convert({
      asComment: false,
      path: './contracts/types/index.ts',
      tsConfigPath: './tsconfig.json',
      sortProperties: false,
      skipTypeCheck: false,
      detectGraphQL: false,
      types: ['*'],
    })
      .replace(/default:/g, 'example:')
      .replace(/\$AT/g, '@')
    await fs.writeFile('./docs/swagger/generatedInterfaces.yaml', converted, { encoding: 'utf-8' })
  }

  public async run() {
    await this.generateInterfaces()
  }
}

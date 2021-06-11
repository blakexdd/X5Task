import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected usersTableName = 'users'
  protected ordersTableName = 'orders'

  public async up() {
    this.schema.createTable(this.usersTableName, (table) => {
      table.increments('id').primary()
      table.timestamps(true)
      table.string('email', 255).notNullable()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.boolean('problem').notNullable().defaultTo(false)
    })
    this.schema.createTable(this.ordersTableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().nullable().defaultTo(null).index()
      table.foreign('user_id').references('id').inTable('users').onDelete('restrict')
      table.string('name').notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.usersTableName)
    this.schema.dropTable(this.ordersTableName)
  }
}

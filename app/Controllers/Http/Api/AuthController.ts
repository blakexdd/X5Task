import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ValidationException from 'App/Exceptions/ValidationException'

export default class AuthController {
  public async login({ request, auth }: HttpContextContract): Promise<{}> {
    const { email, password, rememberMe } = await request.validate({
      schema: schema.create({
        email: schema.string({ trim: true }, [rules.email()]),
        password: schema.string({}, [rules.minLength(6), rules.maxLength(128)]),
        rememberMe: schema.boolean.optional(),
      }),
      data: request.all(),
    })

    try {
      await auth.attempt(email.toLowerCase(), password, !!rememberMe)
    } catch (err) {
      throw new ValidationException(['Wrong credentials'], 422)
    }

    return {}
  }

  public async logout({ auth }: HttpContextContract): Promise<{}> {
    await auth.logout()

    return {}
  }
}

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ValidationException from 'App/Exceptions/ValidationException'
import { ElkLogger } from 'App/Services/HelperService'
import { ServiceNames } from 'Contracts/types'

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
    ElkLogger.log(ServiceNames.AUTH, 'Login', { email, password, rememberMe })

    try {
      await auth.attempt(email.toLowerCase(), password, !!rememberMe)
    } catch (err) {
      ElkLogger.error(ServiceNames.AUTH, 'Error login', err)
      throw new ValidationException(['Wrong credentials'], 422)
    }

    return {}
  }

  public async logout({ auth }: HttpContextContract): Promise<{}> {
    ElkLogger.log(ServiceNames.AUTH, 'Logout', { userId: auth.user?.id })
    await auth.logout()

    return {}
  }
}

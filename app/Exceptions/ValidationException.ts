import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

interface AdonisError {
  rule: string
  field: string
  message: string
}

interface ErrorObjectInterface {
  success?: boolean
  isCustomErrors?: boolean
  errors: string[] | AdonisError[]
}

export default class ValidationException extends Error {
  public name: string
  public help?: string

  constructor(
    public errors: string[] | AdonisError[],
    public status?: number,
    public code?: string,
    public notShowCustomValidationMessage?: boolean
  ) {
    super(errors.join(', '))
    this.status = status
    this.name = 'ValidationException'
    this.notShowCustomValidationMessage = notShowCustomValidationMessage
  }
  /**
   * Implement the handle method to manually handle this exception.
   * Otherwise it will be handled by the global exception handler.
   */
  public async handle(self: this, { response }: HttpContextContract) {
    let errorObject: ErrorObjectInterface = {
      errors: self.errors,
    }

    if (!this.notShowCustomValidationMessage) {
      errorObject.success = false
      errorObject.isCustomErrors = true
    }

    response.status(self.status || 422).send(errorObject)
  }
}

import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('integer', (value, _, { pointer, arrayExpressionPointer, errorReporter }) => {
  if (typeof value !== 'number') {
    return
  }
  if (value % 1 !== 0) {
    errorReporter.report(pointer, 'integer', 'Not integer', arrayExpressionPointer)
  }
})

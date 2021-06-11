import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { buildAndValidateTree } from 'App/Services/GraphService'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ValidationException from 'App/Exceptions/ValidationException'
import axios from 'axios'
import fs from 'fs'
import { join } from 'path'
import Application from '@ioc:Adonis/Core/Application'
import { downloadImage } from 'App/Services/HelperService'
import Config from '@ioc:Adonis/Core/Config'
import { Post200ApiGraphsGetTreeJsonRepresentation } from 'Contracts/types/index'
export default class GraphsController {
  async getTreeImageRepresentation({ request, response }: HttpContextContract) {
    const { vertexes } = await request.validate({
      schema: schema.create({
        vertexes: schema.array().members(
          schema.object().members({
            id: schema.number([rules.unsigned(), rules.integer()]),
            parent: schema.number([rules.unsigned(), rules.integer()]),
          })
        ),
      }),
    })

    try {
      buildAndValidateTree(vertexes)
    } catch (err) {
      throw new ValidationException([err], 422)
    }

    try {
      const url = Config.get('app.treeVisualizeUrl')
      const res = await axios.post(url, { vertexes }, { responseType: 'stream' })
      const path = join(Application.appRoot, 'assets', 'node', 'graph.jpeg')
      await downloadImage({ response: res, path })
      return response.type('image/jpeg').send(fs.readFileSync(path))
    } catch (err) {
      throw new ValidationException(['Unable to visualize graph', err], 422)
    }
  }

  async getTreeJsonRepresentation({
    request,
  }: HttpContextContract): Promise<Post200ApiGraphsGetTreeJsonRepresentation> {
    const { vertexes, rootId } = await request.validate({
      schema: schema.create({
        vertexes: schema.array().members(
          schema.object().members({
            id: schema.number([rules.unsigned(), rules.integer()]),
            parent: schema.number([rules.unsigned(), rules.integer()]),
          })
        ),
        rootId: schema.number([rules.unsigned(), rules.integer()]),
      }),
    })

    try {
      const graph = buildAndValidateTree(vertexes)

      return { representation: graph.buildJsonRepresentation(rootId) }
    } catch (err) {
      throw new ValidationException([err], 422)
    }
  }
}

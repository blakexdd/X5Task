import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { buildAndValidateTree } from 'App/Services/GraphService'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ValidationException from 'App/Exceptions/ValidationException'
import axios from 'axios'
import fs from 'fs'
import { join } from 'path'
import Application from '@ioc:Adonis/Core/Application'
import { downloadImage, ElkLogger } from 'App/Services/HelperService'
import Config from '@ioc:Adonis/Core/Config'
import { Post200ApiGraphsGetTreeJsonRepresentation, ServiceNames } from 'Contracts/types/index'

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
    ElkLogger.log(ServiceNames.GRAPH, 'Getting image for tree', vertexes)

    try {
      buildAndValidateTree(vertexes)
    } catch (err) {
      ElkLogger.error(ServiceNames.GRAPH, 'Error building and validation tree', err)
      throw new ValidationException([err], 422)
    }

    try {
      const url = Config.get('app.treeVisualizeUrl')
      ElkLogger.log(ServiceNames.GRAPH, `Sending request to get image for graph: ${url}`)
      const res = await axios.post(url, { vertexes }, { responseType: 'stream' })
      ElkLogger.log(ServiceNames.GRAPH, 'Sending request to get image for graph result', {
        data: res.data,
        headers: res.headers,
        status: res.status,
      })
      const path = join(Application.appRoot, 'assets', 'node', 'graph.jpeg')
      ElkLogger.log(ServiceNames.GRAPH, `Saving image by path: ${path}`)
      await downloadImage({ response: res, path })
      return response.type('image/jpeg').send(fs.readFileSync(path))
    } catch (err) {
      ElkLogger.error(ServiceNames.GRAPH, 'Error getting image for tree', err)
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

    ElkLogger.log(ServiceNames.GRAPH, 'Getting json for tree', { vertexes, rootId })

    try {
      const graph = buildAndValidateTree(vertexes)
      const representation = graph.buildJsonRepresentation(rootId)
      ElkLogger.log(ServiceNames.GRAPH, 'Json representation', { representation })

      return { representation }
    } catch (err) {
      ElkLogger.error(ServiceNames.GRAPH, 'Error getting json tree representation', err)
      throw new ValidationException([err], 422)
    }
  }
}

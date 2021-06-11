import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Graph } from 'App/Services/GraphService'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ValidationException from 'App/Exceptions/ValidationException'
import axios from 'axios'
import fs from 'fs'
import { join } from 'path'
import Application from '@ioc:Adonis/Core/Application'
import { downloadImage } from 'App/Services/HelperService'

export default class GraphsController {
  async getTree({ request, response }: HttpContextContract) {
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

    const vertexCount = vertexes.length
    const graph = new Graph(vertexCount)

    for (const vertex of vertexes) {
      graph.addEdge(vertex.id, vertex.parent)
    }

    const isTree = graph.isTree()

    if (!isTree) {
      throw new ValidationException(['Graph is not a tree'], 422)
    }

    try {
      const res = await axios.post(
        'http://localhost:8000/get-tree',
        { vertexes },
        { responseType: 'stream' }
      )
      const path = join(Application.appRoot, 'assets', 'node', 'graph.jpeg')
      await downloadImage({ response: res, path })
      return response.type('image/jpeg').send(fs.readFileSync(path))
    } catch (err) {
      throw new ValidationException(['Unable to visualize graph', err], 422)
    }
  }
}

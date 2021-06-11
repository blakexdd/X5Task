import { VertexRepresentation, Vertex, ServiceNames } from 'Contracts/types'
import { ElkLogger } from 'App/Services/HelperService'

type GraphType = { [key in number]: number[] }
export class Graph {
  private graph: GraphType
  constructor(private vertexCount: number) {
    this.graph = {}
  }

  private addEdgeToGraphDict(dict: GraphType, firstVertex: number, secondVertex: number) {
    if (dict.hasOwnProperty(firstVertex)) {
      dict[firstVertex].push(secondVertex)
    } else {
      dict[firstVertex] = [secondVertex]
    }
  }

  public addEdge(firstVertex: number, secondVertex: number) {
    ElkLogger.log(ServiceNames.GRAPH, 'Adding edge to graph', {
      graph: this.graph,
      firstVertex,
      secondVertex,
    })
    this.addEdgeToGraphDict(this.graph, firstVertex, secondVertex)
  }

  private isCyclic(currentVertex: number, visited: boolean[], parent: number): boolean {
    visited[currentVertex] = true
    const vertexChildren = this.graph[currentVertex] || []

    for (const vertex of vertexChildren) {
      if (!visited[vertex]) {
        if (this.isCyclic(vertex, visited, currentVertex)) {
          return true
        }
      } else if (vertex != parent) {
        return true
      }
    }

    return false
  }

  public isTree() {
    const visited: boolean[] = new Array(this.vertexCount).fill(false)

    if (this.isCyclic(0, visited, -1)) {
      return false
    }

    return visited.every((visitedVertex) => visitedVertex)
  }

  public buildJsonRepresentation(rootId: number): VertexRepresentation {
    if (!this.graph.hasOwnProperty(rootId)) {
      ElkLogger.error(ServiceNames.GRAPH, `Not vertex with id: ${rootId}`)
      throw new Error(`Not vertex with id: ${rootId}`)
    }

    const jsonVertexRepresentation: VertexRepresentation = { id: rootId, children: [] }

    return this.getVertexRepresentation(rootId, jsonVertexRepresentation)
  }

  private getVertexRepresentation(
    id: number,
    jsonVertexRepresentation: VertexRepresentation
  ): VertexRepresentation {
    if (!this.graph.hasOwnProperty(id)) {
      return { id, children: [] }
    }

    return {
      id,
      children: this.graph[id].map((id) => {
        return this.getVertexRepresentation(id, jsonVertexRepresentation)
      }),
    }
  }
}

export function buildAndValidateTree(vertexes: Vertex[]): Graph {
  const vertexCount = vertexes.length
  const graph = new Graph(vertexCount)

  for (const vertex of vertexes) {
    graph.addEdge(vertex.parent, vertex.id)
  }

  const isTree = graph.isTree()

  ElkLogger.log(ServiceNames.GRAPH, 'Validating tree', {
    vertexes,
    isTree,
  })

  if (!isTree) {
    throw Error('Graph is not valid tree')
  }

  return graph
}

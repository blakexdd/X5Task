type GraphType = { [key in number]: number[] }

export class Graph {
  private graph: GraphType
  constructor(private vertexCount: number) {
    this.graph = {}
  }

  private addEdgeToGraphDict(firstVertex: number, secondVertex: number) {
    if (this.graph.hasOwnProperty(firstVertex)) {
      this.graph[firstVertex].push(secondVertex)
    } else {
      this.graph[firstVertex] = [secondVertex]
    }
  }

  public addEdge(firstVertex: number, secondVertex: number) {
    this.addEdgeToGraphDict(firstVertex, secondVertex)
    this.addEdgeToGraphDict(secondVertex, firstVertex)
  }

  private isCyclic(currentVertex: number, visited: boolean[], parent: number): boolean {
    visited[currentVertex] = true
    for (const vertex of this.graph[currentVertex]) {
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
}

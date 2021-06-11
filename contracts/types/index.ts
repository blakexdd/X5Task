export interface PostApiAuthLogin {
  email: string
  password: string
}

export interface Vertex {
  id: number
  parent: number
}
export interface PostApiGraphsGetTreeImageRepresentation {
  vertexes: Vertex[]
}

export interface PostApiGraphsGetTreeJsonRepresentation {
  vertexes: Vertex[]
  rootId: number
}

export interface VertexRepresentation {
  id: number
  children: VertexRepresentation[]
}

export interface Post200ApiGraphsGetTreeJsonRepresentation {
  representation: VertexRepresentation
}

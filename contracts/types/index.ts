export interface PostApiAuthLogin {
  email: string
  password: string
}

export interface Vertex {
  id: number
  parent: number
}
export interface PostApiGraphs {
  vertexes: Vertex[]
  rootId: number
}

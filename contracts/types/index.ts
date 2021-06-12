export interface PostApiAuthLogin {
  email: string
  password: string
}

export interface Vertex {
  id: number
  parent: number
}
export interface PostApiGraphsGetTreeImageRepresentation {
  /**
   * @default [{"id": 2, "parent": 1}, {"id": 1, "parent": 0}, {"id": 3, "parent": 1}]
   */
  vertexes: Vertex[]
}

export interface PostApiGraphsGetTreeJsonRepresentation {
  /**
   * @default [{"id": 2, "parent": 1}, {"id": 1, "parent": 0}, {"id": 3, "parent": 1}]
   */
  vertexes: Vertex[]
  /**
   * @default 0
   */
  rootId: number
}

export interface VertexRepresentation {
  id: number
  children: VertexRepresentation[]
}

export interface Post200ApiGraphsGetTreeJsonRepresentation {
  representation: VertexRepresentation
}

export type LogLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export enum ServiceNames {
  GRAPH = 'GRAPH',
  AUTH = 'AUTH',
  ORDERS = 'ORDERS',
}

export interface UpdatedUsersCount {
  count: number
}

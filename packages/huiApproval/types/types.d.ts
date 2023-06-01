interface AnyObj {
  [propName: string]: any
}
interface Person {
  userId: string
  userName: string
  [key: string]: any
}
interface timeItem {
  ifCurrentTask?: boolean
  ifProcessEnd?: boolean
  flag?: string
  backSkipNode?: boolean
  repeatSkipNode?: boolean
  taskDefinitionKey?: string
  signPersonInfo?: AnyObj[]
  [modalTypeVisible: string]: any
}
interface ElementItem {
  height: number
  id: string
  interrupting?: any
  name: string | null
  properties: any
  type: string
  width: number
  x: number
  y: number
}

interface FlowItem {
  id: string
  name: string | null
  properties: AnyObj[]
  sourceRef: string
  targetRef: string
  type: string
  waypoints?: { x: number; y: number }[]
}
interface ModelJson {
  diagramBeginX: number
  diagramBeginY: number
  diagramHeight: number
  diagramWidth: number
  elements: ElementItem[]
  flows: FlowItem[]
}

interface NodeInfo {
  [key: string]: string
}

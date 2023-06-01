// 引入自定义节点
import userTask from './modelItem/userTask.js'
import myPolyLine from './modelItem/polyLine.js'
import startEvent from './modelItem/startEvent.js'
import endEvent from './modelItem/endEvent.js'
import excludeGateway from './modelItem/excludeGateway.js'
import parallelGateway from './modelItem/parallelGateway.js'
import InclusiveGateway from './modelItem/inclusiveGateway.js'
import EventGateway from './modelItem/eventGateway.js'

export default [
  userTask,
  myPolyLine,
  startEvent,
  endEvent,
  excludeGateway,
  parallelGateway,
  InclusiveGateway,
  EventGateway,
]

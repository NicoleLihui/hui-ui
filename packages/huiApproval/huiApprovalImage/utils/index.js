// 将“流程历史数据”和“flowable返回的流程图json数据”合并得到符合logicflow流程图框架的数据模型返回

const offsetX = 5

export default function transformObjForLogic(originObj, flowInfo, statusInfo) {
  let targetObj = { nodes: [], edges: [] }
  let { elements: nodes, flows: edges } = originObj
  if (Array.isArray(nodes) && Array.isArray(edges)) {
    // 根据历史数据中节点审批状态标注流程图节点状态(历史数据已经做了排序处理，第一条历史数据，就是是最新的节点数据)
    getSpecialSvg(flowInfo, nodes)
    formatNodes(nodes, targetObj)
    formatEdges(edges, targetObj, nodes)
    getStatus(targetObj, statusInfo)
    return targetObj
  } else {
    return {}
  }
}

function getStatus(modelJson, statusInfo) {
  function setProrerties(arr, obj) {
    const unfinishedStatus = 'unfinished'
    ;(arr || []).forEach(item => {
      const isObjProperties = Object.prototype.toString.call(item.properties) === '[object Object]'
      if (isObjProperties) item.properties.status = obj[item.id] || unfinishedStatus
      else {
        item.properties = {}
        item.properties.status = statusInfo[item.id] || unfinishedStatus
      }
    })
  }
  setProrerties(modelJson.nodes, statusInfo)
  setProrerties(modelJson.edges, statusInfo)
}

function getSpecialSvg(flowInfo, nodes) {
  Object.keys(flowInfo).forEach(key => {
    const nodeIndex = nodes.findIndex(node => node.id === key)
    if (nodeIndex !== -1) {
      if (flowInfo[key].some(flow => flow.assignMessage && flow.assignMessage.length > 0)) {
        nodes[nodeIndex].addPerson = true
      }
      if (flowInfo[key][0]?.isSignTask) {
        nodes[nodeIndex].isSignTask = true
      }
    }
  })
}

// 整理节点数据
function formatNodes(nodes, targetObj) {
  nodes.forEach((node, nodeIndex) => {
    const nodeObj = {}
    nodeObj.id = node?.id
    nodeObj.type = node?.type
    nodeObj.x = node?.x + node?.width / 2 + offsetX
    nodeObj.y = node?.y + node?.height / 2
    nodeObj.width = node?.width
    nodeObj.height = node?.height
    nodeObj.text = {}
    nodeObj.text.x = node?.x + node?.width / 2 + offsetX
    nodeObj.text.y = node?.y + node?.height / 2
    nodeObj.text.value = node?.name
    nodeObj.data = node?.properties
    nodeObj.properties = {}
    targetObj.nodes[nodeIndex] = nodeObj
    getNodeProperties(node, nodeIndex, targetObj)
  })
}
// 整理边数据
function formatEdges(edges, targetObj) {
  edges.forEach((edge, indexEdge) => {
    const edgeObj = {}
    edgeObj.id = edge?.id || ''
    edgeObj.type = edge?.type || ''
    edgeObj.sourceNodeId = edge.sourceRef
    edgeObj.targetNodeId = edge.targetRef
    edgeObj.properties = edge?.properties || {}
    edgeObj.pointsList = formatPoints(edge.waypoints)

    if (edge?.name !== '') {
      edgeObj.text = {}
      edgeObj.text.value = edge?.name || ''
    }
    targetObj.edges[indexEdge] = edgeObj
  })
}

// 将流程图整体向页面右移
function formatPoints(pointsList) {
  if (Array.isArray(pointsList)) {
    pointsList.map(points => {
      if (points.x) {
        points.x += offsetX
      }
    })
  }
  return pointsList
}

// 根据节点审批状态给节点数据添加参数用于标记颜色
function getNodeProperties(node, nodeIndex, targetObj) {
  const properties = {}
  if (node?.addPerson) {
    properties.addPerson = true
  }
  if (node.isSignTask) {
    properties.isSignTask = true
  }
  targetObj.nodes[nodeIndex].properties = properties
}

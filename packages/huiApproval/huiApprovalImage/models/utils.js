export function getMyStyle(properties, style) {
  if (properties?.status === 'pass') {
    style.stroke = '#28ba75'
  } else if (properties?.status === 'reject') {
    style.stroke = '#F5222D'
  } else if (properties?.status === 'current') {
    style.stroke = '#5270e7'
  } else if (properties?.status === 'unfinished') {
    style.stroke = defaultStyle.stroke
  } else {
    style.stroke = defaultStyle.stroke
  }
  if (properties?.addPerson) {
    style.addPerson = properties?.addPerson
  }
  if (properties?.isSignTask) {
    style.isSignTask = properties?.isSignTask
  }
  return style
}

export const fontSize = 14

export const defaultStyle = {
  stroke: '#909399', // 节点描线颜色
  strokeWidth: 4, // 节点描线粗细
  nodeStrokeSolid: '3 3',
}

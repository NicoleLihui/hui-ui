import { PolygonNode, PolygonNodeModel } from '@logicflow/core'
import { getMyStyle, fontSize, defaultStyle } from '../utils.js'

class Model extends PolygonNodeModel {
  // 自定义节点样式属性
  getNodeStyle() {
    const style = super.getNodeStyle()
    const { nodeStrokeSolid, stroke } = defaultStyle
    style.strokeSolid = nodeStrokeSolid
    style.stroke = stroke
    const properties = this.properties
    // 针对节点的一些业务属性的判断，决定渲染出来的样式
    const myStyle = getMyStyle(properties, style)

    return myStyle
  }
  // 自定义节点文字大小
  getTextStyle() {
    const style = super.getTextStyle()
    style.fontSize = fontSize
    return style
  }
  setAttributes() {
    this.points = [
      [20, 0],
      [0, 30],
      [20, 60],
      [40, 30],
    ]
    const circleOnlyAsBegin = {
      message: '开始节点不能被其他节点连接',
      validate: function (source, target) {
        if (target.type === 'StartEvent') {
          // Message.warning('开始节点不能被其他节点连接'); // TODO: 这里的提示会调用两次
          return false
        } else return true
      },
    }
    this.sourceRules.push(circleOnlyAsBegin)
  }
}

class View extends PolygonNode {}
export default {
  type: 'ExclusiveGateway',
  view: View,
  model: Model,
}

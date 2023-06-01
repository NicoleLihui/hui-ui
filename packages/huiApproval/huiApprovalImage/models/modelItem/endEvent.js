/** 基于圆形创建流程发起的节点:
 * 1. 开始节点不能被其他节点连接
 * 2. 节点的样式为空心圆, 半径为20px, 边框宽度为2px
 */
import { CircleNode, CircleNodeModel } from '@logicflow/core'
import { getMyStyle, fontSize, defaultStyle } from '../utils.js'

class EndModel extends CircleNodeModel {
  getNodeStyle() {
    const style = super.getNodeStyle()
    const { stroke, strokeWidth } = defaultStyle
    style.stroke = stroke // 描线颜色
    style.strokeWidth = strokeWidth // 描线粗细
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
    const size = 40
    this.r = size / 2
  }
}
class EndView extends CircleNode {}

export default {
  type: 'EndEvent',
  view: EndView,
  model: EndModel,
}

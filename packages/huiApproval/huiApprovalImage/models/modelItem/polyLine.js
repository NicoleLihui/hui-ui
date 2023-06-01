// 折线
import { PolylineEdge, PolylineEdgeModel } from '@logicflow/core'
import { fontSize, defaultStyle, getMyStyle } from '../utils.js'

class Model extends PolylineEdgeModel {
  setAttributes() {
    this.offset = 20
  }
  getEdgeStyle() {
    const style = super.getEdgeStyle()
    style.stroke = defaultStyle.stroke
    const properties = this.properties
    if (properties.isActived) {
      style.strokeDasharray = '4 4'
    }
    const myStyle = getMyStyle(properties, style)

    return myStyle
  }
  getTextStyle() {
    const style = super.getTextStyle()
    style.color = '#333'
    style.fontSize = fontSize
    style.background.fill = '#fff'
    return style
  }
}

export default {
  type: 'sequenceFlow',
  view: PolylineEdge,
  model: Model,
}

/**
 * 用户任务: 用户标识 100 * 80, 5px radius
 * 自定义属性status判断节点状态显示颜色, 默认蓝色
 */

// LogicFlow内部存在7种基础节点, 自定义节点的时候可以基于需要选择任一一种来继承, 然后取一个符合自己业务意义的名字。
// h方法是logicflow对外暴露的渲染函数，创建的是svg标签，需要学习svg标签相关的基础知识
import { h, RectNode, RectNodeModel } from '@logicflow/core'
import { getMyStyle, fontSize, defaultStyle } from '../utils.js'

// 重写定义model上获取样式相关的方法
class UserTaskModel extends RectNodeModel {
  // 自定义节点样式属性
  getNodeStyle() {
    const style = super.getNodeStyle()
    style.stroke = defaultStyle.stroke // 描线颜色
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
  // 自定义节点形状属性
  initNodeData(data) {
    super.initNodeData(data)
    this.width = data.width || 120
    this.height = data.height || 80
    this.radius = 2
  }
  setAttributes() {
    const circleOnlyAsBegin = {
      message: '开始节点不能被其他节点连接',
      validate: function (source, target) {
        if (target.type === 'bpmn:startEvent') {
          // Message.warning('开始节点不能被其他节点连接'); // TODO: 这里的提示会调用两次
          return false
        } else return true
      },
    }
    this.sourceRules.push(circleOnlyAsBegin)
  }
}
// 重写view上的getShape来定义更复杂的节点外观
class UserTaskView extends RectNode {
  // private getLabelShape() { // 官方提供的私有域定义方法会报错
  // #privateField // 私有域
  getLabelShape() {
    const { model } = this.props
    const { x, y, width, height } = model
    const style = model.getNodeStyle()
    // 图标是svg标签里面放一个或者多个path
    return h(
      'svg',
      {
        x: x - width / 2 + 5,
        y: y - height / 2 + 5,
        // 这个不需要使用svg标签上的width和height, 直接写成你期望的宽高就行。
        width: 20,
        height: 20,
        // 属性允许指定一个给定的一组图形伸展以适应特定的容器元素。一般把svg标签上的viewBox属性值复制过来就行。
        viewBox: '0 0 1274 1024',
      },
      // 这个图标的path的svg文件可以通过iconfont来生成
      h('path', {
        // 路径的填充颜色, 一般和节点的边框颜色一致，但是也可以按照业务需求自定义。
        fill: style.stroke,
        // 该属性定义了一个路径。直接复制svg代码过来即可, 不需要去关系d具体内容表示的含义。
        d: 'M655.807326 287.35973m-223.989415 0a218.879 218.879 0 1 0 447.978829 0 218.879 218.879 0 1 0-447.978829 0ZM1039.955839 895.482975c-0.490184-212.177424-172.287821-384.030443-384.148513-384.030443-211.862739 0-383.660376 171.85302-384.15056 384.030443L1039.955839 895.482975z',
      })
    )
  }
  getAddLabel() {
    const { model } = this.props
    const { x, y, width, height } = model
    const style = model.getNodeStyle()
    if (style?.addPerson) {
      return h(
        'svg',
        {
          x: x + width / 2 - 64,
          y: y - height / 2 - 45,
          // 这个不需要使用svg标签上的width和height, 直接写成你期望的宽高就行。
          width: 500,
          height: 446,
          // 属性允许指定一个给定的一组图形伸展以适应特定的容器元素。一般把svg标签上的viewBox属性值复制过来就行。
          viewBox: '0 0 1274 1024',
        },
        h('g', {}, [
          h('rect', {
            x: 74,
            y: 68,
            width: 80,
            height: 46,
            fillOpacity: 0.2,
            fill: style.stroke,
            stroke: style.stroke,
            strokeWidth: 1,
          }),
          h('text', { x: 85, y: 100, fontSize: 28, fill: style.stroke }, ['加签']),
        ])
      )
    } else if (style?.isSignTask) {
      return h(
        'svg',
        {
          x: x + width / 2 - 64,
          y: y - height / 2 - 45,
          // 这个不需要使用svg标签上的width和height, 直接写成你期望的宽高就行。
          width: 500,
          height: 446,
          // 属性允许指定一个给定的一组图形伸展以适应特定的容器元素。一般把svg标签上的viewBox属性值复制过来就行。
          viewBox: '0 0 1274 1024',
        },
        h('g', {}, [
          h('rect', {
            x: 74,
            y: 68,
            width: 80,
            height: 46,
            fillOpacity: 0.2,
            fill: style.stroke,
            stroke: style.stroke,
            strokeWidth: 1,
          }),
          h('text', { x: 85, y: 100, fontSize: 28, fill: style.stroke }, ['会签']),
        ])
      )
    } else {
      return h('g', {})
    }
  }
  /**
   * 完全自定义节点外观方法
   */
  getShape() {
    const { model } = this.props
    const { x, y, width, height, radius } = model
    const style = model.getNodeStyle()
    return h('g', {}, [
      h('rect', {
        ...style,
        // rect标签控制坐标的时候跟model里面的坐标控制方式不同，这里代表的是图形左上角的坐标，而model表示中心点坐标
        // circle和ellipse: 通过cx, cy表示图形的位置，含义为中心点的坐标。
        // 所以这里用中心点减节点高度的一半计算出左上角的坐标
        x: x - width / 2,
        y: y - height / 2,
        rx: radius,
        ry: radius,
        width,
        height,
      }),
      // 给节点加了一个svg图标
      this.getLabelShape(),
      this.getAddLabel(),
    ])
  }
}

export default {
  type: 'UserTask',
  view: UserTaskView,
  model: UserTaskModel,
}

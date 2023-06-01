import gateWayBasic from './excludeGateway'

const View = gateWayBasic.view
const Model = gateWayBasic.model

export default {
  type: 'EventGateway',
  view: View,
  model: Model,
}

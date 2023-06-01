import OnlinePreview from '../huiOnlinePreview/index'
import { Request } from '../huiRequest/index'

import { withInstallFunction } from '@packages/utils/install'

export const HuiTools = withInstallFunction(
  {
    OnlinePreview,
    Request,
  },
  'HuiTools'
)

export default HuiTools

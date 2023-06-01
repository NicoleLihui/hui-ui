export const modelJson = {
  elements: [
    {
      id: 'startEvent1',
      name: null,
      x: 100,
      y: 162,
      width: 30,
      height: 30,
      type: 'StartEvent',
      interrupting: true,
      properties: [],
    },
    {
      id: 'sid-08EF7396-B34C-47CF-9125-605823DBB5B0',
      name: '新增/前加签测试 申请',
      x: 210,
      y: 144,
      width: 105,
      height: 68,
      type: 'UserTask',
      properties: [
        {
          name: 'Assignee',
          value: '${initiator}',
        },
        {
          name: 'Task listeners',
          type: 'list',
          value: [
            'create - ${backStartTaskCreateListener} (delegateExpression), field extensions: exInvokeUri - http://10.10.20.3:8090/crm/process/callback,  exInvokeMethod - POST,  exInvokeParams - {"businessKeyJson":${businessKeyJson}, "initFormValueJson": ${initFormValueJson}, "processResultJson":{"approval": 2}}',
          ],
        },
      ],
    },
    {
      id: 'sid-8982B55F-CF9F-45D0-8204-D403AE7CCE92',
      name: '节点2: 配置前后加签123234',
      x: 375,
      y: 135,
      width: 126,
      height: 84,
      type: 'UserTask',
      properties: [
        {
          name: 'Form key',
          value: 'ProductCooperation',
        },
      ],
    },
    {
      id: 'sid-9D3F311C-47F4-4A1E-8072-755FA4977399',
      name: null,
      x: 1125,
      y: 164,
      width: 28,
      height: 28,
      type: 'EndEvent',
      properties: [
        {
          name: 'Execution listeners',
          type: 'list',
          value: [
            'end - ${zFlowExecutionEndListener} (delegateExpression), field extensions: exInvokeUri - http://10.10.20.3:8090/crm/process/callback,  exInvokeMethod - POST,  exInvokeParams - {}',
          ],
        },
      ],
    },
    {
      id: 'sid-FE0626D1-3407-417E-AC8C-8E6E56B45BDA',
      name: '节点3: 配置转办',
      x: 585,
      y: 137,
      width: 126,
      height: 80,
      type: 'UserTask',
      properties: [],
    },
    {
      id: 'sid-4569927D-2D90-45A5-9606-1C82A71FC5C5',
      name: '节点4: 配置派单',
      x: 765,
      y: 135,
      width: 126,
      height: 80,
      type: 'UserTask',
      properties: [],
    },
    {
      id: 'sid-2ABE76F0-1A80-46EC-9694-52932CE90AAD',
      name: '节点5: 被派单节点',
      x: 960,
      y: 135,
      width: 126,
      height: 80,
      type: 'UserTask',
      properties: [],
    },
  ],
  flows: [
    {
      id: 'sid-3F875415-0306-4449-A1F7-53420B55412A',
      type: 'sequenceFlow',
      sourceRef: 'startEvent1',
      targetRef: 'sid-08EF7396-B34C-47CF-9125-605823DBB5B0',
      name: null,
      waypoints: [
        {
          x: 129.94962939804716,
          y: 177.10135366709218,
        },
        {
          x: 209.99999999999784,
          y: 177.64406779661016,
        },
      ],
      properties: [],
    },
    {
      id: 'sid-317499E4-0852-4CEC-80D6-EF1568E7B363',
      type: 'sequenceFlow',
      sourceRef: 'sid-4569927D-2D90-45A5-9606-1C82A71FC5C5',
      targetRef: 'sid-2ABE76F0-1A80-46EC-9694-52932CE90AAD',
      name: null,
      waypoints: [
        {
          x: 890.9499999999737,
          y: 175,
        },
        {
          x: 960,
          y: 175,
        },
      ],
      properties: [],
    },
    {
      id: 'sid-37D6DBD6-997C-42F5-ADD3-E6604D349302',
      type: 'sequenceFlow',
      sourceRef: 'sid-2ABE76F0-1A80-46EC-9694-52932CE90AAD',
      targetRef: 'sid-9D3F311C-47F4-4A1E-8072-755FA4977399',
      name: null,
      waypoints: [
        {
          x: 1085.9499999999985,
          y: 176.62801724137927,
        },
        {
          x: 1125.0035664023153,
          y: 177.6380496879083,
        },
      ],
      properties: [],
    },
    {
      id: 'sid-F97BC8D8-B507-4672-8406-EDE2F53EE65B',
      type: 'sequenceFlow',
      sourceRef: 'sid-08EF7396-B34C-47CF-9125-605823DBB5B0',
      targetRef: 'sid-8982B55F-CF9F-45D0-8204-D403AE7CCE92',
      name: null,
      waypoints: [
        {
          x: 314.9499999999948,
          y: 177.70085470085473,
        },
        {
          x: 374.999999999999,
          y: 177.35868945868947,
        },
      ],
      properties: [],
    },
    {
      id: 'sid-EB265F3A-33DB-47F2-964A-F508B7189A31',
      type: 'sequenceFlow',
      sourceRef: 'sid-8982B55F-CF9F-45D0-8204-D403AE7CCE92',
      targetRef: 'sid-FE0626D1-3407-417E-AC8C-8E6E56B45BDA',
      name: null,
      waypoints: [
        {
          x: 500.95000000000005,
          y: 177,
        },
        {
          x: 584.9999999998442,
          y: 177,
        },
      ],
      properties: [],
    },
    {
      id: 'sid-AABE55BB-A752-43F6-8AF8-7F53B2F61EEC',
      type: 'sequenceFlow',
      sourceRef: 'sid-FE0626D1-3407-417E-AC8C-8E6E56B45BDA',
      targetRef: 'sid-4569927D-2D90-45A5-9606-1C82A71FC5C5',
      name: null,
      waypoints: [
        {
          x: 710.9499999999923,
          y: 177,
        },
        {
          x: 738,
          y: 177,
        },
        {
          x: 738,
          y: 175,
        },
        {
          x: 765,
          y: 175,
        },
      ],
      properties: [],
    },
  ],
  diagramBeginX: 115,
  diagramBeginY: 135,
  diagramWidth: 1153,
  diagramHeight: 219,
}

export const historyData = [
  {
    subName: '',
    taskId: 'd86e01e4-865a-11ed-930d-2608f333ef75',
    ifCurrentTask: false,
    userName: '焦杰',
    userId: 'jiaojie',
    time: '2022-12-28 10:53:52',
    message: '发起申请',
    flag: 'normal',
    consumingTime: '7秒',
    assigneeList: [
      {
        positionName: '党务管理专业经理',
        userTitle: '党群工作部-党务管理专业经理',
        attributionUnit: 'XX公司（中国）投资有限公司',
        mobile: '15652717776',
        department: '党群工作部',
        userName: '焦杰',
        userCode: 'jiaojie',
      },
    ],
    userTitle: '党群工作部-党务管理专业经理',
    createTime: '2022-12-28 10:53:45',
    name: '新增/前加签测试 申请',
    taskDefinitionKey: 'sid-08EF7396-B34C-47CF-9125-605823DBB5B0',
  },
  {
    subName: '',
    taskId: 'dcb0b4df-865a-11ed-930d-2608f333ef75',
    ifCurrentTask: false,
    userName: '焦杰',
    operationName: '曹长征',
    userId: null,
    time: '2022-12-28 11:05:42',
    message: null,
    flag: 'normal',
    consumingTime: '11分50秒',
    operation: '前加签',
    assigneeList: [
      {
        positionName: '党务管理专业经理',
        userTitle: '党群工作部-党务管理专业经理',
        attributionUnit: 'XX公司（中国）投资有限公司',
        mobile: '15652717776',
        department: '党群工作部',
        userName: '焦杰',
        userCode: 'jiaojie',
      },
    ],
    userTitle: '党群工作部-党务管理专业经理',
    assignMessage: [
      {
        createOrder: 1000,
        deptName: '应用开发与测试部',
        actionType: 'TG',
        finishTime: '2022-12-28 11:02:02',
        createTime: '2022-12-28 10:56:45',
        parentUserCode: 'caochangzheng',
        userName: '王婧怡',
        userCode: 'wangjingyi',
      },
      {
        createOrder: 2000,
        deptName: '项目与质量管理部',
        actionType: 'TG',
        finishTime: '2022-12-28 11:03:59',
        createTime: '2022-12-28 11:02:02',
        parentUserCode: 'caochangzheng',
        userName: '王圆辉',
        userCode: 'wangyuanhui',
      },
      {
        createOrder: 3000,
        deptName: '应用开发与测试部',
        actionType: 'TG',
        finishTime: '2022-12-28 11:05:42',
        createTime: '2022-12-28 11:03:59',
        parentUserCode: 'caochangzheng',
        userName: '曹长征',
        userCode: 'caochangzheng',
      },
    ],
    createTime: '2022-12-28 10:53:52',
    name: '节点2: 配置前后加签123234',
    taskDefinitionKey: 'sid-8982B55F-CF9F-45D0-8204-D403AE7CCE92',
  },
  {
    taskDefinitionKey: 'sid-FE0626D1-3407-417E-AC8C-8E6E56B45BDA',
    assigneeList: [
      {
        userCode: 'wangzelei',
        userName: '王泽磊',
        userTitle: '投资部-投资主管',
        positionName: '投资主管',
        mobile: '15906265121',
        attributionUnit: '北京建工环境发展有限责任公司',
        department: '投资部',
      },
    ],
    ifCurrentTask: true,
    createTime: '2022-12-28 11:05:42',
    name: '节点3: 配置转办',
    assignee: '王泽磊',
    taskId: '841e6169-865c-11ed-930d-2608f333ef75',
  },
]

export const nodeInfo = {
  'sid-08EF7396-B34C-47CF-9125-605823DBB5B0': 'pass',
  'sid-3F875415-0306-4449-A1F7-53420B55412A': 'pass',
  'sid-F97BC8D8-B507-4672-8406-EDE2F53EE65B': 'pass',
  'sid-EB265F3A-33DB-47F2-964A-F508B7189A31': 'pass',
  startEvent1: 'pass',
  'sid-8982B55F-CF9F-45D0-8204-D403AE7CCE92': 'pass',
  'sid-FE0626D1-3407-417E-AC8C-8E6E56B45BDA': 'current',
}
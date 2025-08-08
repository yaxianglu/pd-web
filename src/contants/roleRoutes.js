// 角色路由映射配置
export const ROLE_ROUTES = {
  // 超级管理员 - 医院管理界面
  super_admin: '/hospital',
  
  // 普通管理员 - 医院管理界面
  admin: '/hospital',
  
  // 经理 - 列表页面
  manager: '/list',
  
  // 操作员 - 合作伙伴页面
  operator: '/partners',
  
  // 患者 - 患者页面
  patient: '/patient',
  
  // 医生 - 医生/诊所页面
  doctor: '/doctor',
  
  // 销售 - 业务端页面
  sales: '/sales'
};

// 角色显示名称
export const ROLE_NAMES = {
  super_admin: '超级管理员',
  admin: '管理员',
  manager: '经理',
  operator: '操作员',
  patient: '患者',
  doctor: '医生',
  sales: '销售'
};

// 角色权限描述
export const ROLE_DESCRIPTIONS = {
  super_admin: '拥有系统最高权限，可以管理所有功能',
  admin: '拥有管理权限，可以管理医院相关功能',
  manager: '拥有管理权限，可以查看和管理列表数据',
  operator: '拥有基本操作权限，可以查看合作伙伴信息',
  patient: '患者用户，可以查看自己的治疗信息',
  doctor: '医生用户，可以管理患者信息和治疗进度',
  sales: '销售用户，可以管理业务端数据和医生/诊所信息'
};

// 根据角色获取路由
export const getRouteByRole = (role) => {
  return ROLE_ROUTES[role] || '/partners'; // 默认跳转到合作伙伴页面
};

// 根据角色获取显示名称
export const getRoleName = (role) => {
  return ROLE_NAMES[role] || '未知角色';
};

// 根据角色获取描述
export const getRoleDescription = (role) => {
  return ROLE_DESCRIPTIONS[role] || '暂无描述';
}; 
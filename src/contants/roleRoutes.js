// 角色路由映射配置
export const ROLE_ROUTES = {
  // 超级管理员 - 管理员界面
  super_admin: '/admin',
  
  // 普通管理员 - 管理员界面
  admin: '/admin',
  
  // 经理 - 列表页面
  manager: '/list',
  
  // 操作员 - 合作伙伴页面
  operator: '/partners',
  
  // 患者 - 患者页面
  patient: '/patient',
  
  // 医生 - 医生/诊所页面
  doctor: '/doctor',
  
  // 医院 - 医院页面
  hospital: '/hospital',
  
  // 销售 - 业务端页面
  sales: '/sales',

  // 市场 - 市场端页面
  market: '/market'
};

// 角色显示名称
export const ROLE_NAMES = {
  super_admin: '超级管理员',
  admin: '管理员',
  manager: '经理',
  operator: '操作员',
  patient: '患者',
  doctor: '医生',
  hospital: '医院',
  sales: '销售',
  market: '市场'
};

// 角色权限描述
export const ROLE_DESCRIPTIONS = {
  super_admin: '拥有系统最高权限，可以管理所有功能',
  admin: '拥有管理权限，可以管理医院相关功能',
  manager: '拥有管理权限，可以查看和管理列表数据',
  operator: '拥有基本操作权限，可以查看合作伙伴信息',
  patient: '患者用户，可以查看自己的治疗信息',
  doctor: '医生用户，可以管理患者信息和治疗进度',
  hospital: '医院用户，可以管理医院信息与医生/患者数据',
  sales: '销售用户，可以管理业务端数据和医生/诊所信息',
  market: '市场用户，可以查看并管理市场相关数据'
};

// 根据角色获取路由
export const getRouteByRole = (role, username = '') => {
  // 特殊处理：sales_user 用户跳转到 sales 页面
  if (username === 'sales_user') {
    return '/sales';
  }
  if (role === 'market') {
    return '/market';
  }
  
  return ROLE_ROUTES[role] || '/partners'; // 默认跳转到合作伙伴页面
};

// 返回角色显示名称（兼容旧方法名）
export const getRouteName = (role) => {
  return ROLE_NAMES[role] || '未知角色';
};
export const getRoleName = (role) => getRouteName(role);

// 根据角色获取描述
export const getRoleDescription = (role) => {
  return ROLE_DESCRIPTIONS[role] || '暂无描述';
}; 
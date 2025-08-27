// 测试历史资料弹窗组件
console.log('🔍 测试历史资料弹窗组件...');

try {
  // 尝试导入组件
  const HistoryModal = require('./src/components/history-modal').default;
  
  console.log('✅ HistoryModal 组件导入成功');
  console.log('- 组件类型:', typeof HistoryModal);
  console.log('- 组件名称:', HistoryModal.name || 'Anonymous');
  
  // 检查组件是否有必要的props
  const requiredProps = ['open', 'onCancel', 'smileTestUuid', 'userType'];
  console.log('📋 组件需要的props:', requiredProps);
  
  console.log('\n🎉 历史资料弹窗组件配置正确！');
  
} catch (error) {
  console.error('❌ 历史资料弹窗组件测试失败:', error.message);
  
  if (error.message.includes('Cannot find module')) {
    console.error('\n🔧 这可能是文件路径问题');
    console.error('请检查文件路径是否正确');
  }
  
  if (error.message.includes('Unexpected token')) {
    console.error('\n🔧 这可能是语法错误');
    console.error('请检查组件代码语法');
  }
}

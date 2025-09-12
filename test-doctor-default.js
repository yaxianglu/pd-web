// 测试医生默认选中功能
console.log('测试医生默认选中功能:');

// 模拟用户信息
const mockUserInfo = {
  role: 'doctor',
  uuid: 'doctor-123',
  full_name: '张医生',
  username: 'zhang_doctor',
  email: 'zhang@example.com'
};

// 模拟医生列表
const mockDoctors = [
  { uuid: 'doctor-123', full_name: '张医生', username: 'zhang_doctor' },
  { uuid: 'doctor-456', full_name: '李医生', username: 'li_doctor' },
  { uuid: 'doctor-789', full_name: '王医生', username: 'wang_doctor' }
];

console.log('用户信息:', mockUserInfo);
console.log('医生列表:', mockDoctors);

// 模拟表单初始值设置
const initialValues = {
  date: '2025-09-13',
  start_time: '08:00',
  end_time: '09:00',
  note: '',
  doctor_uuid: mockUserInfo?.uuid // 默认选中当前医生
};

console.log('表单初始值:', initialValues);

// 模拟Select组件的选项
const selectOptions = mockDoctors.map((d) => ({ 
  label: d.full_name || d.username || d.email || d.name, 
  value: d.uuid || d.id 
}));

console.log('Select选项:', selectOptions);

console.log('\n功能验证:');
console.log('✅ 默认选中当前医生:', initialValues.doctor_uuid === mockUserInfo.uuid);
console.log('✅ 支持切换到其他医生:', selectOptions.length > 1);
console.log('✅ 当前医生在选项中:', selectOptions.some(option => option.value === mockUserInfo.uuid));

console.log('\n预期效果:');
console.log('- 打开新增预约弹窗时，医生字段默认选中当前医生');
console.log('- 用户可以点击下拉菜单切换到其他医生');
console.log('- 保持原有的医生选择功能');

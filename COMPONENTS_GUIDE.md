# 公共组件使用指南

## 概述

为了提高代码复用性和维护性，我们创建了一系列可复用的公共组件。这些组件可以在不同的页面中使用，确保UI的一致性和开发效率。

## 组件列表

### 1. DateSelector - 日期选择器

**功能**: 显示日期选择器，支持日期切换和选中状态

**使用示例**:
```jsx
import DateSelector from '../components/date-selector';

const dates = [
  { day: "Mon", date: 3 },
  { day: "Tue", date: 4 },
  { day: "Wed", date: 5 },
  // ...
];

const [selectedDate, setSelectedDate] = useState(6);

<DateSelector 
  dates={dates}
  selectedDate={selectedDate}
  onDateSelect={setSelectedDate}
/>
```

**Props**:
- `dates`: 日期数组，每个元素包含 `day` 和 `date` 属性
- `selectedDate`: 当前选中的日期
- `onDateSelect`: 日期选择回调函数
- `className`: 自定义CSS类名

### 2. AppointmentCard - 预约卡片

**功能**: 显示预约信息卡片，包含时间、类型、医生、诊所等信息

**使用示例**:
```jsx
import AppointmentCard from '../components/appointment-card';

const appointment = {
  time: "8:00 - 8:30",
  type: "Dentist",
  doctor: "Dr. Dianne Fisher",
  clinic: "CityMed Clinic",
  color: "#e3f2fd",
  icon: "🦷"
};

<AppointmentCard
  appointment={appointment}
  onAction={() => handleAppointmentAction(appointment)}
/>
```

**Props**:
- `appointment`: 预约对象，包含时间、类型、医生、诊所、颜色、图标等信息
- `onAction`: 操作按钮点击回调（可选）
- `className`: 自定义CSS类名

### 3. StatusCard - 状态卡片

**功能**: 显示状态信息卡片，支持不同类型的预设样式

**使用示例**:
```jsx
import StatusCard from '../components/status-card';

// 预设类型
<StatusCard
  title="牙套類型"
  value="輕度"
  note="(平均治療週期3-9個月)"
  type="brace-type"
/>

// 带图标
<StatusCard
  title="目前進度"
  value="付款完成"
  icon="💰"
  type="current-progress"
/>

// 自定义颜色
<StatusCard
  title="自定义状态"
  value="自定义值"
  type="custom"
  style={{ '--custom-color': '#ff6b6b' }}
/>
```

**Props**:
- `title`: 卡片标题
- `value`: 卡片值（可选）
- `note`: 备注信息（可选）
- `icon`: 图标（可选）
- `type`: 卡片类型，支持预设类型或自定义
- `className`: 自定义CSS类名

**预设类型**:
- `brace-type`: 蓝色 (#2196f3)
- `current-progress`: 绿色 (#4caf50)
- `treatment-phase`: 橙色 (#ff9800)
- `create-bill`: 红色 (#f44336)
- `payment-completed`: 绿色 (#4caf50)
- `first-week`: 红色 (#f44336)
- `custom`: 自定义颜色

### 4. TreatmentFlow - 治疗流程步骤

**功能**: 显示治疗流程的步骤进度，支持完成、进行中、待处理状态

**使用示例**:
```jsx
import TreatmentFlow from '../components/treatment-flow';

const steps = [
  { name: "口掃完成", status: "completed", icon: "📋" },
  { name: "確認治療方案", status: "completed", icon: "📋" },
  { name: "付款完成", status: "current", icon: "📋" },
  { name: "生產完成", status: "pending", icon: "📋" },
  { name: "治療中", status: "pending", icon: "📋" },
  { name: "治療完成", status: "pending", icon: "📋" }
];

<TreatmentFlow steps={steps} />
```

**Props**:
- `steps`: 步骤数组，每个元素包含 `name`、`status`、`icon` 属性
- `className`: 自定义CSS类名

**状态类型**:
- `completed`: 已完成（绿色勾号）
- `current`: 进行中（黄色L）
- `pending`: 待处理（灰色圆圈）

## 样式定制

所有组件都支持通过 `className` 属性添加自定义样式，并且组件内部使用了CSS变量，可以通过CSS自定义属性进行样式覆盖。

### 示例：自定义预约卡片颜色

```scss
.custom-appointment {
  --appointment-color: #ffeb3b;
}
```

```jsx
<AppointmentCard
  appointment={appointment}
  className="custom-appointment"
/>
```

## 响应式设计

所有组件都内置了响应式设计，在1125px断点以下会自动调整布局：

- **DateSelector**: 支持水平滚动
- **AppointmentCard**: 垂直布局，居中对齐
- **StatusCard**: 保持网格布局
- **TreatmentFlow**: 支持水平滚动

## 最佳实践

### 1. 组件组合

可以将多个组件组合使用，创建更复杂的UI：

```jsx
function TreatmentSummary() {
  return (
    <div className="treatment-summary">
      <DateSelector dates={dates} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      <div className="appointment-list">
        {appointments.map(appointment => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  );
}
```

### 2. 数据驱动

使用数据驱动的方式管理组件状态：

```jsx
const statusCards = [
  { title: "牙套類型", value: "輕度", note: "(平均治療週期3-9個月)", type: "brace-type" },
  { title: "目前進度", value: "付款完成", icon: "💰", type: "current-progress" },
  // ...
];

{statusCards.map((card, index) => (
  <StatusCard key={index} {...card} />
))}
```

### 3. 事件处理

为组件添加适当的事件处理：

```jsx
const handleAppointmentAction = (appointment) => {
  console.log('预约操作:', appointment);
  // 处理预约相关操作
};

<AppointmentCard
  appointment={appointment}
  onAction={handleAppointmentAction}
/>
```

## 扩展指南

### 添加新的组件类型

1. 在 `src/components/` 目录下创建新的组件文件夹
2. 创建 `index.jsx` 和 `index.scss` 文件
3. 实现组件逻辑和样式
4. 在组件文档中添加使用说明

### 修改现有组件

1. 保持向后兼容性
2. 添加新的props时提供默认值
3. 更新组件文档
4. 测试所有使用该组件的页面

## 注意事项

1. **性能优化**: 组件使用React.memo进行优化，避免不必要的重渲染
2. **可访问性**: 组件支持键盘导航和屏幕阅读器
3. **国际化**: 组件文本支持国际化配置
4. **主题支持**: 组件支持主题切换，使用CSS变量管理颜色

## 故障排除

### 常见问题

1. **组件不显示**: 检查props是否正确传递
2. **样式异常**: 检查CSS变量是否正确设置
3. **事件不触发**: 检查回调函数是否正确绑定

### 调试技巧

1. 使用浏览器开发者工具检查组件结构
2. 查看控制台是否有错误信息
3. 使用React DevTools检查组件props和state 
# 历史资料弹窗功能实现

## 功能概述

根据用户需求，我们实现了"历史资料"弹窗功能，用于显示和管理微笑测试相关的文件。

## 实现的功能

### 1. 历史资料弹窗组件 (`HistoryModal`)

**位置**: `pd-web/src/components/history-modal/index.jsx`

**功能特性**:
- 根据用户类型显示不同的文件内容
  - **患者用户**: 只显示微笑测试图片
  - **其他用户** (医生、管理员): 显示微笑测试图片和口扫文件
- 按最新日期排序显示文件
- 支持文件下载功能
- 支持文件删除功能 (仅非患者用户)
- 响应式设计，适配移动端

**组件Props**:
- `open`: 控制弹窗显示/隐藏
- `onCancel`: 关闭弹窗的回调函数
- `smileTestUuid`: 微笑测试的UUID
- `userType`: 用户类型 ('patient' | 'doctor' | 'admin')

### 2. 按钮集成

**位置**: `pd-web/src/components/schedule-card/index.jsx`

**修改内容**:
- 在"上传"和"下载"按钮之间添加了"历史资料"按钮
- 点击按钮打开历史资料弹窗
- 按钮样式与其他按钮保持一致

### 3. API接口扩展

**位置**: `pd-web/src/services/api.js`

**新增方法**:
- `getSmileTestFiles(smileTestUuid)`: 获取微笑测试文件列表
- `downloadFile(fileUuid)`: 下载指定文件
- `deleteFile(fileUuid)`: 删除指定文件
- `uploadSmileTestImage(smileTestUuid, imageIndex, fileData)`: 上传微笑测试图片
- `uploadOralScanFile(smileTestUuid, fileData, fileName)`: 上传口扫文件

## 数据来源

所有文件数据都来自新的 `smile_test_files` 表，包括：
- 微笑测试图片 (upload_type: 'smile_test')
- 口扫文件 (upload_type: 'oral_scan')

## 用户界面

### 弹窗布局
- **标题**: "歷史資料"
- **表格列**:
  - 编号 (自动生成)
  - 文件名称 (显示文件类型标签和时间)
  - 操作 (下载、删除按钮)

### 文件类型标签
- 微笑測試: 蓝色标签
- 口掃文件: 绿色标签

### 时间格式
- 显示格式: YYYY/MM/DD/HH:mm
- 按最新日期排序

## 权限控制

- **患者用户**: 只能查看和下载微笑测试图片，不能删除文件
- **医生/管理员**: 可以查看所有文件，支持下载和删除操作

## 样式设计

**位置**: `pd-web/src/components/history-modal/index.scss`

**特性**:
- 现代化的表格设计
- 悬停效果
- 响应式布局
- 与现有UI风格保持一致

## 使用方式

1. 在患者仪表板中点击"歷史資料"按钮
2. 弹窗显示相关文件列表
3. 点击"下載"按钮下载文件
4. 非患者用户可以点击"刪除"按钮删除文件
5. 点击"關閉"按钮或弹窗外部关闭弹窗

## 技术实现

- **前端框架**: React + Ant Design
- **状态管理**: React Hooks (useState, useEffect, useCallback)
- **API调用**: 自定义API服务
- **文件处理**: Blob API用于文件下载
- **时间处理**: dayjs库
- **样式**: SCSS + CSS Modules

## 注意事项

1. 确保后端API服务已启动并正常运行
2. 确保 `smile_test_files` 表已创建并包含数据
3. 文件下载功能需要后端返回正确的Blob数据
4. 删除操作需要用户确认（可在后续版本中添加确认对话框）

## 后续优化建议

1. 添加文件预览功能
2. 添加批量下载功能
3. 添加文件搜索和筛选功能
4. 添加文件上传进度显示
5. 添加删除确认对话框
6. 添加文件大小显示

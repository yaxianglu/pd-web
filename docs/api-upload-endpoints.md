# 文件上传API接口规范

## 概述

为了支持大文件上传，我们提供了两种上传方式：
1. **二进制直接上传** - 适用于中小型文件（< 10MB）
2. **分块上传** - 适用于大文件（≥ 10MB）

## 二进制直接上传

### 端点
```
POST /api/smile-test/uuid/{uuid}/upload-file
```

### 请求格式
- **Content-Type**: `application/octet-stream` 或文件的实际MIME类型
- **Body**: 文件的二进制数据
- **Headers**:
  - `Authorization: Bearer {token}`
  - `X-File-Name: {encoded_filename}` - URL编码的文件名
  - `X-File-Size: {file_size}` - 文件大小（字节）
  - `X-File-Type: {mime_type}` - 文件MIME类型
  - `X-Metadata-{key}: {encoded_value}` - 自定义元数据（可选）

### 响应格式
```json
{
  "success": true,
  "message": "文件上传成功",
  "data": {
    "fileId": "file_uuid",
    "filename": "original_filename.ext",
    "size": 1024000,
    "contentType": "image/jpeg",
    "uploadedAt": "2025-08-21T10:00:00Z"
  }
}
```

## 分块上传

### 1. 初始化上传

#### 端点
```
POST /api/smile-test/uuid/{uuid}/upload-file/initialize
```

#### 请求体
```json
{
  "uploadId": "upload_1692612000000_abc123def",
  "fileName": "large_file.pdf",
  "fileSize": 52428800,
  "totalChunks": 10,
  "contentType": "application/pdf",
  "smileTestUuid": "smile_test_uuid",
  "uploadType": "staff_file"
}
```

#### 响应
```json
{
  "success": true,
  "message": "上传初始化成功",
  "data": {
    "uploadId": "upload_1692612000000_abc123def",
    "chunkSize": 5242880,
    "totalChunks": 10
  }
}
```

### 2. 上传分块

#### 端点
```
POST /api/smile-test/uuid/{uuid}/upload-file/chunk
```

#### 请求格式
- **Content-Type**: `multipart/form-data`
- **Form Data**:
  - `uploadId`: 上传ID
  - `chunkIndex`: 分块索引（从0开始）
  - `totalChunks`: 总分块数
  - `chunk`: 文件分块（二进制数据）

#### 响应
```json
{
  "success": true,
  "message": "分块上传成功",
  "data": {
    "chunkIndex": 0,
    "uploaded": true
  }
}
```

### 3. 完成上传

#### 端点
```
POST /api/smile-test/uuid/{uuid}/upload-file/finalize
```

#### 请求体
```json
{
  "uploadId": "upload_1692612000000_abc123def"
}
```

#### 响应
```json
{
  "success": true,
  "message": "文件上传完成",
  "data": {
    "fileId": "file_uuid",
    "filename": "large_file.pdf",
    "size": 52428800,
    "contentType": "application/pdf",
    "uploadedAt": "2025-08-21T10:00:00Z",
    "chunks": 10
  }
}
```

## 错误处理

### 常见错误码
- `400` - 请求参数错误
- `401` - 未授权
- `413` - 文件过大
- `415` - 不支持的文件类型
- `422` - 分块上传状态错误
- `500` - 服务器内部错误

### 错误响应格式
```json
{
  "success": false,
  "message": "错误描述",
  "error": {
    "code": "ERROR_CODE",
    "details": "详细错误信息"
  }
}
```

## 后端实现要点

### 1. 文件存储
- 使用临时目录存储分块文件
- 完成上传后合并分块并移动到最终存储位置
- 支持云存储（如AWS S3、阿里云OSS等）

### 2. 安全性
- 验证文件类型和大小限制
- 检查上传权限
- 防止路径遍历攻击
- 病毒扫描（可选）

### 3. 清理机制
- 定期清理未完成的分块上传
- 清理临时文件
- 处理中断的上传会话

### 4. 并发处理
- 支持同时上传多个文件
- 处理分块上传的并发请求
- 使用分布式锁防止竞态条件

## 配置参数

```javascript
const UPLOAD_CONFIG = {
  maxFileSize: 100 * 1024 * 1024, // 100MB
  chunkSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  tempDir: '/tmp/uploads',
  finalDir: '/uploads/smile-tests',
  cleanupInterval: 60 * 60 * 1000, // 1小时
  uploadTimeout: 30 * 60 * 1000 // 30分钟
};
```

## Node.js 示例实现

### 初始化上传
```javascript
app.post('/api/smile-test/uuid/:uuid/upload-file/initialize', async (req, res) => {
  try {
    const { uuid } = req.params;
    const { uploadId, fileName, fileSize, totalChunks, contentType } = req.body;
    
    // 验证参数
    if (!uploadId || !fileName || !fileSize) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }
    
    // 创建上传会话
    const session = await createUploadSession({
      uploadId,
      smileTestUuid: uuid,
      fileName,
      fileSize,
      totalChunks,
      contentType,
      createdAt: new Date()
    });
    
    res.json({
      success: true,
      message: '上传初始化成功',
      data: {
        uploadId,
        chunkSize: UPLOAD_CONFIG.chunkSize,
        totalChunks
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '初始化失败',
      error: error.message
    });
  }
});
```

### 上传分块
```javascript
app.post('/api/smile-test/uuid/:uuid/upload-file/chunk', upload.single('chunk'), async (req, res) => {
  try {
    const { uploadId, chunkIndex, totalChunks } = req.body;
    const chunk = req.file;
    
    if (!chunk || !uploadId || chunkIndex === undefined) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }
    
    // 保存分块文件
    const chunkPath = path.join(UPLOAD_CONFIG.tempDir, uploadId, `chunk_${chunkIndex}`);
    await fs.ensureDir(path.dirname(chunkPath));
    await fs.move(chunk.path, chunkPath);
    
    // 更新上传会话
    await updateChunkStatus(uploadId, parseInt(chunkIndex));
    
    res.json({
      success: true,
      message: '分块上传成功',
      data: {
        chunkIndex: parseInt(chunkIndex),
        uploaded: true
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '分块上传失败',
      error: error.message
    });
  }
});
```

### 完成上传
```javascript
app.post('/api/smile-test/uuid/:uuid/upload-file/finalize', async (req, res) => {
  try {
    const { uuid } = req.params;
    const { uploadId } = req.body;
    
    const session = await getUploadSession(uploadId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: '上传会话不存在'
      });
    }
    
    // 合并分块文件
    const finalPath = await mergeChunks(uploadId, session);
    
    // 更新数据库
    const fileRecord = await saveFileRecord({
      smileTestUuid: uuid,
      filename: session.fileName,
      size: session.fileSize,
      contentType: session.contentType,
      path: finalPath,
      uploadedAt: new Date()
    });
    
    // 清理临时文件
    await cleanupUploadSession(uploadId);
    
    res.json({
      success: true,
      message: '文件上传完成',
      data: fileRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '完成上传失败',
      error: error.message
    });
  }
});
```
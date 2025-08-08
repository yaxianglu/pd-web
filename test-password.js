// 測試密码加密
const crypto = require('crypto');

const password = 'P@rlD1g1t@l2024!';
const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

console.log('原始密码:', password);
console.log('加密后密码:', hashedPassword);
console.log('数据库中存储的密码:', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');
console.log('匹配结果:', hashedPassword === '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'); 
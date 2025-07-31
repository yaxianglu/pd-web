const fs = require('fs');

// 读取 JSON 文件
const json = require('./origin/1/1.json');

// 生成 SCSS 片段
const scss = json.layers.map(layer => {
  // 处理 class 名，去除空格和特殊字符
  let className = `.block-${layer.name.replace(/\s+/g, '')}`;
  let props = [];
  if (layer.width) props.push(`  width: ${layer.width}px;`);
  if (layer.height) props.push(`  height: ${layer.height}px;`);
  if (layer.fontSize) props.push(`  font-size: ${layer.fontSize}px;`);
  if (layer.lineHeight) props.push(`  line-height: ${layer.lineHeight}px;`);
  return `${className} {\n${props.join('\n')}\n}`;
}).join('\n\n');

// 输出到 blocks.scss
fs.writeFileSync('blocks.scss', scss);

console.log('SCSS 生成完毕，已输出到 blocks.scss'); 
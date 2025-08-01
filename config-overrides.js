module.exports = function override(config, env) {
  // 完全禁用SVG文件的Babel处理
  config.module.rules.forEach(rule => {
    if (rule.oneOf) {
      // 找到并移除所有处理SVG的规则
      rule.oneOf = rule.oneOf.filter(oneOfRule => {
        if (oneOfRule.test && oneOfRule.test.toString().includes('svg')) {
          return false; // 移除SVG处理规则
        }
        return true;
      });
    }
  });

  // 添加一个简单的file-loader规则来处理SVG文件，不经过Babel处理
  config.module.rules.push({
    test: /\.svg$/,
    use: {
      loader: 'file-loader',
      options: {
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
  });

  return config;
}; 
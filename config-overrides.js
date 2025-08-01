module.exports = function override(config, env) {
  // 完全绕过Babel处理，直接复制SVG文件
  config.module.rules.forEach(rule => {
    if (rule.oneOf) {
      // 移除所有处理SVG的规则
      rule.oneOf = rule.oneOf.filter(oneOfRule => {
        if (oneOfRule.test && oneOfRule.test.toString().includes('svg')) {
          return false; // 完全移除SVG处理规则
        }
        return true;
      });
    }
  });

  // 添加简单的复制规则，不经过任何Babel处理
  config.module.rules.push({
    test: /\.svg$/,
    use: {
      loader: 'file-loader',
      options: {
        name: 'static/media/[name].[hash:8].[ext]',
        esModule: false,
        limit: 1, // 强制使用file-loader
      },
    },
  });

  return config;
}; 
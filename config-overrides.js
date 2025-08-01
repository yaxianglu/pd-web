module.exports = function override(config, env) {
  // 完全绕过Babel处理，直接复制SVG文件，减少内存使用
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

  // 生产环境优化，减少内存使用
  if (env === 'production') {
    // 禁用source map生成
    config.devtool = false;
    
    // 优化splitChunks，减少内存使用
    config.optimization = config.optimization || {};
    config.optimization.splitChunks = {
      chunks: 'all',
      maxSize: 244000, // 限制chunk大小
      cacheGroups: {
        default: {
          minChunks: 1,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'all',
        },
      },
    };
  }

  return config;
}; 
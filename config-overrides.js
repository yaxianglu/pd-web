module.exports = function override(config, env) {
  // 生产环境优化，减少内存使用
  if (env === 'production') {
    // 禁用source map生成，节省大量内存
    config.devtool = false;
    
    // 禁用代码分割，减少内存使用
    config.optimization = config.optimization || {};
    config.optimization.splitChunks = false;
    config.optimization.runtimeChunk = false;
  }

  // SVG处理：完全绕过Babel，直接复制文件
  config.module.rules.forEach(rule => {
    if (rule.oneOf) {
      rule.oneOf.forEach(oneOfRule => {
        if (oneOfRule.test && oneOfRule.test.toString().includes('svg')) {
          // 对于SVG文件，强制使用file-loader，设置极小的limit
          if (oneOfRule.use && oneOfRule.use.length > 0) {
            oneOfRule.use.forEach(useItem => {
              if (useItem.loader && useItem.loader.includes('url-loader')) {
                useItem.loader = 'file-loader';
                useItem.options = {
                  name: 'static/media/[name].[hash:8].[ext]',
                  limit: 1, // 强制使用file-loader
                };
              }
            });
          }
        }
      });
    }
  });

  return config;
}; 
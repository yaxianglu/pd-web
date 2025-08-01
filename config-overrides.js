module.exports = function override(config, env) {
  // 最简单的SVG处理方式：直接复制文件
  config.module.rules.forEach(rule => {
    if (rule.oneOf) {
      rule.oneOf.forEach(oneOfRule => {
        if (oneOfRule.test && oneOfRule.test.toString().includes('svg')) {
          // 对于SVG文件，强制使用file-loader
          if (oneOfRule.use && oneOfRule.use.length > 0) {
            oneOfRule.use.forEach(useItem => {
              if (useItem.loader && useItem.loader.includes('url-loader')) {
                useItem.loader = 'file-loader';
                useItem.options = {
                  name: 'static/media/[name].[hash:8].[ext]',
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
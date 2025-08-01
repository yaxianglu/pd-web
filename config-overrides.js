module.exports = function override(config, env) {
  // 修改SVG处理规则，避免Babel优化但保持文件完整性
  config.module.rules.forEach(rule => {
    if (rule.oneOf) {
      rule.oneOf.forEach(oneOfRule => {
        if (oneOfRule.test && oneOfRule.test.toString().includes('svg')) {
          // 对于SVG文件，使用file-loader而不是url-loader，避免Babel处理
          if (oneOfRule.use && oneOfRule.use.length > 0) {
            oneOfRule.use.forEach(useItem => {
              if (useItem.loader && useItem.loader.includes('url-loader')) {
                // 将url-loader替换为file-loader
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
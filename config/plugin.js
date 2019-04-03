'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  /**
   * 静态资源服务
   */
  static: {
    enable: true,
  },
  /**
   * EJS 模板渲染
   */
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },
  /**
   * 请求代理
   */
  xxmiEggProxy: {
    enable: true,
    package: 'xxmi-egg-proxy',
  },
};

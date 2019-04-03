/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');

/**
 * @param {Egg.EggAppInfo} app app info
 */
module.exports = app => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = app.name + '_xxmi_org_security';

  // add your middleware config here
  config.middleware = [];

  // 静态服务
  config.static = {
    maxAge: 0, // maxAge 缓存，默认 1 年
    prefix: '/public/',
    dir: [ path.join(app.baseDir, 'public'), path.join(app.baseDir, 'static') ],
  };

  config.view = {
    mapping: {
      '.ejs': 'ejs',
    },
  };
  config.ejs = {};

  config.xxmiEggProxy = {
    host: 'http://localhost:8001',
    proxy: /^\/api/,
  };
  const userConfig = { // 用户配置
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};

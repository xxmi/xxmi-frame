'use strict';

/**
 * 静态资源服务
 */
exports.static = {
  enable: true,
};
/**
 * EJS 模板渲染
 */
exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};
/**
 * 请求代理
 */
exports.xxmiEggProxy = {
  enable: true,
  package: 'xxmi-egg-proxy',
};

// redis 缓存配置
exports.redis = {
  enable: true,
  package: 'egg-redis',
};

// 登录认证 --开始----------------------------------------
exports.passport = {
  enable: true,
  package: 'egg-passport',
};

exports.passportLocal = {
  enable: true,
  package: 'passport-local',
};

exports.session = true;

// 用于把 session 放在 redis 中（单独配置，只用于登录认证，不做其他用途）
exports.sessionRedis = {
  enable: true,
  package: 'egg-session-redis',
};

// 登录认证 --结束----------------------------------------

exports.xxmiCore = {
  enable: true,
  package: 'egg-xxmi-core',
};


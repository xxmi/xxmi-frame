/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');
const ms = require('ms');

/**
 * @param {Egg.EggAppInfo} app app info
 */
module.exports = app => {
  const config = {};
  /**
   * 静态服务
   * @type {{maxAge: number, prefix: string, dir: string[]}}
   */
  config.static = {
    maxAge: 0, // maxAge 缓存，默认 1 年
    prefix: '/public/',
    dir: [ path.join(app.baseDir, 'public'), path.join(app.baseDir, 'static') ],
  };

  /**
   * 视图
   * @type {{mapping: {".ejs": string}}}
   */
  config.view = {
    mapping: {
      '.ejs': 'ejs',
      '.html': 'ejs',
    },
  };

  /**
   * ejs 模板
   * @type {{}}
   */
  config.ejs = {};

  /**
   * 代理
   * @type {{proxy: RegExp, host: string}}
   */
  config.xxmiProxy = {
    host: 'http://localhost:8001',
    proxy: /^\/api/,
  };

  /**
   * redis 缓存
   * @type {{agent: boolean, client: {password: string, port: string, host: string, db: string}}}
   */
  config.redis = {
    client: {
      host: 'localhost',
      port: '6379',
      password: '',
      db: '12',
    },
    agent: true,
  };

  /**
   * session 存储到 redis key 的前缀
   * @type {{prefix: string}}
   */
  config.sessionStore = {
    prefix: 'login-session',
  };

  /**
   * Session 扩展存储，解决 Session 值过大，在 app.js 中配置，一般用 Redis 来替代。
   * @type {{maxAge: number, encrypt: boolean, httpOnly: boolean, renew: boolean, key: string}}
   */
  config.session = {
    key: 'PASSPORT_SESSION',
    // maxAge: ms('30m'), // 30 分钟 （单位毫秒）
    maxAge: 0, // 必须设置为 0 ，否则会出现在没有勾选“记住我”关闭浏览器，在打开网页 session 没有失效
    httpOnly: true, // 设置键值对是否可以被 js 访问，默认为 true，不允许被 js 访问
    encrypt: true, // 设置是否对 Cookie 进行加密，如果设置为 true，则在发送 Cookie 前会对这个键值对的值进行加密，客户端无法读取到 Cookie 的明文值。默认为 false
    renew: true, // 自动延长延长用户 Session 有效期（详见最底部【 延长用户 Session 有效期】 https://eggjs.org/zh-cn/core/cookie-and-session.html#session）
  };

  /**
   * 记住我 ms 文档（https://github.com/zeit/ms）
   * @type {{maxAge}}
   */
  config.rememberMe = {
    maxAge: ms('7 days'), // 默认7天
  };

  // 用于cookie的签名密钥，应改为您自己的并保持安全
  config.keys = app.name + '_xxmi_org_security';

  // 登录认证
  config.passportLocal = {
    usernameField: 'account', // 定义username 用什么字段
    passwordField: 'password',
  };

  config.security = {
    // domainWhiteList: ['http://localhost:8100'], // 白名单 CORS
  };

  config.cors = {
    credentials: true,
    domainWhiteList: [ '*' ], // 允许所有的域名访问
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  const userConfig = { // 用户配置
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};

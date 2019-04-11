'use strict';
// 本地策略
const LocalStrategy = require('passport-local').Strategy;
module.exports = app => {
  const config = app.config;
  const SESSION_STORE_PREFIX = config.sessionStore.prefix || 'login-session';

  // 登录认证--------------- start ------------------------------------------------------
  // 挂载 strategy
  app.passport.use(new LocalStrategy({
    usernameField: 'account', // 指定用户名字段
    passwordField: 'password', // 指定密码字段
    passReqToCallback: true,
  }, (req, account, password, done) => {
    const user = {
      provider: 'local', // 提供者名称，登录的 Controller 必须登录策略必须指定为 local
      account,
      password,
    };
    app.passport.doVerify(req, user, done);
  }));

  // 序列化用户信息
  app.passport.serializeUser(async (ctx, user) => {
    ctx.session.user = user;
    return user;
  });
  // 反序列化用户信息
  app.passport.deserializeUser(async (ctx, user) => {
    return user;
  });
  // session 存储到 redis 缓存
  app.sessionStore = class Store {
    constructor(app) {
      this.app = app;
    }

    async get(key) {
      const res = await app.redis.get(`${SESSION_STORE_PREFIX}:${key}`);
      if (!res) return null;
      return JSON.parse(res);
    }

    async set(key, value, maxAge) {
      // maxAge 设置会话时间
      if (!maxAge) maxAge = 24 * 60 * 60 * 1000;
      value = JSON.stringify(value);
      await app.redis.set(`${SESSION_STORE_PREFIX}:${key}`, value, 'PX', maxAge);
    }

    async destroy(key) {
      await app.redis.del(`${SESSION_STORE_PREFIX}:${key}`);
    }
  };
  // 登录认证-------------------------- end -------------------------------------------
};

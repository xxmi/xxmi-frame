'use strict';
// 本地策略
const LocalStrategy = require('passport-local').Strategy;
module.exports = app => {
  const config = app.config;

  // 登录认证--------------- start ------------------------------------------------------
  // 挂载 strategy
  app.passport.use(new LocalStrategy({
    usernameField: 'account', // 指定用户名字段
    passwordField: 'password', // 指定密码字段
    passReqToCallback: true,
  }, (req, account, password, done) => {
    const user = {
      provider: 'local',
      account,
      password,
    };
    app.passport.doVerify(req, user, done);
  }));

  // 登录校验逻辑
  app.passport.verify(async (ctx, user) => {
    const {config} = ctx.app;
    const {status, result} = await HttpApi(ctx, config.api.baseURL, false);
    return {status, result};
  });
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
      const res = await app.redis.get(`login-session:${key}`);
      if (!res) return null;
      return JSON.parse(res);
    }

    async set(key, value, maxAge) {
      // maxAge not present means session cookies
      // we can't exactly know the maxAge and just set an appropriate value like one day
      if (!maxAge) maxAge = 24 * 60 * 60 * 1000;
      value = JSON.stringify(value);
      await app.redis.set(`login-session:${key}`, value, 'PX', maxAge);
    }

    async destroy(key) {
      await app.redis.del(`login-session:${key}`);
    }
  };
  // 登录认证-------------------------- end -------------------------------------------
};

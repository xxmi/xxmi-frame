'use strict';

const { Controller } = require('egg');

class LoginController extends Controller {

  async index() {
    const { ctx, ctx: { csrf } } = this;
    await ctx.render('login.ejs', { csrf });
  }

  async login() {
    const { app, config, ctx, ctx: { request, logger } } = this;
    const { body: { rememberMe, account, password } } = request;
    const isLogin = account === 'admin' && password === '123456';
    logger.info('isLogin', isLogin);
    const result = await new Promise(resolve => {
      app.passport.authenticate('local', async (error, response) => {
        logger.debug(error, response);
        if (!isLogin) {
          resolve({ code: 200100, message: '账号或者密码错误' });
        }
        if (rememberMe) {
          ctx.session.maxAge = config.rememberMe.maxAge; // 设置 session 过期时间
        }
        const user = { userName: 'xxmi.org' };
        // 为用户启动一个登录的 session
        ctx.login(user, err => {
          logger.error(err);
        });
        resolve({ code: 200, message: '登录成功', data: user });
      })(ctx);
    });
    ctx.status = 200;
    ctx.body = result;
  }
}

module.exports = LoginController;

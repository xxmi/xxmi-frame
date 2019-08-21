'use strict';

const { Controller } = require('egg');

class AdminController extends Controller {

  /**
   * 注意坑：ctx.render 必须用 await（否则会出现找不到页面，一直报 404 ）
   * @return {Promise<void>}
   */
  async index() {
    const { ctx } = this;
    await ctx.render('admin.ejs', { user: ctx.session.user });
  }
}

module.exports = AdminController;

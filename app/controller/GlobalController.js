'use strict';

const { Controller } = require('egg');

class GlobalController extends Controller {

  async notFound() {
    const { ctx } = this;
    await ctx.render('404.ejs');
  }
}

module.exports = GlobalController;

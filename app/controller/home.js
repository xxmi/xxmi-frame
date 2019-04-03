'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async news() {
    const { ctx } = this;
    await ctx.render('news/index.ejs', { name: 'My name is ejs' });
  }
}

module.exports = HomeController;

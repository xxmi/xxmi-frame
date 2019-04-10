module.exports = () => {
  return async function notFound(ctx, next) {
    await next();
    const accept = ctx.accept;
    const headers = accept.headers;
    if (ctx.status === 404 && !ctx.body) {
      if (ctx.acceptJSON || (headers['content-type'] && headers['content-type'] === 'application/json')) {
        ctx.body = {code: '404', error: 'Not Found'};
        ctx.status = 404;
      } else {
        ctx.redirect('/404');
      }
    }
  };
};
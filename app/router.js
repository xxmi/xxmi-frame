'use strict';

module.exports = app => {
  const {
    router,
    controller: {
      adminController,
      globalController,
      loginController,
    },
  } = app;

  router.get('/404', globalController.notFound);

  router.get('/login', loginController.index);
  router.post('/login', loginController.login);

  router.get('/admin', adminController.index);
};

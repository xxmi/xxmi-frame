const sendToWormhole = require('stream-wormhole');
const FormStream = require('formstream');
const fs = require('fs');
const path = require('path');
const awaitWriteStream = require('await-stream-ready').write;
const uuidv4 = require('uuid/v4');
const fsExtra = require('fs-extra');
module.exports = () => {
  return async function uploadFile (ctx, next) {
    const {app} = ctx;
    const config = app.config;
    const {uploadFile: {baseDir, tempPath}} = config.xxmiCore;
    ctx.upload = {
      formStream: null,
      field: {}
    };
    // 请求头 ContentType 为 multipart/* 的才做文件上传，保存到临时目录
    const contentType = ctx.get('Content-Type');
    const isMultipart = /^(multipart)\/*/.test(contentType);
    if (!isMultipart) {
      return await next();
    }
    try {
      const parts = ctx.multipart({autoFields: true});
      const formStream = new FormStream();
      let stream;
      // 临时目录路径
      const dirPath = baseDir ? path.join(config.baseDir, tempPath) : tempPath;
      // 临时目录（没有则创建该目录）
      fsExtra.ensureDirSync(dirPath);
      while ((stream = await parts()) != null) {
        const filename = stream.filename.toLowerCase();
        const target = path.join(dirPath, uuidv4() + filename);
        // 保存到临时目录
        const writeStream = fs.createWriteStream(target);
        try {
          await awaitWriteStream(stream.pipe(writeStream));
          formStream.file(stream.fieldname, target, filename);
        } catch (err) {
          // 报错时必须要清除 stream 不然浏览器会一直卡在哪里不动
          await sendToWormhole(stream);
        }
      }
      const field = parts.field || {}; // 非文件类型的参数
      ctx.upload.field = field;
      for (const key in field) {
        formStream.field(key, field[key]);
      }
      ctx.upload.formStream = formStream;
    } catch (error) {
      console.log(error);
    }
    await next();
  };
};
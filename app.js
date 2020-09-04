const Koa = require('koa');
var Router = require('koa-router');
const path = require('path');
const fs = require('fs');

const koaStatic = require('koa-static');

const app = new Koa();


app.use(koaStatic("public"));




var router = new Router();

router.get('/', (ctx, next) => {
    ctx.type = 'html';
    const pathToHtml = path.join(__dirname, 'home.html');
    ctx.body = fs.createReadStream(pathToHtml);
});


app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);
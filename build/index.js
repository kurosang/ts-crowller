"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
var router_1 = __importDefault(require("./router"));
var koa_session_1 = __importDefault(require("koa-session"));
var koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
var app = new koa_1.default();
app.use(koa_bodyparser_1.default());
// // 自己写一个中间件，往request上挂东西
// app.use((ctx, next) => {
//   ;(ctx.request as Request).name = '123'
//   next()
// })
app.keys = ['some secret hurr'];
var CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
};
app.use(koa_session_1.default(CONFIG, app));
app.use(router_1.default.routes()); // 启动路由
app.use(router_1.default.allowedMethods()); // 可以配置也可以配置，建议配置
app.listen(3000, function () {
    console.log('server running at 3000');
});

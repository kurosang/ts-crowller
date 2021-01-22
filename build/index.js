"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
var router_1 = __importDefault(require("./router"));
var app = new koa_1.default();
app.use(router_1.default.routes()); // 启动路由
app.use(router_1.default.allowedMethods()); // 可以配置也可以配置，建议配置
app.listen(3000, function () {
    console.log('server running at 3000');
});

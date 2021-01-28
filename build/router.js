"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var koa_router_1 = __importDefault(require("koa-router"));
var crowller_1 = __importDefault(require("./utils/crowller"));
var analyzer_1 = __importDefault(require("./utils/analyzer"));
var util_1 = require("./utils/util");
var checkLogin = function (ctx, next) {
    var isLogin = ctx.session ? ctx.session.login : undefined;
    if (isLogin) {
        next();
    }
    else {
        ctx.body = util_1.getResponseData(null, '请先登录');
    }
};
var router = new koa_router_1.default();
router.get('/', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var isLogin;
    return __generator(this, function (_a) {
        isLogin = ctx.session ? ctx.session.login : undefined;
        if (isLogin) {
            ctx.body = "\n    <html>\n      <body>\n        <a href=\"/showData\">\u663E\u793A</a>\n        <a href=\"/getData\">\u722C\u53D6</a>\n        <a href=\"/logout\">\u9000\u51FA</a>\n      </body>\n    </html>\n    ";
        }
        else {
            ctx.body = "\n    <html>\n      <body>\n        <form method=\"post\" action=\"/login\">\n          <input type=\"password\" name=\"password\"/>\n          <button>\u63D0\u4EA4</button>\n        </form>\n      </body>\n    </html>";
        }
        return [2 /*return*/];
    });
}); });
router.get('/logout', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (ctx.session) {
            ctx.session.login = undefined;
        }
        ctx.body = util_1.getResponseData(true);
        return [2 /*return*/];
    });
}); });
router.post('/login', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var password, isLogin;
    return __generator(this, function (_a) {
        password = ctx.request.body.password;
        isLogin = ctx.session ? ctx.session.login : undefined;
        if (isLogin) {
            ctx.body = util_1.getResponseData(false, '你已经登录过');
        }
        else {
            if (password === '123' && ctx.session) {
                ctx.session.login = true;
                ctx.body = util_1.getResponseData(true, '登陆成功');
            }
            else {
                ctx.body = util_1.getResponseData(false, '登录失败');
            }
        }
        return [2 /*return*/];
    });
}); });
router.get('/getData', checkLogin, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var url, analyzer;
    return __generator(this, function (_a) {
        url = "https://cnodejs.org/?tab=good";
        analyzer = analyzer_1.default.getInstance();
        new crowller_1.default(url, analyzer);
        ctx.body = util_1.getResponseData(true);
        return [2 /*return*/];
    });
}); });
router.get('/showData', checkLogin, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var postion, result;
    return __generator(this, function (_a) {
        try {
            postion = path_1.default.resolve(__dirname, '../data/articles.json');
            result = fs_1.default.readFileSync(postion, 'utf-8');
            ctx.body = util_1.getResponseData(result);
        }
        catch (error) {
            ctx.body = util_1.getResponseData(false, '尚未爬取到内容');
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
